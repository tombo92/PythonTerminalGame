/**
 * audio.js — Music & sound effect manager
 *
 * Uses two <audio> elements (A/B) to crossfade between tracks.
 * Tracks are referenced by name; the actual file paths live in
 * Config.audio. Missing files fail silently so the game never breaks
 * just because an mp3 is absent.
 *
 * Public API:
 *   Audio.play(name, {loop, volume, fade})  – fade-in to a track
 *   Audio.stop({fade})                       – fade-out current
 *   Audio.sfx(name)                          – one-shot sound effect
 *   Audio.toggleMute()                       – mute/unmute (persisted in localStorage)
 *   Audio.isMuted()                          – current mute state
 *   Audio.armOnFirstGesture()                – unlock autoplay after first tap
 */
var AudioMgr = (function () {
  'use strict';

  var a = new Audio();
  var b = new Audio();
  a.preload = 'auto'; b.preload = 'auto';
  var current = a, next = b;
  var fadeTimer = null;
  var armed = false;
  var queued = null;
  var lastName = null;
  var defaultVolume = 0.45;

  function tracks() { return (typeof Config !== 'undefined' && Config.audio) ? Config.audio : {}; }
  function url(name) { var t = tracks(); return t && t[name] ? t[name] : null; }

  function isMuted() {
    try { return localStorage.getItem('superlike_muted') === '1'; }
    catch (e) { return false; }
  }
  function setMutedFlag(v) {
    try { localStorage.setItem('superlike_muted', v ? '1' : '0'); } catch (e) {}
  }

  function applyMute() {
    var m = isMuted();
    a.muted = m; b.muted = m;
  }

  function toggleMute() {
    setMutedFlag(!isMuted());
    applyMute();
    return isMuted();
  }

  function armOnFirstGesture() {
    if (armed) return;
    armed = true;
    applyMute();
    if (queued) {
      var q = queued; queued = null;
      play(q.name, q.opts);
    }
  }

  function fade(el, from, to, ms, done) {
    if (fadeTimer) clearInterval(fadeTimer);
    var steps = 18;
    var step = 0;
    el.volume = from;
    fadeTimer = setInterval(function () {
      step++;
      var p = step / steps;
      el.volume = Math.max(0, Math.min(1, from + (to - from) * p));
      if (step >= steps) {
        clearInterval(fadeTimer); fadeTimer = null;
        if (done) done();
      }
    }, Math.max(20, ms / steps));
  }

  function play(name, opts) {
    opts = opts || {};
    if (name === lastName && !current.paused) return; // already playing
    if (!armed) { queued = { name: name, opts: opts }; return; }
    var src = url(name);
    if (!src) return; // no asset, silent
    var vol = opts.volume != null ? opts.volume : defaultVolume;
    var loop = opts.loop !== false;
    var fadeMs = opts.fade != null ? opts.fade : 900;

    next.src = src;
    next.loop = loop;
    next.muted = isMuted();
    var p = next.play();
    if (p && p.catch) p.catch(function () {});

    // Crossfade
    fade(next, 0, vol, fadeMs);
    var old = current;
    if (!old.paused && old.src) {
      fade(old, old.volume || vol, 0, fadeMs, function () { try { old.pause(); } catch (e) {} });
    }
    // Swap
    current = next; next = old;
    lastName = name;
  }

  function stop(opts) {
    opts = opts || {};
    var fadeMs = opts.fade != null ? opts.fade : 700;
    queued = null; lastName = null;
    if (current && !current.paused) {
      fade(current, current.volume, 0, fadeMs, function () { try { current.pause(); } catch (e) {} });
    }
    if (next && !next.paused) {
      fade(next, next.volume, 0, fadeMs, function () { try { next.pause(); } catch (e) {} });
    }
  }

  function sfx(name) {
    if (!armed) return;
    var src = url(name);
    if (!src) return;
    try {
      var s = new Audio(src);
      s.volume = isMuted() ? 0 : 0.6;
      var p = s.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  return Object.freeze({
    play: play,
    stop: stop,
    sfx: sfx,
    toggleMute: toggleMute,
    isMuted: isMuted,
    armOnFirstGesture: armOnFirstGesture,
    currentName: function () { return lastName; }
  });
})();
