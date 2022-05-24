#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-05-24 13:55:35
# @Author  : Tom Brandherm (tom.brandherm@msasafety.com)
# @Python  : 3.10
# @Link    : link
# @Version : 0.0.1
"""
Short Introduction
"""
# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #

import os
import time
import random
from icons import Icons

# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #
class Player:

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Constructor
    # ----------------------------------------------------------------------- #
    def __init__(self, name):
        self.name = name
        self._is_alive = True

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Getter/Setter
    # ----------------------------------------------------------------------- #
    @property
    def is_alive(self):
        return self._is_alive

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Public Methods
    # ----------------------------------------------------------------------- #
    def die(self):
        print(f"Oh NO, {self.name} you died :(\n")
        self._is_alive = False

    def run(self):
        print(f"{self.name} runs")

    def climb(self):
        print(f"{self.name} climbs")

    def cut_down_tree(self):
        print(f"{self.name} cuts down a tree")

    def reincarnate(self):
        print(f"{self.name} you came back from the dead")
        self._is_alive = True

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Private Methods
    # ----------------------------------------------------------------------- #
class Game:

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Constructor
    # ----------------------------------------------------------------------- #
    def __init__(self, level: int = 0):
        self.player: Player = self._create_new_player()
        self.level: int = level
    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Getter/Setter
    # ----------------------------------------------------------------------- #

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Public Methods
    # ----------------------------------------------------------------------- #
    def start(self):
        while self.player.is_alive:
            time.sleep(1)
            clear_terminal()
            if self.level == 0:
                print(f"Welcome brave {self.player.name} to our adventure. Try to stay alive you are not a cat!")
                time.sleep(1)
                print("Here are the rules:")
                print_lines([
                    "\t 1. Use what ever you like (except the internet of cause).",
                    "\t 2. After you die you have to start from the beginning (yes, you heard right: reincarnation).",
                    "\t 3. Sometimes you have to press enter to continue your jouney.",
                    "\t 4. Most of the time it is enaugh to enter the first letter of the possible anwers.",
                    "\t 5. Don't blame our perfect creator (yes, paraise Tom) for your failur.",
                    "\t 6. Be smart and persistant to receive your reward."], delay=2)
                while 1:
                    answer = input("Shall we start? [Yes/No] ")
                    if is_input_valid(answer, ['yes', 'no', 'y', 'n']):
                        if answer.lower() in ['yes', 'y']:
                            self.level = 1
                            break
                        self._kill_player_and_ask_for_restart()
                        break
            elif self.level == 1:
                print(Icons.level1.value)
                time.sleep(1)
                print(f"{self.player.name} you are in front of a big dark forest and you are super brave, some say THE bravest. So you entering it to find the lost treasure.")
                time.sleep(1)
                input()
                print('You arrived at a crossroads:\n On the LEFT the thicket clears and you see the sun shining through the trees.\n On the RIGHT the opposite is the case. It seems like the road is vanishing in the darkness of the forest (spoookey).')
                while 1:
                    answer = input("What do you want to do? [LEFT, RIGHT] ")
                    if is_input_valid(answer, ['left', 'right', 'l', 'r']):
                        if answer.lower() in ['left', 'l']:
                            time.sleep(1)
                            print('You fool that was the way out of the forest. You are leaving the forest without the treasure and die in poverty (some decades later, but you die)')
                            self._kill_player_and_ask_for_restart()
                            break
                        elif answer.lower() in ['right', 'r']:
                            print_lines(['going into the dark...', "risking your live...", "GOOD CHOICE!!!"], 1)
                            self.level = 2
                            break
            elif self.level == 2:
                print(Icons.level2.value)
                time.sleep(1)
                height = random.randint(50,100)
                print(f"{self.player.name} you reached a ledge of {height} meters. There is only one way to get up there...")
                time.sleep(1)
                print("You have to built stairs out of tree trunks.")
                input()
                print("The average tree trunk (O) has a diameter of 50cm. If the goal for the stairs would be to reach a hight of 1.5m it would look like that:")
                print("""
                       O
                      OO
                     OOO
                """)
                input()
                print("Have I mentioned that you have a axe, haven't I? Yes you carry that heavy thing around the whole time, bit strage that you didn't noticed it.")
                while 1:
                    answer = input(f"How many trees do you have to cut down to reach the height of {height}m? ")
                    correct_answer = sum([i for i in range(height*2 + 1)])
                    if answer.isdigit():
                        for _ in range(3):
                            self.player.cut_down_tree()
                            time.sleep(0.5)
                        if int(answer) == correct_answer:
                            self.level = 3
                            print(f"That was not as easy as expected, cutting down {answer} trees. I see (smell) you sweated a little bit, but we made it....")
                            time.sleep(0.5)
                            print("Let's get up that ledge...")
                            break
                        for _ in range(3):
                            print('.')
                            time.sleep(0.5)
                        if int(answer) > correct_answer:
                            print(
                                "Too much work for one single person. Considered retrospectively the amount of trees I cut down was to high. You die from exhaustion.")
                            self._kill_player_and_ask_for_restart()
                        elif int(answer) < correct_answer:
                            print(f"You build a stairway out of the trunks, but you calculated to less trees....you are falling from your pile, break you neck and die")
                            self._kill_player_and_ask_for_restart()
                        break
            elif self.level == 3:
                print(Icons.level3.value)
                time.sleep(0.5)
                print(f"{self.player.name} you reached the top ledge and now you can enter a different part of the forest. You have a good overview from here but it already got a bit late....damn trunk stairway building")
                input()
                print("You should rest a bit, but the forest is still a dangerous place.")
                input()
                print("You could either climb up a tree, even if you are already a 'bit' exhausted and sleep on a big branch or you could find nice cozy place on the ground...as cozy as sleeping on the ground could be.")
                while 1:
                    answer = input("Where dou you want to sleep? [TREE, GROUND] ")
                    if is_input_valid(answer, ['tree', 't', 'ground', 'g']):
                        print("you fall asleep...")
                        for i in range(3):
                            print('\t'+ i*' ' + 'z')
                            time.sleep(0.5)
                        print('\t' + 4*' ' + 'Z')
                        if answer.lower() in ['ground', 'g']:
                            time.sleep(0.5)
                            print('I told you it is dangerous here in the forest and you decided to sleep on the ground...')
                            time.sleep(2)
                            print('Something or someone (it is really dark, as I mentioned) is attacking you while you are sleeping ...\n')
                            self._kill_player_and_ask_for_restart()
                        elif answer.lower() in ['tree', 't']:
                            print(f"damn {self.player.name}...")
                            time.sleep(2)
                            print("that was a really good decision, you are recovered and top fit to continue")
                            self.level = 4
                        break
            elif self.level == 4:
                print(Icons.level4.value)
                time.sleep(0.5)
                input()

            elif self.level == 5:
                print(Icons.level5.value)
                time.sleep(0.5)
                input()

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Private Methods
    # ----------------------------------------------------------------------- #
    def _create_new_player(self) -> Player:
        while 1:
            name = input("Who is playing this game?: ")
            while 1:
                if name.lower() == 'wessel':
                    print("Wessel it's you, what a surprise :-p")
                check = input(f"Hello {name}, is that the name you want to be called? [Yes/No] ")
                if is_input_valid(check, ['yes', 'no', 'y', 'n']):
                    if check.lower() in ['yes', 'y']:
                        return Player(name)
                    clear_terminal()
                    break

    def _kill_player_and_ask_for_restart(self):
        self.player.die()
        answer = input(f"{self.player.name} do you want to restart your quest? [Yes/No] ")
        if is_input_valid(answer, ['yes', 'no', 'y', 'n']):
            if answer.lower() in ['yes', 'y']:
                self.level = 1
                self.player.reincarnate()
                time.sleep(1)


# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #
def is_input_valid(answer: str, options: list) -> bool:
    if answer.lower() in options:
        return True
    print("Please concentrate my friend and give a valid answer ... what do you want to do?")
    return False


def clear_terminal():
    os.system('cls' if os.name == 'nt' else 'clear')


def print_lines(lines: list, delay: int=0):
    for line in lines:
        print(line)
        time.sleep(delay)


def main():
    game = Game(level=4)
    game.start()


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #
if __name__ == '__main__':
    print(Icons.level0.value)
    main()


