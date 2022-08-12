#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-06-01 17:22:03
# @Author  : Tom Brandherm
# @Python  : 3.9
# @Link    : link
# @Version : 1.0.1
"""
Abstract Riddle Class
"""

# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #
from abc import ABC, abstractmethod
import time

# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Abstract Class definitions
# =========================================================================== #


class Riddle(ABC):

    def __init__(self, player_name: str, debug: bool = False):
        self.name: str = player_name
        self.correct_answer = None
        self.riddle_data = None
        self.answer = None
        self.debug = debug

    def start(self) -> bool:
        self._generate_riddle_data()
        self._print_icon()
        time.sleep(1)
        self._print_prolog()
        time.sleep(1)
        self._give_necessary_information()
        self._calculate_correct_answer()
        if self.debug:
            print(f"The correct answer is: {self.correct_answer}")
        if self._ask_for_answer_and_compare():
            time.sleep(2)
            self._print_success_message()
            return True
        time.sleep(2)
        self._print_fail_message()
        return False

    @abstractmethod
    def _print_icon(self):
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


