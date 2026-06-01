/**
 * config.js – Game configuration & photo assets
 *
 * All tuneable constants live here. No logic, no rendering.
 * Photos are SVG placeholders until replaced with real images.
 */
var Config = (function () {
  'use strict';

  var TOTAL_CHOICES = 14; // max possible correct answers for scoring
  // Bump this whenever you add another scoring opportunity (a `correct: true` option)
  // to a chat or choice scene in story.js.

  var PIN_CODE = '0410'; // unlock code shown on the start screen (4. Oktober — reunion)

  /**
   * Audio asset map.
   * Drop matching .mp3/.ogg files in `audio/` and the engine will pick them up.
   * Missing files are ignored silently (the game stays playable without sound).
   *
   * See ASSETS.md → "Audio" for suggested mood/tempo per track.
   */
  var audio = {
    // Background music (looped)
    theme_intro:      'audio/theme_intro.mp3',       // title screen — soft & dreamy
    theme_swipe:      'audio/theme_swipe.mp3',       // Tinder swipe deck — pop / playful
    theme_chat:       'audio/theme_chat.mp3',        // first chat — warm acoustic
    theme_date:       'audio/theme_date.mp3',        // brunch / spree — uplifting
    theme_kiss:       'audio/theme_kiss.mp3',        // the kiss — romantic swell
    theme_montage:    'audio/theme_montage.mp3',     // 1000 messages — indie pop
    theme_silence:    'audio/theme_silence.mp3',     // the 14 days — somber piano
    theme_letters:    'audio/theme_letters.mp3',     // package arrives — bittersweet
    theme_reunion:    'audio/theme_reunion.mp3',     // 4. Oktober — emotional
    theme_true:       'audio/theme_true.mp3',        // happy ending — triumphant

    // Matrix branch
    theme_matrix:     'audio/theme_matrix.mp3',      // pulsing electronic

    // Horror progression — each darker than the last
    theme_horror_1:   'audio/theme_horror_1.mp3',    // unease — low drone
    theme_horror_2:   'audio/theme_horror_2.mp3',    // dread — strings + static
    theme_horror_3:   'audio/theme_horror_3.mp3',    // terror — heartbeat + dissonance
    theme_horror_end: 'audio/theme_horror_end.mp3',  // silence broken by whispers

    // One-shot sound effects
    sfx_match:        'audio/sfx_match.mp3',         // Tinder match ding
    sfx_swipe:        'audio/sfx_swipe.mp3',         // card slide
    sfx_message:      'audio/sfx_message.mp3',       // chat pop
    sfx_doorbell:     'audio/sfx_doorbell.mp3',      // package arrives
    sfx_glitch:       'audio/sfx_glitch.mp3',        // theme transitions
    sfx_heartbeat:    'audio/sfx_heartbeat.mp3',     // horror beats
    sfx_whisper:      'audio/sfx_whisper.mp3',       // horror whisper

    // Easter egg: "Human" by Rag'n'Bone Man — the song Vicky suggested to Tom
    // during their first dating phase. Triggered via the special chat option.
    easter_human:     'audio/easter_human.mp3'
  };

  /**
   * Photo asset map.
   * Replace each value with a path to a real image, e.g. 'photos/tom-profile.jpg'
   */
  var photos = {
    tom_profile: placeholder('Tom Tinder-Profil', '#e0eaf5', 'tom'),
    vicky_profile: placeholder('Vicky Tinder-Profil', '#f8e8f0', 'vicky'),
    couple: placeholder('Paarfoto', '#eee8f8', 'couple'),
    canal: placeholder('Kanal Friedrichstraße', '#d0e8f0', 'scene'),
    spree: placeholder('An der Spree', '#e0f0ff', 'scene'),
    fuji: placeholder('Mount Fuji', '#dbeaf8', 'scene'),
    wedding: placeholder('Hochzeit', '#fdf6e3', 'scene'),
    // Decoy Tinder profiles — replace with real (consensual!) placeholder photos
    kevin_profile:       placeholder('Kevin Tinder-Profil',       '#f0e8dc', 'decoy'),
    maximilian_profile:  placeholder('Maximilian Tinder-Profil',  '#dce6f0', 'decoy'),
    jens_profile:        placeholder('Jens Tinder-Profil',        '#e0dce6', 'decoy'),
    // The man in blue (Hermes / horror branch)
    lukas_profile:       placeholder('Lukas (Hermes)',            '#1a1a22', 'lukas'),
  };

  /** Generate a simple SVG placeholder */
  function placeholder(label, bg, type) {
    var w = 340, h = type === 'scene' ? 180 : 280;
    var inner = '';
    if (type === 'tom') {
      inner =
        '<circle cx="170" cy="110" r="42" fill="#e8c9a0"/>' +
        '<ellipse cx="170" cy="75" rx="38" ry="32" fill="#5c3a1a"/>' +
        '<circle cx="158" cy="108" r="3" fill="#2d1f14"/><circle cx="182" cy="108" r="3" fill="#2d1f14"/>' +
        '<path d="M162 128 Q170 136 178 128" stroke="#a06050" stroke-width="2" fill="none"/>' +
        '<path d="M142 162 L150 148 L190 148 L198 162 L198 250 L142 250Z" fill="#f5f5f5"/>' +
        '<rect x="166" y="148" width="8" height="55" fill="#c0392b"/>';
    } else if (type === 'vicky') {
      inner =
        '<circle cx="170" cy="110" r="42" fill="#f5d6a8"/>' +
        '<ellipse cx="170" cy="70" rx="46" ry="40" fill="#f0c75e"/>' +
        '<circle cx="158" cy="108" r="3" fill="#4a3728"/><circle cx="182" cy="108" r="3" fill="#4a3728"/>' +
        '<path d="M162 130 Q170 140 178 130" stroke="#d07070" stroke-width="2" fill="none"/>' +
        '<path d="M148 162 Q148 155 160 150 L180 150 Q192 155 192 162 L192 250 L148 250Z" fill="#e8547a"/>';
    } else if (type === 'couple') {
      inner =
        '<circle cx="135" cy="110" r="30" fill="#e8c9a0"/><circle cx="205" cy="110" r="30" fill="#f5d6a8"/>' +
        '<ellipse cx="135" cy="88" rx="26" ry="22" fill="#5c3a1a"/><ellipse cx="205" cy="85" rx="30" ry="26" fill="#f0c75e"/>' +
        '<rect x="110" y="148" width="50" height="90" rx="4" fill="#2c5282"/>' +
        '<rect x="180" y="148" width="50" height="90" rx="4" fill="#e8547a"/>';
    } else if (type === 'decoy') {
      inner =
        '<circle cx="170" cy="110" r="42" fill="#d8c6b0"/>' +
        '<ellipse cx="170" cy="78" rx="36" ry="28" fill="#7a6048"/>' +
        '<circle cx="158" cy="108" r="3" fill="#3a2818"/><circle cx="182" cy="108" r="3" fill="#3a2818"/>' +
        '<path d="M158 130 L182 130" stroke="#9a6868" stroke-width="2"/>' +
        '<path d="M142 162 L150 148 L190 148 L198 162 L198 250 L142 250Z" fill="#999"/>';
    } else if (type === 'lukas') {
      inner =
        '<rect width="' + w + '" height="' + h + '" fill="#0a0a14"/>' +
        '<circle cx="170" cy="110" r="42" fill="#3a3a44"/>' +
        '<ellipse cx="170" cy="78" rx="36" ry="28" fill="#1a1a22"/>' +
        '<rect x="142" y="148" width="56" height="105" fill="#1e3a8a"/>' +
        '<text x="170" y="200" text-anchor="middle" font-size="36" fill="#1a1a22">?</text>';
    } else {
      inner = '<rect x="60" y="40" width="220" height="' + (h - 70) + '" rx="6" fill="rgba(0,0,0,0.04)"/>';
    }
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<rect width="' + w + '" height="' + h + '" fill="' + bg + '"/>' + inner +
      '<text x="' + (w / 2) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="9" fill="rgba(0,0,0,0.3)" font-family="sans-serif">📷 ' + label + '</text></svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  return Object.freeze({
    TOTAL_CHOICES: TOTAL_CHOICES,
    PIN_CODE: PIN_CODE,
    photos: photos,
    audio: audio,
  });
})();
