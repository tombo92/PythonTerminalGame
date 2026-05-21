"""
Tests for GeneralGame/player.py — Player class.
"""
import pytest
from unittest.mock import patch
from GeneralGame.player import Player


@pytest.fixture
def player():
    return Player("Alice")


class TestPlayerInit:
    def test_name_stored(self, player):
        assert player.name == "Alice"

    def test_starts_with_three_lives(self, player):
        assert player.life_counter == 3

    def test_starts_alive(self, player):
        assert player.is_alive is True


class TestPlayerLifeCounter:
    def test_setter_changes_value(self, player):
        player.life_counter = 1
        assert player.life_counter == 1

    def test_setter_accepts_zero(self, player):
        player.life_counter = 0
        assert player.life_counter == 0


class TestPlayerDie:
    def test_is_alive_false_after_die(self, player):
        with patch("builtins.print"):
            player.die()
        assert player.is_alive is False

    def test_die_message_contains_name(self, capsys):
        p = Player("Bob")
        p.die()
        out = capsys.readouterr().out
        assert "Bob" in out

    def test_die_with_extra_message(self, capsys):
        p = Player("Carol")
        p.die(extra="from a great fall")
        out = capsys.readouterr().out
        assert "from a great fall" in out

    def test_die_twice_stays_dead(self, player):
        with patch("builtins.print"):
            player.die()
            player.die()
        assert player.is_alive is False


class TestPlayerReincarnate:
    def test_restores_three_lives(self, player):
        with patch("builtins.print"), patch("time.sleep"):
            player.die()
            player.reincarnate()
        assert player.life_counter == 3

    def test_makes_player_alive_again(self, player):
        with patch("builtins.print"), patch("time.sleep"):
            player.die()
            player.reincarnate()
        assert player.is_alive is True

    def test_reincarnate_message_contains_name(self, player, capsys):
        with patch("time.sleep"):
            player.die()
            player.reincarnate()
        out = capsys.readouterr().out
        assert "Alice" in out
