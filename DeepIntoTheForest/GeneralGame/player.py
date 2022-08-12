#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-08-12 13:22:07
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
import time
# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #


class Player:
    """
    player class
    """

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Constructor
    # ----------------------------------------------------------------------- #
    def __init__(self, name):
        self.name = name
        self._is_alive = True
        self._death_counter = 0

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Getter/Setter
    # ----------------------------------------------------------------------- #
    @property
    def is_alive(self):
        return self._is_alive

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Public Methods
    # ----------------------------------------------------------------------- #
    def die(self, extra: str = ''):
        print(f"Oh NO, {self.name} you died :(\n{extra}")
        self._is_alive = False
        self._death_counter += 1

    def reincarnate(self):
        if self._death_counter == 7:
            print(
                "\nYou already died 7 times, even a cat would be totally dead by know .... but who counts\n")
            time.sleep(3)
        print(f"{self.name} you came back from the dead")
        self._is_alive = True

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Private Methods
    # ----------------------------------------------------------------------- #
# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #

if __name__ == '__main__':
    pass


