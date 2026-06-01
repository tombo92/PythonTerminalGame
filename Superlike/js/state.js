/**
 * state.js – Game state management
 *
 * Single source of truth. No DOM access.
 * Exposes getters/setters and computed properties.
 */
var State = (function () {
  'use strict';

  var data = createFresh();

  function createFresh() {
    return {
      sceneIndex: 0,
      score: 0,
      path: [],       // IDs of choices made
      flags: {},      // easter eggs and booleans
      startTime: 0,
      nopeCount: 0,
    };
  }

  function reset() {
    data = createFresh();
  }

  function get() { return data; }

  function addScore(pts) { data.score += pts; }
  function recordChoice(id) { data.path.push(id); }
  function setFlag(key, val) { data.flags[key] = val !== undefined ? val : true; }
  function hasFlag(key) { return !!data.flags[key]; }

  function scorePercent() {
    return Math.min(100, Math.round((data.score / (Config.TOTAL_CHOICES * 2)) * 100));
  }

  function setScene(i) { data.sceneIndex = i; }
  function getScene() { return data.sceneIndex; }
  function totalScenes() { return Story.scenes.length; }

  function incrementNope() { data.nopeCount++; return data.nopeCount; }

  return Object.freeze({
    get: get,
    reset: reset,
    addScore: addScore,
    recordChoice: recordChoice,
    setFlag: setFlag,
    hasFlag: hasFlag,
    scorePercent: scorePercent,
    setScene: setScene,
    getScene: getScene,
    totalScenes: totalScenes,
    incrementNope: incrementNope,
  });
})();
