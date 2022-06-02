#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-06-01 17:38:02
# @Author  : Tom Brandherm
# @Python  : 3.9
# @Link    : link
# @Version : 1.0.1
"""
Short Introduction
"""

# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #
import random
from helper_functions import is_input_valid, print_lines
from icons import Icons
from riddle import Riddle

# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #

class Forest_Level_1(Riddle):

    def _print_icon(self):
        print(Icons.level1.value)

    def _print_prolog(self):
        print(f"{self.name} you are in front of a big dark forest and you are super brave, some say THE bravest. So you entering it to find the lost treasure.\n")

    def _print_success_message(self):
        print_lines([' Going into the dark...',
                    " Risking your live...", " GOOD CHOICE!!!"], 1)
        input()

    def _print_fail_message(self):
        print('You fool that was the way out of the forest. You are leaving the forest without the treasure and die in poverty (some decades later, but you die)')

    def _give_necessary_information(self):
        print_lines(['You are finding yourself at a crossroad:', "\tOn the LEFT the thicket clears and you see the sun shining through the trees.",
                    "\tOn the RIGHT the opposite is the case. It seems like the road is vanishing in the darkness of the forest (spoookey)."],
                    2)

    def _calculate_correct_answer(self):
        self.correct_answer: list = ['right', 'r']

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            answer = input("What do you want to do? [LEFT, RIGHT] ")
            if is_input_valid(answer, ['left', 'right', 'l', 'r']):
                return answer.lower() in self.correct_answer


class Forest_Level_2(Riddle):

    def _print_prolog(self):
        print(f"{self.name} you are in front of a big dark forest and you are super brave, some say THE bravest. So you entering it to find the lost treasure.\n")

    def _print_success_message(self):
        print_lines([' Going into the dark...',
                    " Risking your live...", " GOOD CHOICE!!!"], 1)
        input()

    def _print_fail_message(self):
        print('You fool that was the way out of the forest. You are leaving the forest without the treasure and die in poverty (some decades later, but you die)')

    def _give_necessary_information(self):
        print_lines(['You are finding yourself at a crossroad:', "\tOn the LEFT the thicket clears and you see the sun shining through the trees.",
                    "\tOn the RIGHT the opposite is the case. It seems like the road is vanishing in the darkness of the forest (spoookey)."],
                    2)

    def _calculate_correct_answer(self):
        self.correct_answer: list = random.randint(50, 100)

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            answer = input("What do you want to do? [LEFT, RIGHT] ")
            if is_input_valid(answer, ['left', 'right', 'l', 'r']):
                return answer.lower() in self.correct_answer


# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #

if __name__ == '__main__':
    Forest_Level_1('tom').start()


