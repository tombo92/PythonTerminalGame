#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-06-01 17:38:02
# @Author  : Tom Brandherm
# @Python  : 3.10
# @Link    : https://github.com/tombo92
# @Version : 1.0.2
"""
Levels of the DeepIntoTheForest game
"""

# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #
import random
import time
from dialogues import Success, Prolog, Failure, Info, Question
from GeneralGame.player import Player
from GeneralGame.helper_functions import (addToClipBoard, encode_text,
                                          get_indices_of_element_in_list,
                                          is_input_valid, print_lines,
                                          split_dialog)
from GeneralGame.icons import Icons
from GeneralGame.riddle import Riddle


# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #
VERSION = "1.0.2"
YEAR = 2022
# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #


class ForestLevel0(Riddle):
    """
    Initial level of the DeepIntoTheForest game: rules
    """

    def __init__(self, game, player: Player, debug: bool = False):
        super(Riddle, self).__init__()
        self.player: Player = player
        self.correct_answer = None
        self.riddle_data = None
        self.answer = None
        self.debug: bool = debug
        self.game = game

    def _print_icon_and_lives(self):
        print(f"DeepIntoTheForestGame | VERSION: {VERSION} | {YEAR}")
        print(Icons.level0.value)

    def _print_prolog(self):
        print(
            f"\nWelcome brave {self.player.name} to our adventure." +
            " Try to stay alive you are not a cat, but you have \033[1;4mthree\033[0m lifes!")
        time.sleep(1)
        print("Here are the rules:")

    def _print_success_message(self):
        pass

    def _print_fail_message(self):
        print(Failure.LEVEL_1)
        input()

    def _give_necessary_information(self):
        print_lines([
            "\t \x1B[1m1\033[0m. Use whatever you like (except the internet of cause).",
            "\t \x1B[1m2\033[0m. After you die you have to start from the beginning" +
            "(yes, you heard right: reincarnation).",
            "\t \x1B[1m3\033[0m. Sometimes you have to press enter to continue your journey.",
            "\t \x1B[1m4\033[0m. Most of the time it is enough to enter the first letter of the possible answers.",
            "\t \x1B[1m5\033[0m. All necessary information are automatically copied into the clipboard.",
            "\t \x1B[1m6\033[0m. Don't blame our perfect creator (yes, praise Tom) for your failur.",
            "\t \x1B[1m7\033[0m. Be smart and persistant to receive your reward."], delay=2)

    def _calculate_correct_answer(self):
        pass

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            answer = input("Shall we start? [Yes/No] ")
            if answer == "sblu":
                self.game.debug = True
                return True
            if is_input_valid(answer, ['yes', 'no', 'y', 'n']):
                return answer.lower() in ['yes', 'y']

    def _generate_riddle_data(self):
        pass


class ForestLevel1(Riddle):
    """
    First level of the DeepIntoTheForest game: binary choice
    """

    def _print_icon_and_lives(self):
        print(Icons.level1.value)
        print(f"{self._return_life_icons()}\n")

    def _print_prolog(self):
        print(f"{self.player.name} {Prolog.LEVEL_1}\n")

    def _print_success_message(self):
        print_lines(split_dialog(Success.LEVEL_1), 1)

    def _print_fail_message(self):
        print(Failure.LEVEL_1)
        input()

    def _give_necessary_information(self):
        print_lines(split_dialog(Info.LEVEL_1), 2)

    def _calculate_correct_answer(self):
        self.correct_answer: list = ['right', 'r']

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(Question.LEVEL_1)
            if is_input_valid(self.answer, ['left', 'right', 'l', 'r']):
                return self.answer.lower() in self.correct_answer

    def _generate_riddle_data(self):
        pass


