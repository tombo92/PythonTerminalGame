#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-05-24 15:31:29
# @Author  : Tom Brandherm
# @Python  : 3.10
# @Link    : https://github.com/tombo92
# @Version : 1.0.2
"""
dugeon game
--> horrobly written and buggy!!! has to be refactored!
"""

# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #
from abc import ABC, abstractmethod
import time
import emoji
from pynput import keyboard
from colorama import Fore, Style
from GeneralGame.helper_functions import clear_terminal
from GeneralGame.icons import Icons


# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #
class Moving_Object(ABC):
    """
        game class
    """

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Constructor
    # ----------------------------------------------------------------------- #
    def __init__(self):
        self._symbol = None
        self._x: int = None
        self._y: int = None
        self._map: list = None

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Getter/Setter
    # ----------------------------------------------------------------------- #
    @property
    def x(self) -> int:
        return self._x

    @property
    def y(self) -> int:
        return self._y

    @property
    def symbol(self) -> emoji:
        return self._symbol
    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Public Methods
    # ----------------------------------------------------------------------- #

    @abstractmethod
    def move(self, x_shift: int = 0, y_shift: int = 0) -> None:
        pass

    def _inside_borders(self, x_shift: int = 0, y_shift: int = 0) -> bool:
        in_x_range: bool = 7 <= (self._x + x_shift) < (len(self._map[10]) - 3)
        in_y_range: bool = 5 <= (self._y + y_shift) < (len(self._map))
        return in_x_range and in_y_range

    def _spot_is_empty(self, x_shift: int = 0, y_shift: int = 0) -> bool:
        possible_move_list: list = [' ', 'X', 'U', '∩']
        return self._map[self._y + y_shift][self._x + x_shift] in possible_move_list


class Passenger(Moving_Object):

    def __init__(self, x: int, y: int, dungeon_map: list):
        super(Moving_Object).__init__()
        self.opend_exit: bool = False
        self._symbol = f'{Fore.GREEN}O{Style.RESET_ALL}'
        self._x: int = x
        self._y: int = y
        self._map: list = dungeon_map

    def move(self, x_shift: int = 0, y_shift: int = 0):
        if self._inside_borders(x_shift, y_shift) and self._spot_is_empty(x_shift, y_shift):
            self._check_and_open_exit(x_shift, y_shift)
            self._x += x_shift
            self._y += y_shift

    def _check_and_open_exit(self, x_shift: int = 0, y_shift: int = 0):
        if (self._x + x_shift) in [11, 12] and (self._y + y_shift) == 38:
            self.opend_exit = True


class Persecuter(Moving_Object):

    def __init__(self, x: int, y: int, dungeon_map: list):
        super(Moving_Object).__init__()
        self._x = x
        self._y = y
        # emoji.emojize(':ogre:', language='alias')
        self._symbol = f'{Fore.RED}X{Style.RESET_ALL}'
        self._map = dungeon_map
        self._pursued_x: int = None
        self._pursued_y: int = None
        self._range_counter: int = 0

    def move(self, pursued: Passenger) -> None:
        x_shift: int = pursued.x
        y_shift: int = pursued.y


class Dungeon:

    def __init__(self, dungeon_map: str):
        self._map: list = dungeon_map.split('\n')
        self._persecuter: Persecuter = Persecuter(
            x=27, y=51, dungeon_map=self._map)
        self._pursued: Passenger = Passenger(
            x=len(self._map[10])-4, y=len(self._map)-3,
            dungeon_map=self._map)
        self._exit_open: bool = False
        self._puzzle_solved: bool = False

    def start_quest(self) -> bool:
        self._draw_dungeon()
        print("Use the arrow keys to move.")
        while not self._puzzle_solved:
            with keyboard.Events() as events:
                event = events.get(1e6)
            if event.key == keyboard.Key.up:
                self._pursued.move(y_shift=-1)
            elif event.key == keyboard.Key.down:
                self._pursued.move(y_shift=1)
            elif event.key == keyboard.Key.left:
                self._pursued.move(x_shift=-1)
            elif event.key == keyboard.Key.right:
                self._pursued.move(x_shift=1)
            else:
                continue

            self._persecuter.move(self._pursued)
            time.sleep(0.05)
            clear_terminal()

            # persecuter killed pursued
            print((self._persecuter.x, self._persecuter.y))
            print((self._pursued.x, self._pursued.y))
            if (self._persecuter.x, self._persecuter.y) == (self._pursued.x - 9, self._pursued.y):
                return False
            if self._pursued.opend_exit:
                self.open_exit()
            self._draw_dungeon()
            print("Use the arrow keys to move.")
        return True

    def _draw_dungeon(self):
        upper_line: int = min(len(self._map), self._pursued.y + 5)
        lower_line: int = max(0, self._pursued.y - 5)
        for y, line in enumerate(self._map):
            if y == self._persecuter.y:
                line = line[:self._persecuter.x] + \
                    self._persecuter.symbol + line[self._persecuter.x + 1:]
            if y == self._pursued.y:
                line = line[:self._pursued.x] + \
                    self._pursued.symbol + line[self._pursued.x + 1:]
            if lower_line <= y <= upper_line:
                print(line)

    def open_exit(self):
        self._map: list = Icons.tunnel_open.value.split('\n')
        self._exit_open: bool = True


# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #

if __name__ == '__main__':
    Dungeon(Icons.tunnel_closed.value).start_quest()
