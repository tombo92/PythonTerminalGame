#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-08-12 11:29:23
# @Author  : Tom Brandherm
# @Python  : 3.10
# @Link    : https://github.com/tombo92
# @Version : 1.0.3
"""
Short Introduction
"""
# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #


import time
import webbrowser
from DeepIntoTheForestLevels import (ForestLevel0, ForestLevel1, ForestLevel2, ForestLevel3,
                                     ForestLevel4, ForestLevel5, ForestLevel6, ForestLevel7,
                                     ForestLevel8, ForestLevel9)
from GeneralGame.helper_functions import clear_terminal
from GeneralGame.game import TerminalGame

# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #


class Game(TerminalGame):
    """
        Game class
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
        first_try = True
        while self.player.is_alive:
            killing_addition: str = ''
            clear_terminal()
            time.sleep(1)
            if first_try:
                match self.level:
                    case 0:
                        self.new_adventure = ForestLevel0(self, self.player, self.debug)
                    case 1:
                        self.new_adventure = ForestLevel1(self.player, self.debug)
                    case 2:
                        self.new_adventure = ForestLevel2(self.player, self.debug)
                    case 3:
                        self.new_adventure = ForestLevel3(self.player, self.debug)
                        killing_addition = '... out of shame'
                    case 4:
                        self.new_adventure = ForestLevel4(self.player, self.debug)
                    case 5:
                        self.new_adventure = ForestLevel5(self.player, self.debug)
                    case 6:
                        self.new_adventure = ForestLevel6(self.player, self.debug)
                    case 7:
                        self.new_adventure = ForestLevel7(self.player, self.debug)
                    case 8:
                        self.new_adventure = ForestLevel8(self.player, self.debug)
                    case 9:
                        self.new_adventure = ForestLevel9(self.player, self.debug)
                    case _:
                        break
                        print("Level not found :(")

            if self.new_adventure.start(first_try):
                self.level += 1
                first_try = True
            elif self.level == 0:
                break
            elif self.level == 8:
                self.level = 1
                self.player.life_counter = 3
            else:
                first_try = False
                self.player.life_counter -= 1
                if self.player.life_counter < 1:
                    first_try = True
                    self._kill_player_and_ask_for_restart(killing_addition)

    def stop(self):
        print("bye bye bye, bye bye (in a NSYNC way...)")
        webbrowser.open("https://www.youtube.com/watch?v=Eo-KmOd3i7s#t=01m04s")


# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #

def main():
    """
    main function
    """
    game = Game(level=6, debug=False)
    game.start()
    game.stop()


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #


if __name__ == '__main__':
    main()
