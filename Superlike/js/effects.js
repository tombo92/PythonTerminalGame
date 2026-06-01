/**
 * effects.js – Visual effects (toast, confetti, floating emojis)
 *
 * Pure side-effect functions. No game logic.
 */
var Effects = (function () {
  'use strict';

  var toastTimer = null;

  function toast(msg, duration) {
    duration = duration || 2800;
    clearTimeout(toastTimer);
    var el = document.getElementById('toast-el');
    el.textContent = msg;
    el.style.opacity = '1';
    toastTimer = setTimeout(function () { el.style.opacity = '0'; }, duration);
  }

  function confetti() {
    var cv = document.getElementById('confetti');
    cv.style.display = 'block';
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
    var ctx = cv.getContext('2d');
    var colors = ['#7444C0', '#FFA200', '#B644B2', '#5028D7', '#FD267B', '#FF6036', '#46A575', '#ffd700'];
    var shapes = ['♥', '⭐', '✨', '💜', '🌟', '◆', '💍'];
    var particles = [];
    for (var i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * cv.width,
        y: -20 - Math.random() * 280,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 3,
        shape: shapes[~~(Math.random() * shapes.length)],
        color: colors[~~(Math.random() * colors.length)],
        size: 10 + Math.random() * 12,
        rot: Math.random() * 360,
        rs: (Math.random() - 0.5) * 7
      });
    }
    var frame = 0;
    (function loop() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.rot += p.rs;
        if (p.y > cv.height + 20) { p.y = -20; p.x = Math.random() * cv.width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.font = p.size + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.shape, 0, 0);
        ctx.restore();
      });
      if (++frame < 280) requestAnimationFrame(loop);
      else cv.style.display = 'none';
    })();
  }

  function floatingEmojis(emoji, count) {
    count = count || 15;
    var layer = document.getElementById('effects-layer');
    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.className = 'float-emoji';
      el.textContent = emoji;
      el.style.left = (Math.random() * 90 + 5) + '%';
      el.style.top = (55 + Math.random() * 35) + '%';
      el.style.animationDelay = (Math.random() * 1.4) + 's';
      el.style.fontSize = (1.2 + Math.random() * 0.8) + 'rem';
      layer.appendChild(el);
    }
    setTimeout(function () { layer.innerHTML = ''; }, 3500);
  }

  // ─── Matrix rain ────────────────────────────────────────────
  var matrixRainHandle = null;
  var matrixResizeHandle = null;
  function matrixRainStart() {
    matrixRainStop();
    var canvas = document.getElementById('matrix-rain');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01ヴィッキー♥トム'.split('');
    var fontSize = 14;
    var drops;
    function sizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var cols = Math.floor(canvas.width / fontSize);
      drops = new Array(cols).fill(1);
    }
    sizeCanvas();
    matrixResizeHandle = function () { sizeCanvas(); };
    window.addEventListener('resize', matrixResizeHandle);
    matrixRainHandle = setInterval(function () {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = fontSize + 'px monospace';
      for (var i = 0; i < drops.length; i++) {
        var c = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(c, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 55);
  }
  function matrixRainStop() {
    if (matrixRainHandle) { clearInterval(matrixRainHandle); matrixRainHandle = null; }
    if (matrixResizeHandle) { window.removeEventListener('resize', matrixResizeHandle); matrixResizeHandle = null; }
    var canvas = document.getElementById('matrix-rain');
    if (canvas) { var c = canvas.getContext('2d'); c.clearRect(0, 0, canvas.width, canvas.height); }
  }

  return Object.freeze({
    toast: toast,
    confetti: confetti,
    floatingEmojis: floatingEmojis,
    matrixRainStart: matrixRainStart,
    matrixRainStop: matrixRainStop,
  });
})();