class ForestLevel2(Riddle):
    """
    Second level of the DeepIntoTheForest game: gauss summation
    """

    def _print_icon_and_lives(self):
        print(Icons.level2.value)
        print(f"\t{self._return_life_icons()}\n")

    def _print_prolog(self):
        print_lines([f"{self.player.name} {Prolog.LEVEL_2_A} {self.riddle_data} {Prolog.LEVEL_2_B}",
                     Prolog.LEVEL_2_C], 2)

    def _print_success_message(self):
        print_lines(
            [f"{Success.LEVEL_2_A} {self.answer} {Success.LEVEL_2_B} ",
             Success.LEVEL_2_C, ''], 2)

    def _print_fail_message(self):
        if int(self.answer) > self.correct_answer:
            print(Failure.LEVEL_2_A)
        elif int(self.answer) < self.correct_answer:
            print(Failure.LEVEL_2_B)
        print_lines(['.' * (i + 1) for i in range(3)], 1)
        input()

    def _give_necessary_information(self):
        addToClipBoard(str(self.riddle_data))
        print_lines(split_dialog(Info.LEVEL_2), 2)

    def _calculate_correct_answer(self):
        # gauss summation: (n*(n+1))/2
        self.correct_answer: int = (self.riddle_data * (self.riddle_data + 1)) / 2

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(
                f"{Question.LEVEL_2} {self.riddle_data}m? ")
            print_lines([f'{self.player.name} cuts down a tree' for _ in range(3)], 1.5)
            if self.answer.isdigit():
                return int(self.answer) == self.correct_answer
            else:
                is_input_valid('', [1])  # returns always False

    def _generate_riddle_data(self):
        self.riddle_data: int = random.randint(15, 40)


class ForestLevel3(Riddle):
    """
    Third level of the DeepIntoTheForest game: star map
    """

    def _print_icon_and_lives(self):
        print(Icons.level3.value)
        print(f"\t{self._return_life_icons()}\n")

    def _print_prolog(self):
        print_lines([f"{self.player.name} {Prolog.LEVEL_3_A}",
                     Prolog.LEVEL_3_B, Icons.stars.value], 3)

    def _print_success_message(self):
        print_lines(split_dialog(Success.LEVEL_3), 3)

    def _print_fail_message(self):
        print_lines([Failure.LEVEL_3_A,
                     f"{Failure.LEVEL_3_B}{self.player.name}{Failure.LEVEL_3_C}"], 3)

    def _give_necessary_information(self):
        addToClipBoard(str(self.riddle_data[1]))
        print_lines(split_dialog(Info.LEVEL_3) + [Icons.coords.value], 3)

    def _calculate_correct_answer(self):
        self.correct_answer: int = self.riddle_data[0]

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(Question.LEVEL_3)
            if is_input_valid(self.answer, ['fl', 'fr', 'bl', 'br']):
                return self.answer.lower() == self.correct_answer

    def _generate_riddle_data(self):
        self.riddle_data: tuple = self._create_star_map()

    def _create_star_map(self) -> tuple:
        x_shift = random.randint(-5, 5)
        y_shift = random.randint(-5, 5)
        star_map = [(random.randint(-10, 0), random.randint(-10, 10))
                    for _ in range(random.randint(5, 7))]
        star_map += [(-9 + x_shift, -0.5 + y_shift),
                     (-8 + x_shift, 0 + y_shift),
                     (-7 + x_shift, -0.5 + y_shift),
                     (-6 + x_shift, 2 + y_shift),
                     (-6 + x_shift, 1 + y_shift),
                     (-6 + x_shift, -1 + y_shift),
                     (-6 + x_shift, -3 + y_shift),
                     (-5 + x_shift, 2 + y_shift),
                     (-5 + x_shift, 1 + y_shift),
                     (-4.5 + x_shift, 2.5 + y_shift),
                     (-4 + x_shift, -1 + y_shift),
                     (-4 + x_shift, -3 + y_shift),
                     (-4 + x_shift, 3 + y_shift),
                     (-3.5 + x_shift, 3.5 + y_shift)]

        north_polar_star = star_map[-1]
        star_map += [(random.randint(0, 10), random.randint(-10, 10))
                     for _ in range(random.randint(5, 7))]

        if north_polar_star[0] > 0 and north_polar_star[1] > 0:
            direction = 'fr'
        elif north_polar_star[0] < 0 and north_polar_star[1] > 0:
            direction = 'fl'
        elif north_polar_star[0] < 0 and north_polar_star[1] < 0:
            direction = 'bl'
        else:
            direction = 'br'
        return direction, star_map


