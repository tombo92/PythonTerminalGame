/**
 * review-mode.js — Hidden in-game reviewer / bug-report tool
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Drop-in, self-contained, framework-free. Works in any HTML game.
 *
 * ACTIVATION (hidden from normal users):
 *   • URL param:        ?review=1
 *   • Secret sequence:  type the letters  r e v i e w  within 1.5s
 *                       (anywhere on the page, not inside an input)
 *
 * USE:
 *   1. Activate.
 *   2. A toolbar appears bottom-right: 🐞 REVIEW MODE [n notes].
 *   3. Right-click any element to attach a bug/comment annotation.
 *   4. Click EXPORT → downloads a Markdown report (LLM-prompt-ready).
 *   5. Annotations persist in localStorage until you CLEAR them.
 *
 * GAME INTEGRATION (optional, recommended):
 *   Set `window.GAME_ID` (string) and define
 *   `window.__reviewContext = function () { return { scene: '...', sceneIndex: 3, ... }; }`
 *   to enrich every annotation with the current game state.
 *
 *   Setting `window.__reviewBypassGate = true` (default behaviour when active)
 *   tells the game to skip the PIN/login gate so reviewers don't need credentials.
 *
 * NO SERVER REQUIRED — everything happens client-side.
 */
(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────────────
  var URL_PARAM        = 'review';
  var SECRET_SEQUENCE  = 'review';   // 6 chars
  var SECRET_TIMEOUT   = 1500;        // ms between keystrokes
  var STORAGE_PREFIX   = 'gameReview:';
  var GAME_ID          = (window.GAME_ID || document.title || 'game')
                            .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  var STORAGE_KEY      = STORAGE_PREFIX + GAME_ID;

  // ── Runtime state ───────────────────────────────────────────────────────
  var active = false;
  var typed = '';
  var typedTimer = null;
  var pickedEl = null;
  var annotations = [];

  // ── Bootstrap ───────────────────────────────────────────────────────────
  function init() {
    annotations = loadAnnotations();
    if (urlActivated()) {
      activate();
    } else {
      // Listen for the secret sequence
      document.addEventListener('keydown', onSecretKey, true);
    }
  }

  function urlActivated() {
    try {
      var u = new URLSearchParams(window.location.search);
      var v = u.get(URL_PARAM);
      return v !== null && v !== '0' && v !== 'false';
    } catch (e) { return false; }
  }

  function onSecretKey(e) {
    if (active) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (!e.key || e.key.length !== 1) return;
    typed += e.key.toLowerCase();
    if (typed.length > SECRET_SEQUENCE.length) typed = typed.slice(-SECRET_SEQUENCE.length);
    clearTimeout(typedTimer);
    typedTimer = setTimeout(function () { typed = ''; }, SECRET_TIMEOUT);
    if (typed === SECRET_SEQUENCE) {
      typed = '';
      activate();
    }
  }

  // ── Activation ──────────────────────────────────────────────────────────
  function activate() {
    if (active) return;
    active = true;
    window.__reviewMode = true;
    window.__reviewBypassGate = true;
    injectStyle();
    buildToolbar();
    document.addEventListener('contextmenu', onRightClick, true);
    document.addEventListener('keydown', onActiveKey, true);
    // Notify the host game (it may want to unlock its gate)
    try { window.dispatchEvent(new CustomEvent('reviewmode:activated')); } catch (e) {}
    flashToast('🐞 Review mode activated — right-click any element to annotate');
  }

  function onActiveKey(e) {
    // ESC closes the modal
    if (e.key === 'Escape') {
      var m = document.getElementById('__rv_modal');
      if (m && !m.classList.contains('__rv_hidden')) { closeModal(); e.preventDefault(); }
    }
  }

  // ── Right-click handler ─────────────────────────────────────────────────
  function onRightClick(e) {
    // Allow normal context menu inside our own UI
    if (e.target.closest && e.target.closest('#__rv_toolbar, #__rv_modal')) return;
    e.preventDefault();
    e.stopPropagation();
    pickedEl = e.target;
    highlight(pickedEl);
    openModal(pickedEl, { x: e.clientX, y: e.clientY });
  }

  // ── Element selector helpers ────────────────────────────────────────────
  function shortSelector(el) {
    if (!el || el === document.body) return 'body';
    var parts = [];
    var cur = el;
    var depth = 0;
    while (cur && cur.nodeType === 1 && cur !== document.body && depth < 4) {
      var s = cur.tagName.toLowerCase();
      if (cur.id) { s += '#' + cur.id; parts.unshift(s); break; }
      var cls = (cur.className || '').toString().trim().split(/\s+/)
        .filter(function (c) { return c && !c.startsWith('__rv'); }).slice(0, 2);
      if (cls.length) s += '.' + cls.join('.');
      // nth-of-type for disambiguation
      var sib = cur.parentNode ? Array.prototype.filter.call(
        cur.parentNode.children,
        function (n) { return n.tagName === cur.tagName; }
      ) : [];
      if (sib.length > 1) s += ':nth-of-type(' + (sib.indexOf(cur) + 1) + ')';
      parts.unshift(s);
      cur = cur.parentNode;
      depth++;
    }
    return parts.join(' > ');
  }

  function snippet(el) {
    if (!el) return '';
    var t = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
    return t.length > 140 ? t.slice(0, 140) + '…' : t;
  }

  function captureContext() {
    var ctx = { url: location.href };
    try {
      if (typeof window.__reviewContext === 'function') {
        var c = window.__reviewContext();
        if (c && typeof c === 'object') Object.assign(ctx, c);
      }
    } catch (e) { ctx.contextError = String(e); }
    return ctx;
  }

  // ── Highlight pulse ─────────────────────────────────────────────────────
  function highlight(el) {
    if (!el || !el.classList) return;
    el.classList.add('__rv_target');
    setTimeout(function () { el.classList.remove('__rv_target'); }, 1200);
  }

  // ── Storage ─────────────────────────────────────────────────────────────
  function loadAnnotations() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveAnnotations() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations)); } catch (e) {}
  }

  function addAnnotation(a) {
    annotations.push(a);
    saveAnnotations();
    refreshCount();
  }

  // ── UI: Toolbar ─────────────────────────────────────────────────────────
  function buildToolbar() {
    var bar = document.createElement('div');
    bar.id = '__rv_toolbar';
    bar.innerHTML =
      '<span class="__rv_badge">🐞 REVIEW</span>' +
      '<span class="__rv_count" id="__rv_count">' + annotations.length + ' notes</span>' +
      '<button id="__rv_export" title="Download Markdown report">⇩ Export</button>' +
      '<button id="__rv_view"   title="View notes">📋 List</button>' +
      '<button id="__rv_clear"  title="Delete all notes">🗑️ Clear</button>' +
      '<button id="__rv_exit"   title="Exit review mode (reload)">✕</button>';
    document.body.appendChild(bar);
    document.getElementById('__rv_export').onclick = exportReport;
    document.getElementById('__rv_view').onclick   = openList;
    document.getElementById('__rv_clear').onclick  = clearAll;
    document.getElementById('__rv_exit').onclick   = exitMode;

    var modal = document.createElement('div');
    modal.id = '__rv_modal';
    modal.className = '__rv_hidden';
    document.body.appendChild(modal);
  }

  function refreshCount() {
    var c = document.getElementById('__rv_count');
    if (c) c.textContent = annotations.length + (annotations.length === 1 ? ' note' : ' notes');
  }

  function flashToast(msg) {
    var t = document.createElement('div');
    t.className = '__rv_toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('__rv_show'); }, 10);
    setTimeout(function () {
      t.classList.remove('__rv_show');
      setTimeout(function () { t.remove(); }, 350);
    }, 2200);
  }

  // ── UI: Annotation modal ────────────────────────────────────────────────
  function openModal(el, pos) {
    var sel = shortSelector(el);
    var txt = snippet(el);
    var ctx = captureContext();
    var ctxLines = Object.keys(ctx).map(function (k) {
      return '<div class="__rv_kv"><b>' + escapeHtml(k) + ':</b> ' + escapeHtml(String(ctx[k])) + '</div>';
    }).join('');

    var modal = document.getElementById('__rv_modal');
    modal.innerHTML =
      '<div class="__rv_dialog">' +
        '<div class="__rv_head">🐞 New annotation</div>' +
        '<div class="__rv_target-info">' +
          '<div class="__rv_kv"><b>selector:</b> <code>' + escapeHtml(sel) + '</code></div>' +
          (txt ? '<div class="__rv_kv"><b>text:</b> "' + escapeHtml(txt) + '"</div>' : '') +
          ctxLines +
        '</div>' +
        '<div class="__rv_row">' +
          '<label>Type<select id="__rv_type">' +
            '<option value="bug">🐛 bug</option>' +
            '<option value="copy">✏️ copy / text</option>' +
            '<option value="visual">🎨 visual</option>' +
            '<option value="audio">🔊 audio</option>' +
            '<option value="logic">🧠 logic / flow</option>' +
            '<option value="idea">💡 idea</option>' +
          '</select></label>' +
          '<label>Severity<select id="__rv_sev">' +
            '<option value="low">low</option>' +
            '<option value="medium" selected>medium</option>' +
            '<option value="high">high</option>' +
            '<option value="critical">critical</option>' +
          '</select></label>' +
        '</div>' +
        '<label class="__rv_full">Description<textarea id="__rv_desc" rows="4" placeholder="What is wrong / what should change?" autofocus></textarea></label>' +
        '<label class="__rv_full">Suggested fix (optional)<textarea id="__rv_fix" rows="2" placeholder="How would you fix it?"></textarea></label>' +
        '<div class="__rv_actions">' +
          '<button id="__rv_cancel">Cancel</button>' +
          '<button id="__rv_save" class="__rv_primary">Save note</button>' +
        '</div>' +
      '</div>';
    modal.classList.remove('__rv_hidden');
    setTimeout(function () { var d = document.getElementById('__rv_desc'); if (d) d.focus(); }, 30);
    document.getElementById('__rv_cancel').onclick = closeModal;
    document.getElementById('__rv_save').onclick = function () {
      var desc = document.getElementById('__rv_desc').value.trim();
      if (!desc) { document.getElementById('__rv_desc').style.outline = '2px solid #e74c3c'; return; }
      addAnnotation({
        id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        ts: new Date().toISOString(),
        type: document.getElementById('__rv_type').value,
        severity: document.getElementById('__rv_sev').value,
        description: desc,
        suggestedFix: document.getElementById('__rv_fix').value.trim(),
        selector: sel,
        text: txt,
        context: ctx,
      });
      closeModal();
      flashToast('✓ note saved (' + annotations.length + ' total)');
    };
  }

  function closeModal() {
    var modal = document.getElementById('__rv_modal');
    if (modal) modal.classList.add('__rv_hidden');
  }

  // ── UI: List of saved notes ─────────────────────────────────────────────
  function openList() {
    var modal = document.getElementById('__rv_modal');
    var rows = annotations.length
      ? annotations.map(function (a, i) {
          var ctxBits = Object.keys(a.context || {})
            .filter(function (k) { return k !== 'url'; })
            .slice(0, 3)
            .map(function (k) { return k + '=' + String(a.context[k]).slice(0, 30); })
            .join(' · ');
          return '<li>' +
            '<div class="__rv_li-head">' +
              '<span class="__rv_pill __rv_sev-' + a.severity + '">' + a.severity + '</span>' +
              '<span class="__rv_pill">' + a.type + '</span>' +
              '<span class="__rv_li-time">' + a.ts.replace('T', ' ').slice(0, 19) + '</span>' +
              '<button class="__rv_del" data-id="' + a.id + '" title="Delete">×</button>' +
            '</div>' +
            '<div class="__rv_li-desc">' + escapeHtml(a.description) + '</div>' +
            (a.suggestedFix ? '<div class="__rv_li-fix">→ ' + escapeHtml(a.suggestedFix) + '</div>' : '') +
            '<div class="__rv_li-meta"><code>' + escapeHtml(a.selector) + '</code>' +
              (ctxBits ? ' &nbsp;|&nbsp; ' + escapeHtml(ctxBits) : '') +
            '</div>' +
          '</li>';
        }).join('')
      : '<li class="__rv_empty">No notes yet. Right-click any element to add one.</li>';

    modal.innerHTML =
      '<div class="__rv_dialog __rv_wide">' +
        '<div class="__rv_head">📋 Notes for <i>' + escapeHtml(GAME_ID) + '</i> (' + annotations.length + ')</div>' +
        '<ul class="__rv_list">' + rows + '</ul>' +
        '<div class="__rv_actions">' +
          '<button id="__rv_cancel">Close</button>' +
          '<button id="__rv_export2" class="__rv_primary">⇩ Export Markdown</button>' +
        '</div>' +
      '</div>';
    modal.classList.remove('__rv_hidden');
    document.getElementById('__rv_cancel').onclick = closeModal;
    document.getElementById('__rv_export2').onclick = exportReport;
    Array.prototype.forEach.call(modal.querySelectorAll('.__rv_del'), function (btn) {
      btn.onclick = function () {
        var id = btn.getAttribute('data-id');
        annotations = annotations.filter(function (a) { return a.id !== id; });
        saveAnnotations();
        refreshCount();
        openList(); // re-render
      };
    });
  }

  // ── Export as Markdown (LLM-prompt-ready) ───────────────────────────────
  function exportReport() {
    if (!annotations.length) { flashToast('Nothing to export — add a note first'); return; }
    var md = buildMarkdown();
    var stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    download(GAME_ID + '-review-' + stamp + '.md', md, 'text/markdown');
    flashToast('⇩ exported ' + annotations.length + ' notes');
  }

  function buildMarkdown() {
    var lines = [];
    lines.push('# ' + GAME_ID + ' — Review Report');
    lines.push('');
    lines.push('**Generated:** ' + new Date().toISOString());
    lines.push('**Game:** ' + GAME_ID);
    lines.push('**URL:** ' + location.href);
    lines.push('**User agent:** ' + navigator.userAgent);
    lines.push('**Total annotations:** ' + annotations.length);
    lines.push('');
    lines.push('> This report was generated by the in-game review mode.');
    lines.push('> Paste it into an LLM with: *"Please address each annotation below.');
    lines.push('> For each one, identify the relevant source file and propose a fix."*');
    lines.push('');
    lines.push('---');
    lines.push('');

    // Group by severity desc
    var order = { critical: 0, high: 1, medium: 2, low: 3 };
    var sorted = annotations.slice().sort(function (a, b) {
      return (order[a.severity] || 9) - (order[b.severity] || 9);
    });

    sorted.forEach(function (a, i) {
      lines.push('## ' + (i + 1) + '. [' + a.severity.toUpperCase() + ' · ' + a.type + '] ' + firstLine(a.description));
      lines.push('');
      lines.push('- **Timestamp:** ' + a.ts);
      lines.push('- **Selector:** `' + a.selector + '`');
      if (a.text) lines.push('- **Element text:** "' + a.text.replace(/"/g, '\\"') + '"');
      if (a.context) {
        Object.keys(a.context).forEach(function (k) {
          lines.push('- **' + k + ':** ' + a.context[k]);
        });
      }
      lines.push('');
      lines.push('**Description:**');
      lines.push('');
      lines.push(a.description);
      if (a.suggestedFix) {
        lines.push('');
        lines.push('**Suggested fix:**');
        lines.push('');
        lines.push(a.suggestedFix);
      }
      lines.push('');
      lines.push('---');
      lines.push('');
    });

    return lines.join('\n');
  }

  function firstLine(s) {
    var l = (s || '').split('\n')[0].trim();
    return l.length > 80 ? l.slice(0, 80) + '…' : l;
  }

  function download(name, content, mime) {
    var blob = new Blob([content], { type: mime || 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
  }

  // ── Misc ────────────────────────────────────────────────────────────────
  function clearAll() {
    if (!annotations.length) { flashToast('Nothing to clear'); return; }
    if (!confirm('Delete all ' + annotations.length + ' notes for "' + GAME_ID + '"?')) return;
    annotations = [];
    saveAnnotations();
    refreshCount();
    flashToast('All notes cleared');
  }

  function exitMode() {
    if (!confirm('Exit review mode? (page will reload)')) return;
    var u = new URL(location.href);
    u.searchParams.delete(URL_PARAM);
    location.href = u.toString();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  // ── Styles (scoped via __rv_ prefix) ────────────────────────────────────
  function injectStyle() {
    var css =
      '#__rv_toolbar{position:fixed;right:14px;bottom:14px;z-index:2147483646;' +
        'display:flex;gap:6px;align-items:center;padding:6px 10px;' +
        'background:#0a0a0f;color:#fff;border:2px solid #e74c3c;border-radius:8px;' +
        'font:600 12px/1 system-ui,sans-serif;box-shadow:0 4px 24px rgba(0,0,0,.5);' +
        'backdrop-filter:blur(6px)}' +
      '#__rv_toolbar .__rv_badge{color:#e74c3c;text-shadow:0 0 6px #e74c3c}' +
      '#__rv_toolbar .__rv_count{color:#bbb;font-weight:400;margin-right:6px}' +
      '#__rv_toolbar button{background:#1a1a22;color:#fff;border:1px solid #444;' +
        'border-radius:5px;padding:5px 9px;font:600 11px/1 system-ui,sans-serif;cursor:pointer;' +
        'transition:background .15s}' +
      '#__rv_toolbar button:hover{background:#e74c3c;border-color:#e74c3c}' +

      '.__rv_target{outline:3px dashed #e74c3c !important;outline-offset:2px !important;' +
        'animation:__rv_pulse 1.2s ease;box-shadow:0 0 20px rgba(231,76,60,.6) !important}' +
      '@keyframes __rv_pulse{0%,100%{outline-color:#e74c3c}50%{outline-color:#ffeb3b}}' +

      '#__rv_modal{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.65);' +
        'display:flex;align-items:center;justify-content:center;padding:20px;' +
        'animation:__rv_fade .2s ease}' +
      '#__rv_modal.__rv_hidden{display:none}' +
      '@keyframes __rv_fade{from{opacity:0}to{opacity:1}}' +
      '.__rv_dialog{background:#fff;color:#222;max-width:560px;width:100%;max-height:88vh;' +
        'overflow:auto;border-radius:12px;padding:22px;font:14px/1.5 system-ui,sans-serif;' +
        'box-shadow:0 24px 60px rgba(0,0,0,.4)}' +
      '.__rv_dialog.__rv_wide{max-width:760px}' +
      '.__rv_head{font-size:1.05rem;font-weight:700;margin-bottom:14px;' +
        'padding-bottom:10px;border-bottom:2px solid #eee;color:#e74c3c}' +
      '.__rv_target-info{background:#f7f7fa;border:1px solid #e0e0e8;border-radius:6px;' +
        'padding:10px 12px;font-size:12px;margin-bottom:14px;max-height:160px;overflow:auto}' +
      '.__rv_kv{margin:3px 0;word-break:break-word}' +
      '.__rv_kv code{background:#e8e8f0;padding:1px 5px;border-radius:3px;font-size:11px}' +
      '.__rv_row{display:flex;gap:12px;margin-bottom:10px}' +
      '.__rv_row label{flex:1;display:flex;flex-direction:column;font-size:12px;font-weight:600;color:#555;gap:4px}' +
      '.__rv_row select,.__rv_full select,.__rv_full textarea{' +
        'width:100%;padding:7px 9px;border:1px solid #ccc;border-radius:5px;' +
        'font:14px/1.4 system-ui,sans-serif;background:#fff}' +
      '.__rv_full{display:block;margin-bottom:12px;font-size:12px;font-weight:600;color:#555}' +
      '.__rv_full textarea{margin-top:4px;font:13px/1.4 ui-monospace,monospace;resize:vertical}' +
      '.__rv_actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}' +
      '.__rv_actions button{padding:8px 16px;border:1px solid #ccc;background:#f4f4f4;' +
        'border-radius:6px;cursor:pointer;font:600 13px/1 system-ui,sans-serif}' +
      '.__rv_actions button:hover{background:#e8e8e8}' +
      '.__rv_actions .__rv_primary{background:#e74c3c;border-color:#e74c3c;color:#fff}' +
      '.__rv_actions .__rv_primary:hover{background:#c0392b}' +

      '.__rv_list{list-style:none;padding:0;margin:0}' +
      '.__rv_list li{border:1px solid #e0e0e8;border-radius:6px;padding:10px 12px;' +
        'margin-bottom:8px;background:#fafafc}' +
      '.__rv_list li.__rv_empty{text-align:center;color:#999;padding:30px;font-style:italic;background:none;border:none}' +
      '.__rv_li-head{display:flex;align-items:center;gap:6px;margin-bottom:6px}' +
      '.__rv_li-time{margin-left:auto;font-size:11px;color:#888}' +
      '.__rv_li-desc{font-size:13px;color:#222;white-space:pre-wrap;margin-bottom:4px}' +
      '.__rv_li-fix{font-size:12px;color:#27ae60;margin-bottom:4px}' +
      '.__rv_li-meta{font-size:11px;color:#666}' +
      '.__rv_li-meta code{background:#eee;padding:1px 4px;border-radius:2px}' +
      '.__rv_pill{font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;' +
        'padding:2px 7px;border-radius:10px;background:#ddd;color:#444}' +
      '.__rv_sev-low{background:#dfe6e9;color:#2d3436}' +
      '.__rv_sev-medium{background:#ffeaa7;color:#6c5400}' +
      '.__rv_sev-high{background:#fab1a0;color:#8c2400}' +
      '.__rv_sev-critical{background:#e74c3c;color:#fff}' +
      '.__rv_del{margin-left:6px;background:none;border:none;color:#999;font-size:18px;cursor:pointer;line-height:1}' +
      '.__rv_del:hover{color:#e74c3c}' +

      '.__rv_toast{position:fixed;left:50%;bottom:80px;transform:translate(-50%,40px);' +
        'background:#0a0a0f;color:#fff;border:2px solid #e74c3c;border-radius:8px;' +
        'padding:10px 18px;font:600 13px/1 system-ui,sans-serif;z-index:2147483647;' +
        'opacity:0;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .3s;' +
        'box-shadow:0 6px 24px rgba(0,0,0,.5);pointer-events:none;max-width:80vw}' +
      '.__rv_toast.__rv_show{opacity:1;transform:translate(-50%,0)}';

    var style = document.createElement('style');
    style.id = '__rv_style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Go ──────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
