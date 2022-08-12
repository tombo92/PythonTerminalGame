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
import math
import time
import pandas as pd

# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Abstract Class definitions
# =========================================================================== #


class Riddle(ABC):

    def __init__(self, player_name: str, debug: bool = False,
                 dialog_path: str = 'dialogues.xlsx', sheet_name: str = '1'):
        self.name: str = player_name
        self.correct_answer = None
        self.riddle_data = None
        self.answer = None
        self.debug: bool = debug
        self.dialog_path: str = dialog_path
        self._prolog_dialog: list = None
        self._success_dialog: list = None
        self._failure_dialog: list = None
        self._info_dialog: list = None
        self._sheet_name: str = sheet_name

    def start(self) -> bool:
        self._generate_riddle_data()
        self._import_dialogues()
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

    def _import_dialogues(self):
        df = pd.read_excel(self.dialog_path, sheet_name=self._sheet_name)
        self._prolog_dialog: list = [x for x in df['prolog'].to_list() if isinstance(x, str)]
        self._success_dialog: list = [x for x in df['success'].to_list() if isinstance(x, str)]
        self._failure_dialog: list = [x for x in df['failure'].to_list() if isinstance(x, str)]
        self._info_dialog: list = [x for x in df['info'].to_list() if isinstance(x, str)]
        print(self._prolog_dialog)
        print(self._success_dialog)
        print(self._failure_dialog)
        print(self._info_dialog)

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


