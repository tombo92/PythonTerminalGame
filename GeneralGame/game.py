#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-08-12 13:47:51
# @Author  : Tom Brandherm
# @Python  : 3.10
# @Link    : link
# @Version : 0.0.1
"""
Short Introduction
"""

# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #
from abc import ABC, abstractmethod
import time
from typing import Callable
from GeneralGame.player import Player
from GeneralGame.helper_functions import is_input_valid, clear_terminal
# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #


class TerminalGame(ABC):
    """
        game class
    """

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Constructor
    # ----------------------------------------------------------------------- #
    def __init__(self, level: int = 0, debug: bool = False):
        self.player: Player = self._create_new_player()
        self.level: int = level
        self.debug: bool = debug
        self.new_adventure: Callable = None
    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Getter/Setter
    # ----------------------------------------------------------------------- #

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Public Methods
    # ----------------------------------------------------------------------- #
    @abstractmethod
    def start(self):
        pass

    @abstractmethod
    def stop(self):
        pass

    @abstractmethod
    def _explain_rules_and_ask_for_start(self) -> bool:
        pass

    def _create_new_player(self) -> Player:
        while 1:
            name = input("Who is playing this game?: ")
            if not name.isalpha() or len(name) < 3:
                print("Your name should at minimum constists of three LETTERS.")
                continue
            while 1:
                check = input(
                    f"Hello {name}, is that the name you want to be called? [Yes/No] ")
                if is_input_valid(check, ['yes', 'no', 'y', 'n']):
                    if check.lower() in ['yes', 'y']:
                        return Player(name)
                    clear_terminal()
                    break

    def _kill_player_and_ask_for_restart(self, extra: str = ''):
        self.player.die(extra)
        answer = input(
            f"{self.player.name} do you want to restart your quest? [Yes/No] ")
        if is_input_valid(answer, ['yes', 'no', 'y', 'n']):
            if answer.lower() in ['yes', 'y']:
                self.level = 1
                self.player.reincarnate()
                time.sleep(1)

# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #

if __name__ == '__main__':
    pass