class ForestLevel4(Riddle):
    """
    Fourth level of the DeepIntoTheForest game: binary choice
    """

    def _print_icon_and_lives(self):
        print(Icons.level4.value)
        print(f"\t{self._return_life_icons()}\n")

    def _print_prolog(self):
        print_lines(split_dialog(Prolog.LEVEL_4), 3)

    def _print_success_message(self):
        print_lines(['', f"{Success.LEVEL_4_A} {self.player.name} {Success.LEVEL_4_B}",
                     Success.LEVEL_4_C, ''], 2)

    def _print_fail_message(self):
        print_lines([''] + split_dialog(Failure.LEVEL_4), 3)

    def _give_necessary_information(self):
        pass

    def _calculate_correct_answer(self):
        self.correct_answer: list = ['tree', 't']

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(Question.LEVEL_4)
            if is_input_valid(self.answer, ['tree', 't', 'ground', 'g']):
                print("you fall asleep...")
                print_lines(['\t' + i*' ' + 'z' for i in range(4)] + ['\t' + 4*' ' + 'Z'], 0.5)
                return self.answer.lower() in self.correct_answer

    def _generate_riddle_data(self):
        pass


class ForestLevel5(Riddle):
    """
    Fifth level of the DeepIntoTheForest game: probability calculation
    """

    def _print_icon_and_lives(self):
        print(Icons.level5.value)
        print(f"\t{self._return_life_icons()}\n")

    def _print_prolog(self):
        print_lines([f"{self.player.name} {Prolog.LEVEL_5_A}"] + split_dialog(Prolog.LEVEL_5_B) +
                    [f"\t {self.player.name} {Prolog.LEVEL_5_C}", Prolog.LEVEL_5_D], 3)

    def _print_success_message(self):
        print_lines(
            ['',
             f"{Success.LEVEL_5_A} {(self.correct_answer[0]*100):.2f}% {Success.LEVEL_5_B}", ''],
            2)

    def _print_fail_message(self):
        print_lines(split_dialog(Failure.LEVEL_5_A) +
                    [f"{self.player.name} {Failure.LEVEL_5_B}"], 1)
        input()

    def _give_necessary_information(self):
        addToClipBoard(str(self.riddle_data))
        print_lines(split_dialog(Info.LEVEL_5), 1)
        for i, path in enumerate(self.riddle_data):
            print(f"\t[{i+1}] \t: {path}")

    def _calculate_correct_answer(self) -> tuple:
        propabilities: list = [0]
        best_choice_propability: float = 0
        for path in self.riddle_data:
            p: float = self._calculate_probability_of_survival(path)
            best_choice_propability = max(p, best_choice_propability)
            propabilities.append(p)
        self.correct_answer: tuple = (best_choice_propability,
                                      get_indices_of_element_in_list(
                                        propabilities,
                                        best_choice_propability))

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(Question.LEVEL_5)
            if self.answer.isdigit():
                print_lines([f"{self.player.name} climbs down the tree" for _ in range(3)], 0.5)
                return int(self.answer) in self.correct_answer[1]
            else:
                is_input_valid('', [1])  # return always False

    def _generate_riddle_data(self):
        self.riddle_data: list = self._create_path_array()

    def _create_path_array(self) -> list:
        while 1:
            paths = []
            for _ in range(20):
                paths.append([random.randint(0, 10)
                             for _ in range(random.randint(2, 5))])
            for path in paths:
                if 0 < self._calculate_probability_of_survival(path) <= 1:
                    return paths

    def _calculate_probability_of_survival(self, risky_path: list) -> float:
        total_survival_propability = 1
        for risk in risky_path:
            survival_propability = 1 - risk / 10
            if survival_propability == 0:
                return 0
            total_survival_propability *= survival_propability
        return total_survival_propability


