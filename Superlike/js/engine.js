/**
 * engine.js – Game loop & event orchestration
 *
 * Coordinates State, Story, Renderer, and Effects.
 * This is the only file that "wires" things together.
 */
(function () {
  'use strict';

  var sceneEl = document.getElementById('scene');
  var progressEl = document.getElementById('progress-bar');
  var gameEl = document.getElementById('game');

  // ─── Theme switching ────────────────────────────────────────
  function setTheme(theme) {
    gameEl.classList.remove('horror-mode', 'matrix-mode',
      'horror-level-1', 'horror-level-2', 'horror-level-3');
    Effects.matrixRainStop();
    if (theme === 'horror') {
      gameEl.classList.add('glitch-active');
      setTimeout(function () {
        gameEl.classList.remove('glitch-active');
        gameEl.classList.add('horror-mode');
      }, 1200);
    } else if (theme === 'matrix') {
      gameEl.classList.add('glitch-active');
      setTimeout(function () {
        gameEl.classList.remove('glitch-active');
        gameEl.classList.add('matrix-mode');
        Effects.matrixRainStart();
      }, 1200);
    }
  }

  function setHorrorLevel(n) {
    if (!n) return;
    gameEl.classList.add('horror-mode');
    if (n >= 1) gameEl.classList.add('horror-level-1');
    if (n >= 2) gameEl.classList.add('horror-level-2');
    if (n >= 3) gameEl.classList.add('horror-level-3');
  }

  function resetTheme() {
    gameEl.classList.remove('horror-mode', 'matrix-mode', 'glitch-active',
      'horror-level-1', 'horror-level-2', 'horror-level-3');
    Effects.matrixRainStop();
  }

  // ─── Scene navigation ───────────────────────────────────────
  function updateProgress() {
    var pct = Math.min(100, (State.getScene() / (State.totalScenes() - 1)) * 100);
    progressEl.style.width = pct + '%';
  }

  function transition(fn) {
    sceneEl.classList.add('trans-exit');
    setTimeout(function () {
      sceneEl.classList.remove('trans-exit');
      sceneEl.innerHTML = '';
      fn();
      sceneEl.classList.add('trans-enter');
      setTimeout(function () { sceneEl.classList.remove('trans-enter'); }, 300);
    }, 250);
  }

  function goTo(index) {
    State.setScene(index);
    updateProgress();
    transition(function () { renderCurrent(); });
  }

  function advance() { goTo(State.getScene() + 1); }

  // ─── Branch (mini-sequence) state ───────────────────────────
  // When a choice carries `branch: '<id>'` we leave the linear
  // `scenes` array and play `Story.branches[id].scenes` in order.
  var _branch = null;     // active branch id, or null
  var _branchIdx = 0;     // current step inside the branch
  function enterBranch(id) {
    _branch = id;
    _branchIdx = 0;
    renderBranch();
  }
  function advanceBranch() {
    _branchIdx++;
    var b = Story.branches[_branch];
    if (!b || _branchIdx >= b.scenes.length) {
      var endId = b ? b.endsAt : 'true';
      _branch = null;
      showEnding(endId);
      return;
    }
    transition(renderBranch);
  }
  function renderBranch() {
    var b = Story.branches[_branch];
    if (!b) return;
    var step = b.scenes[_branchIdx];
    if (step.meta && step.meta.horrorLevel) setHorrorLevel(step.meta.horrorLevel);
    if (step.music && window.AudioMgr) AudioMgr.play(step.music, { loop: true });
    var data;
    if (step.type === 'narration') {
      data = Story.horrorScenes[step.id] || Story.narrations[step.id];
      Renderer.renderNarration(sceneEl, data, { onContinue: advanceBranch });
    } else if (step.type === 'choice') {
      data = Story.horrorScenes[step.id] || Story.choices[step.id];
      Renderer.renderChoice(sceneEl, data, {
        onChoose: function (idx) {
          var opt = data.options[idx];
          Renderer.flashChoice(idx, false);
          setTimeout(function () {
            if (opt.end) { _branch = null; showEnding(opt.end); return; }
            advanceBranch();
          }, 550);
        }
      });
    }
  }

  // ─── Render dispatcher ──────────────────────────────────────
  function renderCurrent() {
    var idx = State.getScene();
    var scene = Story.scenes[idx];
    if (!scene) { showEnding('true'); return; }

    // Per-scene music cue (looped). Skipped silently if AudioMgr
    // missing or asset 404s.
    if (scene.music && window.AudioMgr) AudioMgr.play(scene.music, { loop: true });

    // Time-based branching: scenes flagged `triggerHorrorIfNight`
    // auto-divert to the horror descent when played between 22:00–05:00
    // (UNLESS the player already explicitly chose a horror path).
    if (scene.meta && scene.meta.triggerHorrorIfNight && isNightTime() && !State.hasFlag('night_horror_seen')) {
      State.setFlag('night_horror_seen');
      Effects.toast('🌙 3:17 Uhr. Etwas stimmt nicht...');
      setTimeout(function () { enterBranch('horror_descent'); }, 900);
      return;
    }

    switch (scene.type) {
      case 'title':     renderStart(); break;
      case 'profile':   renderProfile(scene); break;
      case 'match':     renderMatch(); break;
      case 'chat':      renderChat(scene.id); break;
      case 'narration': renderNarration(scene.id); break;
      case 'choice':    renderChoice(scene.id); break;
      case 'camera':    renderCamera(scene.id); break;
      case 'ending':    showEnding(scene.id); break;
    }
  }

  function isNightTime() {
    var h = new Date().getHours();
    return h >= 22 || h < 5;
  }

  // ─── Persistent replay state (localStorage) ────────────────
  // `superlike_plays`     – integer, # of times the player launched the game
  // `superlike_unlocked`  – '1' once PIN has been entered (skip gate forever)
  // `superlike_endings`   – JSON array of ending ids seen
  function lsGet(k, fallback) {
    try { var v = localStorage.getItem(k); return v === null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function getPlayCount() { return parseInt(lsGet('superlike_plays', '0'), 10) || 0; }
  function bumpPlayCount() { lsSet('superlike_plays', String(getPlayCount() + 1)); }
  function isUnlocked() { return lsGet('superlike_unlocked', '0') === '1'; }
  function markUnlocked() { lsSet('superlike_unlocked', '1'); }

  // ─── Title / Start (with PIN gate) ──────────────────────────
  function renderStart() {
    var variants = Story.titleVariants || [null];
    var variant = variants[getPlayCount() % variants.length];
    function showTitle() {
      Renderer.renderTitle(sceneEl, { onStart: function () {
        bumpPlayCount();
        start();
      }}, variant);
    }
    // Review mode: skip the PIN gate so reviewers don't need credentials.
    if (window.__reviewBypassGate || isUnlocked() || State.hasFlag('unlocked')) {
      State.setFlag('unlocked');
      showTitle();
    } else {
      Renderer.renderPinGate(sceneEl, { onUnlock: function () {
        State.setFlag('unlocked');
        markUnlocked();
        showTitle();
      }});
    }
  }

  function start() {
    State.get().startTime = Date.now();
    advance();
  }

  // ─── Profile ───────────────────────────────────────────────
  function renderProfile(scene) {
    var profile = Story.profiles[scene.id];
    var isDecoy = !!(scene.meta && scene.meta.decoy);
    Renderer.renderProfile(sceneEl, profile, {
      onSwipe: function (dir) { handleSwipe(dir, isDecoy); }
    });
  }

  function handleSwipe(dir, isDecoy) {
    // Decoy profiles (Kevin, Maximilian, Jens):
    //   nope  → next profile (no nope-counter increment)
    //   like/super → wrong-prince ending
    if (isDecoy) {
      if (dir === 'nope') { advance(); return; }
      State.recordChoice('matched_' + (Story.scenes[State.getScene()].id || 'decoy'));
      showEnding('wrong_prince');
      return;
    }
    if (dir === 'nope') {
      var count = State.incrementNope();
      if (count === 1) Effects.toast('Das Schicksal lässt sich nicht nopen 😏');
      else if (count === 2) Effects.toast('Netter Versuch... aber nein 💫');
      else { showEnding('nope'); }
      return;
    }
    if (dir === 'super') { State.addScore(2); State.setFlag('superliked'); }
    else { State.addScore(1); }
    State.recordChoice(dir);
    advance();
  }

  // ─── Match ─────────────────────────────────────────────────
  function renderMatch() {
    var subtitle = State.hasFlag('superliked')
      ? 'Du hast Tom ein Superlike gegeben ⭐'
      : 'Du und Tom mögt euch';
    Renderer.renderMatch(sceneEl, { subtitle: subtitle }, { onContinue: advance });
  }

  // ─── Chat ──────────────────────────────────────────────────
  function renderChat(id) {
    var chatData = Story.chats[id];
    Renderer.renderChat(sceneEl, chatData, { onChatChoice: handleChatChoice.bind(null, id) });
  }

  function handleChatChoice(chatId, idx) {
    var chatData = Story.chats[chatId];
    var choice = chatData.choices[idx];
    State.recordChoice(choice.id);
    if (choice.correct) State.addScore(2);
    if (choice.easter) State.setFlag(choice.easter);
    if (choice.music && window.AudioMgr) AudioMgr.play(choice.music, { loop: false, volume: 0.6 });
    if (choice.toast) Effects.toast(choice.toast);

    Renderer.flashChatChoice(idx, choice.correct);

    if (choice.end) {
      setTimeout(function () { showEnding(choice.end); }, 500);
      return;
    }
    if (choice.branch) {
      setTimeout(function () { enterBranch(choice.branch); }, 500);
      return;
    }

    // Show sent message
    Renderer.hideChatChoices();
    Renderer.appendChatBubble('sent', choice.text);

    if (choice.reply) {
      setTimeout(function () {
        Renderer.appendChatBubble('recv', choice.reply);
        setTimeout(advance, 1100);
      }, 750);
    } else {
      setTimeout(advance, 700);
    }
  }

  // ─── Narration ─────────────────────────────────────────────
  function renderNarration(id) {
    var data = Story.narrations[id];
    Renderer.renderNarration(sceneEl, data, { onContinue: advance });
  }

  // ─── Camera ────────────────────────────────────────────────
  function renderCamera(id) {
    var data = Story.cameras[id];
    transition(function () {
      Renderer.renderCameraPrompt(sceneEl, data, {
        onAllow: function () { startCamera(data); },
        onDecline: function () {
          // Fallback to narration if user declines camera
          transition(function () {
            Renderer.renderNarration(sceneEl, data.fallbackNarration, { onContinue: advance });
          });
        }
      });
    });
  }

  function startCamera(data) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // No camera API available, use fallback
      transition(function () {
        Renderer.renderNarration(sceneEl, data.fallbackNarration, { onContinue: advance });
      });
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then(function (stream) {
        transition(function () {
          Effects.floatingEmojis('✨💫💖', 12);
          Renderer.renderCameraFeed(sceneEl, data, stream, { onContinue: advance });
        });
      })
      .catch(function () {
        // Permission denied or error — use fallback
        Effects.toast('Kein Zugriff auf die Kamera — kein Problem!');
        transition(function () {
          Renderer.renderNarration(sceneEl, data.fallbackNarration, { onContinue: advance });
        });
      });
  }

  // ─── Choice ────────────────────────────────────────────────
  function renderChoice(id) {
    var data = Story.choices[id];
    Renderer.renderChoice(sceneEl, data, { onChoose: handleChoose.bind(null, id) });
  }

  function handleChoose(choiceId, idx) {
    var data = Story.choices[choiceId];
    var opt = data.options[idx];
    State.recordChoice(opt.id);
    if (opt.correct) State.addScore(2);
    if (opt.easter) State.setFlag(opt.easter);

    Renderer.flashChoice(idx, !!opt.correct);

    setTimeout(function () {
      if (opt.toast) Effects.toast(opt.toast);
      if (opt.end) { showEnding(opt.end); return; }
      if (opt.branch) { enterBranch(opt.branch); return; }
      advance();
    }, 550);
  }

  // ─── Endings ───────────────────────────────────────────────
  function showEnding(type) {
    var endingData = Story.endings[type];
    if (!endingData) endingData = Story.endings['true'];
    var isTrue = (type === 'true');

    // Trigger horror mode for horror branch
    if (type.indexOf('horror') === 0 && !gameEl.classList.contains('horror-mode')) {
      setTheme('horror');
    }
    // Trigger matrix mode for matrix branch
    if (type.indexOf('matrix') === 0 && !gameEl.classList.contains('matrix-mode')) {
      setTheme('matrix');
    }

    // Branching ending: has options that lead to sub-endings
    if (endingData.options) {
      transition(function () {
        Renderer.renderChoice(sceneEl, endingData, {
          onChoose: function (idx) {
            var opt = endingData.options[idx];
            Renderer.flashChoice(idx, false);
            setTimeout(function () { showEnding(opt.end); }, 550);
          }
        });
      });
      return;
    }

    transition(function () {
      if (isTrue) Effects.confetti();
      if (State.hasFlag('schmutz')) Effects.floatingEmojis('🐭💜', 18);

      var scoreHtml = '';
      if (isTrue) {
        var pct = State.scorePercent();
        scoreHtml = '<div class="score-badge">🎯 ' + pct + '% Erinnerungs-Score</div>';
        if (pct === 100) scoreHtml += '<div style="font-size:0.75rem;color:var(--gold)">⭐ Perfekte Geschichte!</div>';
        if (State.hasFlag('schmutz')) scoreHtml += '<div style="font-size:0.72rem;color:var(--primary);margin-top:3px">🐭 Easter Egg: "Schmutz" entdeckt!</div>';
        if (State.hasFlag('river_push')) scoreHtml += '<div style="font-size:0.72rem;color:var(--primary)">🏊 Easter Egg: Spree-Schubser!</div>';
        if (State.hasFlag('gute_besserung')) scoreHtml += '<div style="font-size:0.72rem;color:var(--primary)">💊 Easter Egg: Gute Besserung!</div>';
        if (State.hasFlag('superliked')) scoreHtml += '<div style="font-size:0.72rem;color:var(--primary)">⭐ Historisch korrekt: Superlike!</div>';
      }

      Renderer.renderEnding(sceneEl, endingData, scoreHtml, { onReplay: replay });
    });
  }

  function replay() {
    if (window.AudioMgr) AudioMgr.stop({ fade: 600 });
    State.reset();
    resetTheme();
    _branch = null;
    goTo(0);
  }

  // ─── Header buttons (mute, exit) ───────────────────────────
  // Wired once on boot. Mute toggles AudioMgr + icon.
  // Exit shows a confirmation modal — on confirm, full reset.
  function wireHeader() {
    var btnMute = document.getElementById('btn-mute');
    var btnExit = document.getElementById('btn-exit');
    var overlay = document.getElementById('exit-overlay');
    if (btnMute) {
      btnMute.addEventListener('click', function () {
        if (!window.AudioMgr) return;
        var muted = AudioMgr.toggleMute();
        btnMute.textContent = muted ? '🔇' : '🔊';
        btnMute.classList.toggle('muted', muted);
        if (muted) lsSet('superlike_muted', '1'); else lsSet('superlike_muted', '0');
      });
      // Restore prior mute pref
      if (lsGet('superlike_muted', '0') === '1' && window.AudioMgr) {
        AudioMgr.toggleMute();
        btnMute.textContent = '🔇';
        btnMute.classList.add('muted');
      }
    }
    if (btnExit && overlay) {
      var btnCancel = document.getElementById('exit-cancel');
      var btnConfirm = document.getElementById('exit-confirm');
      btnExit.addEventListener('click', function () { overlay.classList.remove('hidden'); });
      if (btnCancel) btnCancel.addEventListener('click', function () { overlay.classList.add('hidden'); });
      if (btnConfirm) btnConfirm.addEventListener('click', function () {
        overlay.classList.add('hidden');
        replay();
      });
    }
    // Audio autoplay policy: arm on first user gesture anywhere.
    function arm() {
      if (window.AudioMgr) AudioMgr.armOnFirstGesture();
      document.removeEventListener('click', arm, true);
      document.removeEventListener('touchstart', arm, true);
      document.removeEventListener('keydown', arm, true);
    }
    document.addEventListener('click', arm, true);
    document.addEventListener('touchstart', arm, true);
    document.addEventListener('keydown', arm, true);
  }

  // ─── Boot ──────────────────────────────────────────────────
  wireHeader();
  renderCurrent();
  updateProgress();

  // Expose a tiny surface so the review module can re-render the gate
  // after activating mid-session.
  window.Engine = { renderCurrent: renderCurrent };
  window.addEventListener('reviewmode:activated', function () {
    try { renderCurrent(); } catch (e) {}
  });
})();
