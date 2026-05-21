"""
Tests for GeneralGame/helper_functions.py.

All functions tested here are pure (no I/O, no side-effects) so no mocking is
needed beyond suppressing the "invalid input" print() inside is_input_valid().
"""
import pytest
from GeneralGame.helper_functions import (
    caesar,
    encode_text,
    get_indices_of_element_in_list,
    is_input_valid,
    replace_character,
    reset_colors,
    rainbow_str,
    split_dialog,
)


class TestIsInputValid:
    def test_valid_lowercase(self, capsys):
        assert is_input_valid("left", ["left", "right"]) is True

    def test_valid_case_insensitive(self, capsys):
        assert is_input_valid("LEFT", ["left", "right"]) is True

    def test_valid_single_char(self, capsys):
        assert is_input_valid("r", ["r", "l", "f", "k"]) is True

    def test_invalid_returns_false(self, capsys):
        assert is_input_valid("north", ["left", "right"]) is False

    def test_empty_string_invalid(self, capsys):
        assert is_input_valid("", ["left", "right"]) is False

    def test_prints_hint_on_invalid(self, capsys):
        is_input_valid("bad", ["a", "b"])
        captured = capsys.readouterr()
        assert "valid" in captured.out.lower()


class TestGetIndicesOfElementInList:
    def test_single_occurrence(self):
        assert get_indices_of_element_in_list([1, 2, 3], 2) == [1]

    def test_multiple_occurrences(self):
        assert get_indices_of_element_in_list([5, 1, 5, 5], 5) == [0, 2, 3]

    def test_not_found_returns_empty(self):
        assert get_indices_of_element_in_list([1, 2, 3], 99) == []

    def test_works_with_floats(self):
        result = get_indices_of_element_in_list([0.5, 0.9, 0.5], 0.5)
        assert result == [0, 2]

    def test_empty_list(self):
        assert get_indices_of_element_in_list([], 1) == []


class TestCaesar:
    def test_shift_zero_unchanged(self):
        assert caesar("hello", 0) == "hello"

    def test_shift_one(self):
        assert caesar("abc", 1) == "bcd"

    def test_shift_wraps_z(self):
        assert caesar("xyz", 3) == "abc"

    def test_full_alphabet_roundtrip(self):
        text = "abcdefghijklmnopqrstuvwxyz"
        for shift in range(1, 26):
            encoded = caesar(text, shift)
            assert caesar(encoded, 26 - shift) == text

    def test_non_alpha_passed_through(self):
        # caesar only translates lowercase ascii; digits/spaces are untouched
        assert " " in caesar("a b", 1)


class TestEncodeText:
    def test_encode_changes_text(self):
        result = encode_text("hello", "key")
        assert result.strip() != "hello"

    def test_encode_is_deterministic(self):
        r1 = encode_text("abcdef", "test")
        r2 = encode_text("abcdef", "test")
        assert r1 == r2

    def test_different_keys_give_different_ciphers(self):
        r1 = encode_text("hello world", "aaaa")
        r2 = encode_text("hello world", "zzzz")
        assert r1 != r2

    def test_spaces_in_plaintext_removed_from_cipher(self):
        # encode_text does plaintext.replace(' ', '') before encoding
        r_with = encode_text("hello world", "key")
        r_without = encode_text("helloworld", "key")
        assert r_with.replace(" ", "") == r_without.replace(" ", "")


class TestSplitDialog:
    def test_splits_on_triple_hash(self):
        result = split_dialog("hello###world")
        assert result == ["hello", "world"]

    def test_no_separator_returns_single_element(self):
        result = split_dialog("no separator here")
        assert result == ["no separator here"]

    def test_multiple_separators(self):
        result = split_dialog("a###b###c")
        assert len(result) == 3
        assert result[0] == "a"
        assert result[2] == "c"

    def test_empty_string(self):
        assert split_dialog("") == [""]


class TestReplaceCharacter:
    def test_replace_in_middle(self):
        assert replace_character("X", "hello", 2) == "heXlo"

    def test_replace_first(self):
        assert replace_character("Z", "hello", 0) == "Zello"

    def test_replace_last(self):
        assert replace_character("!", "hello", 4) == "hell!"

    def test_same_char_no_change(self):
        assert replace_character("h", "hello", 0) == "hello"


class TestRainbowStr:
    def test_contains_all_original_letters(self):
        text = "abc"
        result = rainbow_str(text)
        # original letters must still appear somewhere in the colored string
        for ch in text:
            assert ch in result

    def test_result_differs_from_input(self):
        # rainbow_str adds ANSI codes so the raw string is different
        text = "hello"
        assert rainbow_str(text) != text

    def test_empty_string(self):
        assert rainbow_str("") == ""


class TestResetColors:
    def test_plain_text_unchanged(self):
        assert reset_colors("hello") == "hello"

    def test_removes_ansi_color_codes(self):
        colored = "\033[31mred\033[0m"
        result = reset_colors(colored)
        assert "\033[" not in result

    def test_rainbow_then_reset_roundtrip(self):
        original = "roundtrip"
        colored = rainbow_str(original)
        recovered = reset_colors(colored)
        assert recovered == original
