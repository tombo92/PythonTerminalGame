"""
Tests for DeepIntoTheForest level logic.

Only pure calculation methods are tested — nothing that calls input() or
triggers terminal output that can't be suppressed easily.
"""
import pytest
from unittest.mock import patch
from GeneralGame.player import Player
from DeepIntoTheForestLevels import (
    ForestLevel2,
    ForestLevel5,
    ForestLevel7,
    ForestLevel8,
)


@pytest.fixture
def player():
    return Player("Tester")


# ── ForestLevel2 ─────────────────────────────────────────────────────────────

class TestForestLevel2:
    """Staircase-building riddle: number of trunks to reach a random height."""

    def test_correct_answer_is_positive_number(self, player):
        level = ForestLevel2(player, debug=True)
        with patch("time.sleep"), patch("builtins.print"):
            level._generate_riddle_data()
            level._calculate_correct_answer()
        assert isinstance(level.correct_answer, (int, float))
        assert level.correct_answer > 0

    def test_riddle_data_is_positive_height(self, player):
        level = ForestLevel2(player, debug=True)
        with patch("time.sleep"), patch("builtins.print"):
            level._generate_riddle_data()
        # riddle_data holds the target ledge height
        assert level.riddle_data > 0


# ── ForestLevel5 ─────────────────────────────────────────────────────────────

class TestForestLevel5Probability:
    """Probability-of-survival calculation."""

    @pytest.fixture
    def level(self, player):
        return ForestLevel5(player, debug=True)

    def test_zero_risk_path(self, level):
        assert level._calculate_probability_of_survival([0, 0, 0]) == pytest.approx(1.0)

    def test_max_risk_returns_zero(self, level):
        assert level._calculate_probability_of_survival([10]) == 0

    def test_single_risk_step(self, level):
        # risk=5 → survival = 1 - 5/10 = 0.5
        assert level._calculate_probability_of_survival([5]) == pytest.approx(0.5)

    def test_two_steps_multiply(self, level):
        # 0.5 * 0.5 = 0.25
        assert level._calculate_probability_of_survival([5, 5]) == pytest.approx(0.25)

    def test_empty_path_is_fully_safe(self, level):
        # No risks → probability stays at 1
        assert level._calculate_probability_of_survival([]) == pytest.approx(1.0)

    def test_path_with_zero_step_returns_zero(self, level):
        # A single risk=10 step anywhere kills you
        assert level._calculate_probability_of_survival([2, 10, 1]) == 0

    def test_generate_riddle_data_produces_list(self, level):
        with patch("time.sleep"), patch("builtins.print"):
            level._generate_riddle_data()
        assert isinstance(level.riddle_data, list)
        assert len(level.riddle_data) > 0

    def test_correct_answer_is_best_probability(self, level):
        with patch("time.sleep"), patch("builtins.print"):
            level._generate_riddle_data()
            level._calculate_correct_answer()
        best_prob, indices = level.correct_answer
        # Best probability must be the highest among all paths
        actual_probs = [level._calculate_probability_of_survival(p)
                        for p in level.riddle_data]
        assert best_prob == pytest.approx(max(actual_probs))
        # At least one valid index must exist
        assert len(indices) >= 1

    def test_correct_answer_indices_point_to_best_path(self, level):
        with patch("time.sleep"), patch("builtins.print"):
            level._generate_riddle_data()
            level._calculate_correct_answer()
        best_prob, indices = level.correct_answer
        for idx in indices:
            prob_at_idx = level._calculate_probability_of_survival(
                level.riddle_data[idx - 1]  # indices list is 1-based (stored in propabilities list offset by 1)
            )
            assert prob_at_idx == pytest.approx(best_prob)


# ── ForestLevel7 ─────────────────────────────────────────────────────────────

class TestForestLevel7:
    """Attack-pattern recognition riddle."""

    VALID_ANSWERS = {'r', 'k', 'l', 'f'}
    VALID_PATTERNS = [
        ('r', ['L', 'L', 'R', 'L', 'L', 'T', 'R', 'R', 'F', 'R', 'R', 'L', 'L', 'L']),
        ('k', ['T', 'T', 'F', 'F', 'L', 'L', 'R', 'R', 'L', 'L', 'F', 'F', 'T', 'T']),
        ('r', ['R', 'T', 'T', 'L', 'L', 'L', 'F', 'F', 'R', 'F', 'F', 'L', 'L']),
    ]

    @pytest.fixture
    def level(self, player):
        return ForestLevel7(player, debug=True)

    def test_attack_pattern_returns_tuple(self, level):
        result = level._create_attack_pattern()
        assert isinstance(result, tuple)
        assert len(result) == 2

    def test_correct_answer_is_valid_move(self, level):
        result = level._create_attack_pattern()
        answer, _ = result
        assert answer in self.VALID_ANSWERS

    def test_pattern_list_is_non_empty(self, level):
        _, pattern = level._create_attack_pattern()
        assert isinstance(pattern, list)
        assert len(pattern) > 0

    def test_generate_riddle_data_sets_riddle_data(self, level):
        with patch("time.sleep"), patch("builtins.print"):
            level._generate_riddle_data()
            level._calculate_correct_answer()
        assert level.riddle_data is not None
        assert level.correct_answer in self.VALID_ANSWERS

    def test_pattern_is_one_of_known_patterns(self, level):
        # The implementation picks randomly from a fixed list
        result = level._create_attack_pattern()
        assert result in self.VALID_PATTERNS


# ── ForestLevel8 ─────────────────────────────────────────────────────────────

class TestForestLevel8:
    """Cipher riddle — correct answer is always 420."""

    @pytest.fixture
    def level(self, player):
        return ForestLevel8(player, debug=True)

    def test_correct_answer_is_420(self, level):
        with patch("time.sleep"), patch("builtins.print"):
            level._generate_riddle_data()
            level._calculate_correct_answer()
        assert level.correct_answer == 420

    def test_riddle_data_is_encoded_string(self, level):
        with patch("time.sleep"), patch("builtins.print"):
            level._generate_riddle_data()
        assert isinstance(level.riddle_data, str)
        assert len(level.riddle_data) > 0

    def test_cipher_varies_by_player_name(self, player):
        """Different player names should produce different ciphers."""
        p2 = Player("Zzz")
        level1 = ForestLevel8(player, debug=True)
        level2 = ForestLevel8(p2, debug=True)
        with patch("time.sleep"), patch("builtins.print"):
            level1._generate_riddle_data()
            level2._generate_riddle_data()
        assert level1.riddle_data != level2.riddle_data