class ForestLevel6(Riddle):
    """
    Sixth level of the DeepIntoTheForest game: pattern recognition
    """

    def _print_icon_and_lives(self):
        print(Icons.level6.value)
        print(f"\t{self._return_life_icons()}\n")

    def _print_prolog(self):
        print_lines(split_dialog(Prolog.LEVEL_6_A) +
                    [f"{Prolog.LEVEL_6_B} {self.player.name}."] +
                    split_dialog(Prolog.LEVEL_6_C) +
                    [Icons.monster.value] +
                    split_dialog(Prolog.LEVEL_6_D), 3)

    def _print_success_message(self):
        print_lines(split_dialog(Success.LEVEL_6_A) +
                    [f"{self.player.name} {Success.LEVEL_6_B}", f"{self.player.name} {Success.LEVEL_6_C}",
                     Success.LEVEL_6_D, ''], 3)

    def _print_fail_message(self):
        print_lines(split_dialog(Failure.LEVEL_6), 3)
        input()

    def _give_necessary_information(self):
        addToClipBoard(str(self.riddle_data[1]))
        print_lines(split_dialog(Info.LEVEL_6) + [self.riddle_data[1]], 2)

    def _calculate_correct_answer(self) -> tuple:
        self.correct_answer: str = self.riddle_data[0]

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(Question.LEVEL_6)
            if is_input_valid(self.answer, ['r', 'l', 'f', 'k']):
                time.sleep(3)
                if self.answer == 'r':
                    print(f"{self.player.name} jumps to the right")
                elif self.answer == 'f':
                    print(f"{self.player.name} does a perfect roll (every gymnast would be proud!)")
                elif self.answer == 'l':
                    print(f"{self.player.name} jumps to the left")
                elif self.answer == 'k':
                    print(f"{self.player.name} kicks to the front")
                return self.answer == self.correct_answer

    def _generate_riddle_data(self):
        self.riddle_data: list = self._create_attack_pattern()

    def _create_attack_pattern(self) -> tuple:
        pattern_list = [
            # left left something left left something right right something right right ...
            ('r', ['L', 'L', 'R', 'L', 'L', 'T', 'R',
             'R', 'F', 'R', 'R', 'L', 'L', 'L']),
            # pattern starts new after the FF
            ('k', ['T', 'T', 'F', 'F', 'L', 'L', 'R', 'R', 'L', 'L',
             'F', 'F', 'T', 'T']),
            # each letter has a specific amount of occurence
            ('r', ['R', 'T', 'T', 'L', 'L', 'L', 'F', 'F', 'R', 'F', 'F', 'L', 'L'])]
        return random.choice(pattern_list)


class ForestLevel7(Riddle):
    """
    Seventh level of the DeepIntoTheForest game: cipher fun
    """

    def _print_icon_and_lives(self):
        print(Icons.level7.value)
        print(f"\t{self._return_life_icons()}\n")

    def _print_prolog(self):
        print_lines(split_dialog(Prolog.LEVEL_7_A) + [f"{self.player.name} {Prolog.LEVEL_7_B}"], 3)

    def _print_success_message(self):
        print_lines(
            [Success.LEVEL_7, Icons.firework.value, '', ''], 2)

    def _print_fail_message(self):
        print_lines(split_dialog(Failure.LEVEL_7), 4)
        input()

    def _give_necessary_information(self):
        addToClipBoard(str(self.riddle_data))
        print("\n" + "=" * (len(self.riddle_data) + 8))
        print("||  " + self.riddle_data + "  ||")
        print("=" * (len(self.riddle_data) + 8) + '\n')

    def _calculate_correct_answer(self) -> tuple:
        self.correct_answer: int = 550 - 37 * 4 + 18

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(f"{self.player.name} {Question.LEVEL_7}")
            print(Icons.spell)
            return self.answer == str(420)

    def _generate_riddle_data(self):
        plaintext = "fünfhundertfünfzig minus siebenunddreissig mal vier plus achtzehn"
        self.riddle_data: str = encode_text(plaintext, self.player.name)


class ForestLevel8(ForestLevel1):
    """
    Eighth level of the DeepIntoTheForest game: binary choice
    """

    def _print_icon_and_lives(self):
        print(f"\t{self._return_life_icons()}\n")

    def _print_prolog(self):
        pass

    def _print_success_message(self):
        print_lines(
            ['', f'{self.player.name} {Success.LEVEL_8_A}',
             Success.LEVEL_8_B, Icons.question_mark.value,
             Success.LEVEL_8_C], 3)
        input("[Press a key to take a look]")
        print_lines([Icons.certificate.value,
                     f"\t{self.player.name} {Success.LEVEL_8_D}"] +
                    split_dialog(Success.LEVEL_8_E), 4)
        addToClipBoard(
            f"{self.player.name} {Success.LEVEL_8_F}")
        input("[Press a key to exit the game]")

    def _print_fail_message(self):
        print_lines(split_dialog(Success.LEVEL_1.replace(" life", 'life ... AGAIN')) + [''], 2)

    def _calculate_correct_answer(self):
        self.correct_answer: list = ['left', 'l']


# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #

if __name__ == '__main__':
    pass
