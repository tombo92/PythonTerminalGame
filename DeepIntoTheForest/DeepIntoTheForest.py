#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-08-12 11:29:23
# @Author  : Tom Brandherm
# @Python  : 3.10
# @Link    : link
# @Version : 1.0.2
"""
Short Introduction
"""
# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #


import time
from DeepIntoTheForestLevels import (Forest_Level_1, Forest_Level_2, Forest_Level_3, Forest_Level_4,
                                     Forest_Level_5, Forest_Level_6, Forest_Level_7, Forest_Level_8)
from GeneralGame.helper_functions import clear_terminal, is_input_valid, print_lines
from GeneralGame.icons import Icons
from GeneralGame.game import TerminalGame

# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #
VERSION = "1.0.2"
YEAR = 2022
# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #


class Game(TerminalGame):
    """
        game class
    """

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Constructor
    # ----------------------------------------------------------------------- #
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
            match self.level:
                case 0:
                    self.new_adventure = self._explain_rules_and_ask_for_start
                case 1:
                    self.new_adventure = Forest_Level_1(self.player.name, self.debug).start
                case 2:
                    self.new_adventure = Forest_Level_2(self.player.name, self.debug).start
                case 3:
                    self.new_adventure = Forest_Level_3(self.player.name, self.debug).start
                case 4:
                    self.new_adventure = Forest_Level_4(self.player.name, self.debug).start
                case 5:
                    self.new_adventure = Forest_Level_5(self.player.name, self.debug).start
                case 6:
                    self.new_adventure = Forest_Level_6(self.player.name, self.debug).start
                case 7:
                    self.new_adventure = Forest_Level_7(self.player.name, self.debug).start
                case 8:
                    self.new_adventure = Forest_Level_8(self.player.name, self.debug).start
                case _:
                    break
                    print("Level not found :(")

            if self.new_adventure():
                self.level += 1
            else:
                self._kill_player_and_ask_for_restart()

    def stop(self):
        print("bye bye bye, bye bye (in a backsstreet boys way...)")

    def _explain_rules_and_ask_for_start(self) -> bool:
        print(
            f"\nWelcome brave {self.player.name} to our adventure. Try to stay alive you are not a cat!")
        time.sleep(1)
        print("Here are the rules:")
        print_lines([
            "\t 1. Use whatever you like (except the internet of cause).",
            "\t 2. After you die you have to start from the beginning (yes, you heard right: reincarnation).",
            "\t 3. Sometimes you have to press enter to continue your journey.",
            "\t 4. Most of the time it is enough to enter the first letter of the possible answers.",
            "\t 5. All necessary information are automatically copied into the clipboard.",
            "\t 6. Don't blame our perfect creator (yes, praise Tom) for your failur.",
            "\t 7. Be smart and persistant to receive your reward."], delay=2)
        while 1:
            answer = input("Shall we start? [Yes/No] ")
            if is_input_valid(answer, ['yes', 'no', 'y', 'n']):
                return answer.lower() in ['yes', 'y']


# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #

def main():
    print(f"DeepIntoTheForestGame | VERSION: {VERSION} | {YEAR}")
    print(Icons.level0.value)
    game = Game(debug=True)
    game.start()
    game.stop()


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #


if __name__ == '__main__':
    main()
