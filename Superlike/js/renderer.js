/**
 * renderer.js – DOM rendering for each scene type
 *
 * Each render function receives (container, data, callbacks).
 * No game logic lives here – just building HTML and wiring event listeners.
 */
var Renderer = (function () {
  'use strict';

  // ─── Helpers ────────────────────────────────────────────────
  function h(tag, cls, html) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html !== undefined) el.innerHTML = html;
    return el;
  }

  function btn(cls, emoji, text, onclick) {
    var el = h('button', 'choice-btn ' + (cls || ''));
    el.innerHTML = '<span class="emoji">' + emoji + '</span> ' + text;
    el.addEventListener('click', onclick);
    return el;
  }

  // ─── Title ──────────────────────────────────────────────────
  function renderTitle(container, callbacks, variant) {
    var v = variant || {
      emoji: '⭐',
      title: 'Superlike',
      body: 'Eine interaktive Liebesgeschichte.<br>Triff die richtigen Entscheidungen —<br>' +
            'und finde heraus, ob du <strong>unser</strong> Happy End erreichst.',
      hint: '🎯 Ziel: Folge dem Schicksal',
      btnEmoji: '💘',
      btnText: 'Spiel starten'
    };
    container.innerHTML =
      '<div class="scene-center">' +
        '<div style="font-size:4rem;animation:pulse 2s ease infinite">' + v.emoji + '</div>' +
        '<div style="font-size:1.7rem;font-weight:800;color:var(--primary)">' + v.title + '</div>' +
        '<div style="font-size:0.84rem;color:var(--gray);max-width:260px;line-height:1.6">' + v.body + '</div>' +
        '<div style="font-size:0.72rem;color:var(--gray);margin-top:6px">' + v.hint + '</div>' +
      '</div>' +
      '<div class="choices"></div>';
    container.querySelector('.choices').appendChild(
      btn('', v.btnEmoji, v.btnText, callbacks.onStart)
    );
  }

  // ─── Profile card ───────────────────────────────────────────
  function renderProfile(container, profile, callbacks) {
    var card = h('div', 'scene-center');
    card.innerHTML =
      '<div class="tinder-card">' +
        '<div class="card-photo" style="background-image:url(\'' + profile.photo + '\')">' +
          '<div class="card-info">' +
            '<span class="card-name">' + profile.name + '</span>' +
            '<span class="card-age">' + profile.age + '</span>' +
            '<div class="card-loc">' + profile.location + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="card-bio">' + profile.bio.join('<br>') + '</div>' +
      '</div>';
    container.appendChild(card);

    var row = h('div', 'swipe-row');
    row.innerHTML =
      '<button class="swipe-btn nope" data-dir="nope"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '<button class="swipe-btn mini super" data-dir="super"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>' +
      '<button class="swipe-btn like" data-dir="like"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>';
    row.querySelectorAll('.swipe-btn').forEach(function (b) {
      b.addEventListener('click', function () { callbacks.onSwipe(b.dataset.dir); });
    });
    container.appendChild(row);
  }

  // ─── Match overlay ──────────────────────────────────────────
  function renderMatch(container, data, callbacks) {
    container.innerHTML =
      '<div class="match-overlay">' +
        '<div class="match-title">It\'s a Match!</div>' +
        '<div class="match-sub">' + data.subtitle + '</div>' +
        '<div class="match-photos">' +
          '<div class="match-photo" style="background-image:url(\'' + Config.photos.vicky_profile + '\')"></div>' +
          '<div class="match-heart">💜</div>' +
          '<div class="match-photo" style="background-image:url(\'' + Config.photos.tom_profile + '\')"></div>' +
        '</div>' +
        '<button class="match-btn">Nachricht senden</button>' +
      '</div>';
    container.querySelector('.match-btn').addEventListener('click', callbacks.onContinue);
  }

  // ─── Chat ──────────────────────────────────────────────────
  function renderChat(container, chatData, callbacks) {
    // Header
    var header = h('div', 'chat-header');
    header.innerHTML =
      '<div class="chat-avatar" style="background-image:url(\'' + chatData.partnerPhoto + '\')"></div>' +
      '<div><div class="chat-name">' + chatData.partnerName + '</div><div class="chat-status">Online</div></div>';
    container.appendChild(header);

    // Date badge
    if (chatData.date) {
      container.appendChild(h('div', 'date-badge', chatData.date));
    }

    // Message area
    var area = h('div', 'chat-area');
    area.id = 'chat-area';
    container.appendChild(area);

    // Choices (hidden initially)
    var choicesEl = h('div', 'choices');
    choicesEl.id = 'chat-choices';
    choicesEl.style.display = 'none';
    container.appendChild(choicesEl);

    // Animate messages
    animateMessages(area, chatData.messages, function () {
      showChoices(choicesEl, chatData.choices, callbacks.onChatChoice);
    });
  }

  function animateMessages(area, messages, onDone) {
    var i = 0;
    function next() {
      if (i >= messages.length) { setTimeout(onDone, 700); return; }
      var msg = messages[i];

      // Initial delay before the first message, and an explicit `delayBefore` on a
      // message lets the story slow down before a key beat.
      var preWait = i === 0 ? 750 : (msg.delayBefore || 0);

      // Per-message typing time (only `recv` shows the bouncing dots).
      // Slower than before so the chat doesn't blur past.
      // - sent:    short pause as if Vicky is reading what she just tapped
      // - recv:    realistic "Tom is typing" — ~38ms per char, clamped to [1200, 4200]
      // - system:  beat
      // - time:    quick
      var bodyLen = (msg.text || '').length;
      var typingMs;
      if (msg.type === 'recv') {
        typingMs = Math.max(1200, Math.min(4200, 700 + bodyLen * 38));
      } else if (msg.type === 'sent') {
        typingMs = 600 + Math.min(1400, bodyLen * 14);
      } else if (msg.type === 'system') {
        typingMs = 900;
      } else {
        typingMs = 400;
      }

      if (msg.type === 'recv' && i > 0) {
        setTimeout(function () {
          var typing = h('div', 'typing-indicator',
            '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>');
          area.appendChild(typing);
          area.scrollTop = area.scrollHeight;
          setTimeout(function () {
            typing.remove();
            addBubble(area, msg);
            if (typeof AudioMgr !== 'undefined') AudioMgr.sfx('sfx_message');
            i++; next();
          }, typingMs);
        }, preWait);
      } else {
        setTimeout(function () {
          addBubble(area, msg);
          if (typeof AudioMgr !== 'undefined' && msg.type === 'sent') AudioMgr.sfx('sfx_message');
          i++; next();
        }, preWait + (msg.type === 'sent' ? typingMs : 350));
      }
    }
    next();
  }

  function addBubble(area, msg) {
    var el;
    if (msg.type === 'time') {
      el = h('div', 'chat-time', msg.text);
    } else if (msg.type === 'system') {
      el = h('div', 'chat-bubble system', msg.text);
    } else {
      el = h('div', 'chat-bubble ' + msg.type, msg.text);
    }
    area.appendChild(el);
    area.scrollTop = area.scrollHeight;
  }

  function showChoices(choicesEl, choices, callback) {
    choicesEl.style.display = '';
    choices.forEach(function (c, idx) {
      choicesEl.appendChild(btn('', c.emoji, c.text, function () { callback(idx); }));
    });
  }

  // ─── Narration ─────────────────────────────────────────────
  function renderNarration(container, data, callbacks) {
    container.innerHTML =
      '<div class="scene-scroll"><div class="scene-center">' +
        '<div class="narration">' +
          '<div class="title">' + data.title + '</div>' +
          '<div class="sub">' + data.sub + '</div>' +
          '<div class="body">' + data.body + '</div>' +
        '</div>' +
      '</div></div>' +
      '<div class="choices"></div>';
    container.querySelector('.choices').appendChild(
      btn('', data.btnEmoji || '▶️', data.btnText || 'Weiter', callbacks.onContinue)
    );
  }

  // ─── Choice ─────────────────────────────────────────────────
  function renderChoice(container, data, callbacks) {
    var top = h('div', 'scene-scroll');
    top.innerHTML =
      '<div class="scene-center"><div class="narration">' +
        '<div class="title">' + data.title + '</div>' +
        (data.sub ? '<div class="sub">' + data.sub + '</div>' : '') +
        (data.body ? '<div class="body">' + data.body + '</div>' : '') +
      '</div></div>';
    container.appendChild(top);

    var choicesEl = h('div', 'choices');
    choicesEl.id = 'choice-btns';
    data.options.forEach(function (opt, idx) {
      choicesEl.appendChild(btn('', opt.emoji, opt.text, function () { callbacks.onChoose(idx); }));
    });
    container.appendChild(choicesEl);
  }

  // ─── Ending ─────────────────────────────────────────────────
  function renderEnding(container, endingData, scoreHtml, callbacks) {
    container.innerHTML =
      '<div class="scene-center"><div class="ending">' +
        '<div class="end-icon">' + endingData.icon + '</div>' +
        '<div class="end-title">' + endingData.title + '</div>' +
        scoreHtml +
        '<div class="end-body">' + endingData.body + '</div>' +
        (endingData.sub ? '<div class="end-sub">' + endingData.sub + '</div>' : '') +
        '<button class="replay-btn">↩ Nochmal spielen</button>' +
      '</div></div>';
    container.querySelector('.replay-btn').addEventListener('click', callbacks.onReplay);
  }

  // ─── Choice feedback helpers ────────────────────────────────
  function flashChoice(idx, correct) {
    var btns = document.querySelectorAll('#choice-btns .choice-btn');
    btns[idx].classList.add(correct ? 'flash-correct' : 'flash-wrong');
    btns.forEach(function (b, j) { if (j !== idx) b.classList.add('faded'); });
  }

  function flashChatChoice(idx, correct) {
    var btns = document.querySelectorAll('#chat-choices .choice-btn');
    if (btns[idx]) btns[idx].classList.add(correct ? 'flash-correct' : 'flash-wrong');
    btns.forEach(function (b, j) { if (j !== idx) b.classList.add('faded'); });
  }

  function appendChatBubble(type, text) {
    var area = document.getElementById('chat-area');
    if (!area) return;
    addBubble(area, { type: type, text: text });
  }

  function hideChatChoices() {
    var el = document.getElementById('chat-choices');
    if (el) el.style.display = 'none';
  }

  // ─── Camera prompt (ask permission) ─────────────────────────
  function renderCameraPrompt(container, data, callbacks) {
    container.innerHTML =
      '<div class="scene-center">' +
        '<div style="font-size:2.8rem">📷</div>' +
        '<div class="narration"><div class="title">' + data.title + '</div>' +
        '<div class="sub">' + data.sub + '</div>' +
        '<div class="body">' + data.promptText + '</div></div>' +
      '</div><div class="choices"></div>';
    var choicesEl = container.querySelector('.choices');
    choicesEl.appendChild(btn('', '📸', 'Kamera erlauben', function () { callbacks.onAllow(); }));
    choicesEl.appendChild(btn('', '🚫', 'Lieber nicht', function () { callbacks.onDecline(); }));
  }

  // ─── Camera feed (live video + filter) ─────────────────────
  function renderCameraFeed(container, data, stream, callbacks) {
    container.innerHTML =
      '<div class="scene-center">' +
        '<div class="camera-wrap ' + data.theme + '">' +
          '<video id="cam-video" autoplay playsinline muted></video>' +
          '<div class="camera-overlay-text">' + data.overlayText + '</div>' +
        '</div>' +
      '</div><div class="choices"></div>';
    var video = document.getElementById('cam-video');
    video.srcObject = stream;
    container.querySelector('.choices').appendChild(
      btn('', '➡️', data.btnText, function () {
        // Stop camera tracks
        stream.getTracks().forEach(function (t) { t.stop(); });
        callbacks.onContinue();
      })
    );
  }

  // ─── PIN gate ──────────────────────────────────────────────
  function renderPinGate(container, callbacks) {
    container.innerHTML =
      '<div class="scene-center">' +
        '<div style="font-size:3.4rem">🔒</div>' +
        '<div style="font-size:1.4rem;font-weight:800;color:var(--primary)">Geheime Geschichte</div>' +
        '<div style="font-size:0.82rem;color:var(--gray);max-width:280px;line-height:1.6">' +
          'Diese Story ist nur für eine Person.<br>Gib den 4-stelligen Code ein.<br>' +
          '<em style="font-size:0.72rem">Hinweis: Wann haben wir wieder „Ja" gesagt?</em></div>' +
        '<input id="pin-input" type="password" inputmode="numeric" maxlength="4" autocomplete="off" ' +
          'style="font-size:1.6rem;text-align:center;letter-spacing:0.5em;padding:10px 14px;border:2px solid var(--primary);border-radius:10px;width:140px;outline:none" />' +
        '<button id="pin-submit" class="choice-btn" style="margin-top:6px">' +
          '<span class="emoji">🔓</span> Entsperren</button>' +
        '<div id="pin-err" style="font-size:0.78rem;color:#c0392b;min-height:18px"></div>' +
      '</div>';
    var input = document.getElementById('pin-input');
    var err = document.getElementById('pin-err');
    var submit = document.getElementById('pin-submit');
    input.focus();
    function tryUnlock() {
      if (input.value === Config.PIN_CODE) {
        callbacks.onUnlock();
      } else {
        err.textContent = 'Falscher Code 💔';
        input.value = '';
        input.classList.add('flash-wrong');
        setTimeout(function () { input.classList.remove('flash-wrong'); }, 600);
      }
    }
    submit.addEventListener('click', tryUnlock);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tryUnlock();
    });
  }

  return Object.freeze({
    renderTitle: renderTitle,
    renderPinGate: renderPinGate,
    renderCameraPrompt: renderCameraPrompt,
    renderCameraFeed: renderCameraFeed,
    renderProfile: renderProfile,
    renderMatch: renderMatch,
    renderChat: renderChat,
    renderNarration: renderNarration,
    renderChoice: renderChoice,
    renderEnding: renderEnding,
    flashChoice: flashChoice,
    flashChatChoice: flashChatChoice,
    appendChatBubble: appendChatBubble,
    hideChatChoices: hideChatChoices,
  });
})();
