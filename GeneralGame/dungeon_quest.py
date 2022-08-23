#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-05-24 15:31:29
# @Author  : Tom Brandherm
# @Python  : 3.10
# @Link    : https://github.com/tombo92
# @Version : 1.1.0
"""
dugeon game
--> buggy!!! has to be refactored!
"""

# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #
from abc import ABC
import time
import emoji
from pynput import keyboard
from colorama import Fore, Style
from GeneralGame.helper_functions import clear_terminal, rainbow_str, replace_character
from GeneralGame.icons import Icons


# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #
class MovingObject(ABC):
    """
        abstract Moving_Object class
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

    def _inside_borders(self, x_shift: int = 0, y_shift: int = 0) -> bool:
        width: int = max([len(i) for i in self._map])
        in_x_range: bool = 6 <= (self._x + x_shift) <= width
        in_y_range: bool = 0 <= (self._y + y_shift) <= len(self._map)
        return in_x_range and in_y_range

    def _spot_is_empty(self, x_shift: int = 0, y_shift: int = 0) -> bool:
        possible_move_list: list = [' ', 'X', 'U', '∩']
        empty = self._map[self._y + y_shift][self._x +
                                             x_shift] in possible_move_list
        exit_quest = self._found_exit(x_shift, y_shift)
        return empty or exit_quest

    def _found_exit(self, x_shift: int = 0, y_shift: int = 0) -> bool:
        x_exit_range = range(23, 27)
        y_exit_range = 3
        return (self._x + x_shift) in x_exit_range and (self._y + y_shift) == y_exit_range


class Passenger(MovingObject):

    def __init__(self, x: int, y: int, dungeon_map: list):
        super(MovingObject).__init__()
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
        if (self._x + x_shift) in [11, 12] and (self._y + y_shift) == 37:
            self.opend_exit = True


class Persecuter(MovingObject):

    def __init__(self, x: int, y: int, dungeon_map: list):
        super(MovingObject).__init__()
        self._x = x
        self._y = y
        # emoji.emojize(':ogre:', language='alias')
        self._symbol = f'{Fore.RED}X{Style.RESET_ALL}'
        self._map = dungeon_map
        self._pursued_x: int = 1000  # to high value
        self._pursued_y: int = 1000  # to high value
        self._range_counter: int = 0

    def move(self, pursued: Passenger) -> None:
        if (self._pursued_x, self._pursued_y) != (pursued.x, pursued.y):
            self._pursued_x = pursued.x
            self._pursued_y = pursued.y
        else:
            return
        self._range_counter += 1
        if pursued.x - self._x != 0:
            x_shift: int = (pursued.x - self._x) // abs((pursued.x - self._x))
        else:
            x_shift = 0
        if pursued.y - self._y != 0:
            y_shift: int = (pursued.y - self._y) // abs((pursued.y - self._y))
        else:
            y_shift = 0
        for _ in range(1, self._range_counter // 40):
            if self._inside_borders(x_shift, y_shift) and self._spot_is_empty(x_shift, y_shift):
                self._x += x_shift
                self._y += y_shift


class Dungeon:

    def __init__(self, dungeon_map: str):
        self._map: list = dungeon_map.split('\n')
        self._persecuter: Persecuter = Persecuter(
            x=27, y=50, dungeon_map=self._map)
        self._pursued: Passenger = Passenger(
            x=8, y=49,
            dungeon_map=self._map)
        self._exit_open: bool = False
        self._puzzle_solved: bool = False

    def start_quest(self) -> bool:
        rainbow: bool = False
        self._draw_dungeon()
        print("\nUse the arrow keys to move.")
        while not self._puzzle_solved:
            with keyboard.Events() as events:
                event = events.get(1e6)
            if event.key == keyboard.Key.up:
                self._pursued.move(y_shift=-1)
                if self._pursued.opend_exit and not self._exit_open:
                    rainbow = False
                    self.open_exit()
                elif self._pursued.y <= 3:
                    break
            elif event.key == keyboard.Key.down:
                self._pursued.move(y_shift=1)
            elif event.key == keyboard.Key.left:
                self._pursued.move(x_shift=-1)
            elif event.key == keyboard.Key.right:
                self._pursued.move(x_shift=1)
                if (self._pursued.x, self._pursued.y) == (47, 23) and not rainbow:
                    rainbow: bool = True
            else:
                continue
            self._persecuter.move(self._pursued)
            time.sleep(0.05)
            clear_terminal()
            # print(self._pursued.x, self._pursued.y)
            # persecuter killed pursued
            if (self._persecuter.x, self._persecuter.y) == (self._pursued.x, self._pursued.y):
                return False
            self._draw_dungeon(center=True, rainbow=rainbow)
            print("\nUse the arrow keys to move.")
        return True

    def _draw_dungeon(self, center: bool = False, rainbow: bool = False):
        upper_line: int = min(len(self._map), self._pursued.y + 5)
        lower_line: int = max(0, self._pursued.y - 5)
        if center:
            print('\n' * 10)
        for y, line in enumerate(self._map):
            if y == self._persecuter.y:
                line = replace_character('X', line, self._persecuter.x)
            if y == self._pursued.y:
                line = replace_character('O', line, self._pursued.x)
            if rainbow:
                line = rainbow_str(line)
            line = line.replace('X', self._persecuter.symbol)
            line = line.replace('O', self._pursued.symbol)
            if lower_line <= y <= upper_line:
                print('\t' * 5 + line)

    def open_exit(self):
        """
        open exit and change the map
        """
        self._map: list = Icons.tunnel_open.value.split('\n')
        self._exit_open: bool = True
        self._draw_dungeon()
        clear_terminal()


# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #

if __name__ == '__main__':
    pass
