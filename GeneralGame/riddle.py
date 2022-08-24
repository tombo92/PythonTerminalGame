#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-06-01 17:22:03
# @Author  : Tom Brandherm
# @Python  : 3.10
# @Link    : https://github.com/tombo92
# @Version : 1.1.0
"""
Abstract Riddle Class
"""

# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #
from abc import ABC, abstractmethod
import time
from GeneralGame.helper_functions import rainbow_str
from GeneralGame.icons import Icons
from GeneralGame.player import Player

# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Abstract Class definitions
# =========================================================================== #


class Riddle(ABC):
    """
    General Riddle class
    """

    def __init__(self, player: str, debug: bool = False):
        self.player: Player = player
        self.correct_answer = None
        self.riddle_data = None
        self.answer = None
        self.debug: bool = debug

    def start(self, first_try: bool = True) -> bool:
        """
        starts the terminal riddle output
        Returns
        -------
        bool
            has the user solved the riddel correct
        """
        self._print_icon_and_lives()

        time.sleep(1)
        if first_try:
            self._generate_riddle_data()
            self._calculate_correct_answer()
            self._print_prolog()
            time.sleep(1)
        self._give_necessary_information()
        if self.debug:
            print(rainbow_str(f"The correct answer is: {self.correct_answer}"))
        if self._ask_for_answer_and_compare():
            time.sleep(2)
            self._print_success_message()
            return True
        time.sleep(2)
        self._print_fail_message()
        return False

    def _return_life_icons(self) -> str:
        icon: str = ''
        if self.player.life_counter == 3:
            icon = Icons.full_hearts
        elif self.player.life_counter == 2:
            icon = Icons.two_hearts
        else:
            icon = Icons.one_heart
        if self.debug:
            return rainbow_str(icon)
        return icon

    @abstractmethod
    def _print_icon_and_lives(self):
        pass

    @abstractmethod
    def _print_prolog(self):
        pass

    @abstractmethod
    def _print_success_message(self):
        pass

    @abstractmethod
    def _print_fail_message(self):
        pass

    @abstractmethod
    def _give_necessary_information(self):
        pass

    @abstractmethod
    def _calculate_correct_answer(self):
        pass

    @abstractmethod
    def _ask_for_answer_and_compare(self) -> bool:
        pass

    @abstractmethod
    def _generate_riddle_data(self):
        pass

# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #

if __name__ == '__main__':
    pass
