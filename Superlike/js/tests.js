/**
 * tests.js – Automated test suite for the Superlike game
 *
 * Run in browser console or via a test runner.
 * Tests verify story data integrity, state logic, and scene flow.
 *
 * Usage: open index.html, paste this in DevTools console, or
 *        load via <script src="js/tests.js"> after engine.js
 */
(function () {
  'use strict';

  var passed = 0;
  var failed = 0;
  var results = [];

  function assert(condition, msg) {
    if (condition) {
      passed++;
      results.push('✅ ' + msg);
    } else {
      failed++;
      results.push('❌ ' + msg);
      console.error('FAIL: ' + msg);
    }
  }

  function group(name) { results.push('\n── ' + name + ' ──'); }

  // ═══════════════════════════════════════════════════
  // STORY DATA INTEGRITY
  // ═══════════════════════════════════════════════════
  group('Story Data');

  assert(Story.scenes.length > 0, 'scenes array is not empty');
  assert(Story.scenes.length === 28, 'has exactly 28 scenes (incl. 3 decoy profiles)');

  // Every scene has a valid type
  var validTypes = ['title', 'profile', 'match', 'chat', 'narration', 'choice', 'camera', 'ending'];
  Story.scenes.forEach(function (s, i) {
    assert(validTypes.indexOf(s.type) !== -1, 'scene[' + i + '] has valid type: ' + s.type);
  });

  // Chat scenes reference existing chat data
  Story.scenes.filter(function (s) { return s.type === 'chat'; }).forEach(function (s) {
    assert(!!Story.chats[s.id], 'chat "' + s.id + '" exists in Story.chats');
    var chat = Story.chats[s.id];
    assert(Array.isArray(chat.messages), 'chat "' + s.id + '" has messages array');
    assert(Array.isArray(chat.choices), 'chat "' + s.id + '" has choices array');
    assert(chat.choices.length > 0, 'chat "' + s.id + '" has at least 1 choice');
  });

  // Narration scenes reference existing narration data
  Story.scenes.filter(function (s) { return s.type === 'narration'; }).forEach(function (s) {
    assert(!!Story.narrations[s.id], 'narration "' + s.id + '" exists in Story.narrations');
    var n = Story.narrations[s.id];
    assert(!!n.title, 'narration "' + s.id + '" has title');
    assert(!!n.body, 'narration "' + s.id + '" has body');
  });

  // Camera scenes reference existing camera data
  Story.scenes.filter(function (s) { return s.type === 'camera'; }).forEach(function (s) {
    assert(!!Story.cameras[s.id], 'camera "' + s.id + '" exists in Story.cameras');
    var cam = Story.cameras[s.id];
    assert(!!cam.title, 'camera "' + s.id + '" has title');
    assert(!!cam.theme, 'camera "' + s.id + '" has theme');
    assert(!!cam.fallbackNarration, 'camera "' + s.id + '" has fallbackNarration');
    assert(!!cam.fallbackNarration.body, 'camera "' + s.id + '" fallback has body');
  });

  // Choice scenes reference existing choice data
  Story.scenes.filter(function (s) { return s.type === 'choice'; }).forEach(function (s) {
    assert(!!Story.choices[s.id], 'choice "' + s.id + '" exists in Story.choices');
    var c = Story.choices[s.id];
    assert(!!c.title, 'choice "' + s.id + '" has title');
    assert(Array.isArray(c.options), 'choice "' + s.id + '" has options array');
    assert(c.options.length >= 2, 'choice "' + s.id + '" has at least 2 options');
    // At least one correct answer
    var hasCorrect = c.options.some(function (o) { return o.correct; });
    assert(hasCorrect, 'choice "' + s.id + '" has at least 1 correct option');
  });

  // All endings referenced exist
  var referencedEndings = [];
  Object.keys(Story.chats).forEach(function (k) {
    Story.chats[k].choices.forEach(function (c) {
      if (c.end) referencedEndings.push(c.end);
    });
  });
  Object.keys(Story.choices).forEach(function (k) {
    Story.choices[k].options.forEach(function (o) {
      if (o.end) referencedEndings.push(o.end);
    });
  });
  // Also scan branching endings (endings with options that reference sub-endings)
  Object.keys(Story.endings).forEach(function (k) {
    var e = Story.endings[k];
    if (e.options) {
      e.options.forEach(function (o) {
        if (o.end) referencedEndings.push(o.end);
      });
    }
  });
  referencedEndings.forEach(function (e) {
    assert(!!Story.endings[e], 'ending "' + e + '" exists in Story.endings');
  });

  // All endings have required fields (branching endings have options instead of icon)
  Object.keys(Story.endings).forEach(function (k) {
    var e = Story.endings[k];
    if (e.options) {
      assert(!!e.title, 'ending "' + k + '" has title');
      assert(e.options.length >= 2, 'branching ending "' + k + '" has at least 2 options');
    } else {
      assert(!!e.icon, 'ending "' + k + '" has icon');
      assert(!!e.title, 'ending "' + k + '" has title');
      assert(!!e.body, 'ending "' + k + '" has body');
    }
  });

  // ─── Branches & decoys ────────────────────────────────────
  assert(typeof Story.branches === 'object', 'Story.branches exists');
  assert(!!Story.branches.horror_descent, 'horror_descent branch exists');
  assert(Story.branches.horror_descent.scenes.length >= 6, 'horror_descent has >=6 scenes');
  Story.branches.horror_descent.scenes.forEach(function (s, i) {
    var t = Story.horrorScenes[s.id];
    assert(!!t, 'horror_descent step[' + i + '] id="' + s.id + '" has content');
  });
  assert(!!Story.endings.wrong_prince, 'wrong_prince ending exists');
  ['kevin', 'maximilian', 'jens'].forEach(function (n) {
    assert(!!Story.profiles[n], 'decoy profile "' + n + '" exists');
  });
  // Branch refs from choices/chats
  var branchRefs = [];
  Object.keys(Story.choices).forEach(function (k) {
    Story.choices[k].options.forEach(function (o) { if (o.branch) branchRefs.push(o.branch); });
  });
  branchRefs.forEach(function (b) {
    assert(!!Story.branches[b], 'branch "' + b + '" exists for choice option');
  });

  // AudioMgr surface (loaded async-friendly, no playback in tests)
  assert(typeof window.AudioMgr === 'object', 'AudioMgr global exists');
  ['play', 'stop', 'toggleMute', 'armOnFirstGesture'].forEach(function (m) {
    assert(typeof AudioMgr[m] === 'function', 'AudioMgr.' + m + ' is function');
  });
  assert(typeof Config.audio === 'object', 'Config.audio map exists');
  assert(typeof Config.audio.easter_human === 'string', 'easter_human track path defined');

  // ═══════════════════════════════════════════════════
  // STATE MODULE
  // ═══════════════════════════════════════════════════
  group('State Module');

  State.reset();
  assert(State.getScene() === 0, 'initial scene is 0');
  assert(State.scorePercent() === 0, 'initial score is 0%');
  assert(State.get().path.length === 0, 'initial path is empty');

  State.addScore(4);
  assert(State.get().score === 4, 'addScore works');

  State.recordChoice('test_choice');
  assert(State.get().path[0] === 'test_choice', 'recordChoice appends to path');

  State.setFlag('easter_egg');
  assert(State.hasFlag('easter_egg'), 'setFlag/hasFlag works');
  assert(!State.hasFlag('nonexistent'), 'hasFlag returns false for unset flags');

  State.setScene(5);
  assert(State.getScene() === 5, 'setScene/getScene works');

  assert(State.totalScenes() === 28, 'totalScenes returns 28');

  var nope1 = State.incrementNope();
  var nope2 = State.incrementNope();
  assert(nope1 === 1 && nope2 === 2, 'incrementNope counts correctly');

  State.reset();
  assert(State.getScene() === 0, 'reset clears scene');
  assert(State.get().score === 0, 'reset clears score');
  assert(State.get().path.length === 0, 'reset clears path');
  assert(!State.hasFlag('easter_egg'), 'reset clears flags');

  // ═══════════════════════════════════════════════════
  // SCORING
  // ═══════════════════════════════════════════════════
  group('Scoring');

  State.reset();
  // Max score = TOTAL_CHOICES * 2
  for (var i = 0; i < Config.TOTAL_CHOICES; i++) State.addScore(2);
  assert(State.scorePercent() === 100, 'perfect score = 100%');

  State.reset();
  State.addScore(Config.TOTAL_CHOICES); // half
  var halfPct = State.scorePercent();
  assert(halfPct === 50 || halfPct === Math.round(Config.TOTAL_CHOICES / (Config.TOTAL_CHOICES * 2) * 100),
    'half score gives ~50%');

  // ═══════════════════════════════════════════════════
  // CONFIG
  // ═══════════════════════════════════════════════════
  group('Config');

  assert(typeof Config.TOTAL_CHOICES === 'number', 'TOTAL_CHOICES is a number');
  assert(Config.TOTAL_CHOICES > 0, 'TOTAL_CHOICES > 0');
  assert(typeof Config.photos === 'object', 'photos is an object');
  assert(!!Config.photos.tom_profile, 'tom_profile photo exists');
  assert(!!Config.photos.vicky_profile, 'vicky_profile photo exists');

  // ═══════════════════════════════════════════════════
  // CORRECT PATH WALKTHROUGH
  // ═══════════════════════════════════════════════════
  group('Correct Path Validation');

  // Simulate the "correct" choices and verify they all exist
  var correctPath = [
    { chat: 'first_chat', choice: 'bio_true' },
    { chat: 'date_plan', choice: 'brunch_yes' },
    { pick: 'who_pays', option: 'insist' },
    { pick: 'after_brunch', option: 'burrito' },
    { pick: 'at_spree', option: 'arm' },
    { pick: 'goodbye', option: 'lean_in' },
    { pick: 'pill_choice', option: 'blue' },
    { chat: 'late_night_chat', choice: 'yes_tradition' },
    { pick: 'first_meeting_parents', option: 'charm' },
    { pick: 'crisis', option: 'breakup' },
    { pick: 'letters', option: 'letter2' },
    { pick: 'reunion', option: 'try' },
  ];

  correctPath.forEach(function (step) {
    if (step.chat) {
      var chatChoice = Story.chats[step.chat].choices.find(function (c) { return c.id === step.choice; });
      assert(!!chatChoice, 'correct chat choice "' + step.choice + '" exists');
      assert(chatChoice.correct, 'chat choice "' + step.choice + '" is marked correct');
      assert(!chatChoice.end, 'correct chat choice "' + step.choice + '" does not end game');
    } else {
      var pickOpt = Story.choices[step.pick].options.find(function (o) { return o.id === step.option; });
      assert(!!pickOpt, 'correct option "' + step.option + '" exists in "' + step.pick + '"');
      assert(pickOpt.correct, 'option "' + step.option + '" is marked correct');
      assert(!pickOpt.end, 'correct option "' + step.option + '" does not end game');
    }
  });

  // ═══════════════════════════════════════════════════
  // EASTER EGGS
  // ═══════════════════════════════════════════════════
  group('Easter Eggs');

  var schmutzOpt = Story.choices.reunion.options.find(function (o) { return o.id === 'schmutz'; });
  assert(!!schmutzOpt, '"Schmutz" easter egg option exists');
  assert(schmutzOpt.easter === 'schmutz', '"Schmutz" sets easter flag');
  assert(schmutzOpt.correct, '"Schmutz" counts as correct');

  var pushOpt = Story.choices.at_spree.options.find(function (o) { return o.id === 'push'; });
  assert(!!pushOpt, '"Spree push" easter egg option exists');
  assert(pushOpt.easter === 'river_push', '"Push" sets river_push flag');

  var guteOpt = Story.choices.goodbye.options.find(function (o) { return o.id === 'wave'; });
  assert(!!guteOpt, '"Gute Besserung" easter egg option exists');
  assert(guteOpt.easter === 'gute_besserung', '"Gute Besserung" sets easter flag');

  // Running joke in date_plan chat
  var runMsg = Story.chats.date_plan.messages.find(function (m) { return m.text && m.text.indexOf('laufen') !== -1; });
  assert(!!runMsg, '"Laufen" running joke message exists in date_plan');
  var spoilerMsg = Story.chats.date_plan.messages.find(function (m) { return m.type === 'system' && m.text.indexOf('20 Jahre') !== -1; });
  assert(!!spoilerMsg, 'Running spoiler narrator comment exists');

  // ═══════════════════════════════════════════════════
  // RESULTS SUMMARY
  // ═══════════════════════════════════════════════════
  State.reset(); // clean up after tests

  console.log('\n' + results.join('\n'));
  console.log('\n════════════════════════════════════');
  console.log('Results: ' + passed + ' passed, ' + failed + ' failed');
  console.log('════════════════════════════════════');

  if (failed > 0) console.warn('⚠️ ' + failed + ' test(s) FAILED');
  else console.log('🎉 All tests passed!');

  // Expose for external runners
  window.__testResults = { passed: passed, failed: failed, details: results };
})();
