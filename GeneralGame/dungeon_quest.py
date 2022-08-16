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
import time
import emoji
from pynput import keyboard
from GeneralGame.helper_functions import clear_terminal
from GeneralGame.icons import Icons


# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #


class Passenger:

    def __init__(self, x: int, y: int):
        self._x = x
        self._y = y
        self._symbol = emoji.emojize(':person_running:', language='alias')

    @property
    def x(self) -> int:
        return self._x

    @property
    def y(self) -> int:
        return self._y

    @property
    def symbol(self) -> emoji:
        return self._symbol

    def move_down(self):
        self._y += 1

    def move_up(self):
        self._y -= 1

    def move_right(self):
        self._x += 1

    def move_left(self):
        self._x -= 1


class Persecuter:

    def __init__(self, x: int, y: int):
        self._x = x
        self._y = y
        self._symbol = emoji.emojize(':ogre:', language='alias')

    @property
    def x(self) -> int:
        return self._x

    @property
    def y(self) -> int:
        return self._y

    @property
    def symbol(self) -> emoji:
        return self._symbol

    def move(self, pursued_move: str) -> None:
        match pursued_move:
            case 'up':
                self._y -= 1
            case 'down':
                self._y += 1
            case 'right':
                self._x += 1
            case 'left':
                self._x -= 1
            case _:
                print('unknown move')


class Dungeon:

    def __init__(self, dungeon_map: str):
        self._map: list = dungeon_map.split('\n')
        self._persecuter: Persecuter = Persecuter(x=27, y=51)
        self._pursued: Passenger = Passenger(
            x=len(self._map[10])-4, y=len(self._map)-3)
        self._exit_open: bool = False
        self._puzzle_solved: bool = False

    def start_quest(self) -> bool:
        self._draw_dungeon()
        print(f"Use the arrow keys to move: {emoji.emojize(':left_arrow: ', language='alias')}" +
              f"{emoji.emojize(':up_arrow: ', language='alias')}" +
              f"{emoji.emojize(':down_arrow: ', language='alias')}" +
              f"{emoji.emojize(':right_arrow: ', language='alias')}")
        while not self._puzzle_solved:
            with keyboard.Events() as events:
                event = events.get(1e6)
            if event.key == keyboard.Key.up:
                if self._check_next_move('up', self._pursued):
                    self._pursued.move_up()
                for _ in range(2):
                    if self._check_next_move('up', self._persecuter):
                        self._persecuter.move('up')
            elif event.key == keyboard.Key.down:
                if self._check_next_move('down', self._pursued):
                    self._pursued.move_down()
                for _ in range(2):
                    if self._check_next_move('down', self._persecuter):
                        self._persecuter.move('down')
            elif event.key == keyboard.Key.left:
                if self._check_next_move('left', self._pursued):
                    self._pursued.move_left()
                for _ in range(2):
                    if self._check_next_move('left', self._persecuter):
                        self._persecuter.move('left')
            elif event.key == keyboard.Key.right:
                if self._check_next_move('right', self._pursued):
                    self._pursued.move_right()
                for _ in range(2):
                    if self._check_next_move('right', self._persecuter):
                        self._persecuter.move('right')
            else:
                continue
            time.sleep(0.05)
            clear_terminal()

            if (self._persecuter.x, self._persecuter.y) == (self._pursued.x, self._pursued.y):
                return False
            self._draw_dungeon()
            print(f"Use the arrow keys to move: {emoji.emojize(':left_arrow: ', language='alias')}" +
                  f"{emoji.emojize(':up_arrow: ', language='alias')}" +
                  f"{emoji.emojize(':down_arrow: ', language='alias')}" +
                  f"{emoji.emojize(':right_arrow: ', language='alias')}")
        return True

    def _draw_dungeon(self):
        for y, line in enumerate(self._map):
            if y == self._persecuter.y:
                line = line[:self._persecuter.x-1] + \
                    self._persecuter.symbol + line[self._persecuter.x + 1:]
            if y == self._pursued.y:
                line = line[:self._pursued.x-1] + \
                    self._pursued.symbol + line[self._pursued.x + 1:]
            print(line)

    def _check_next_move(self, direction: str, moving_object) -> bool:
        in_borders: bool = False
        is_empty: bool = False
        possible_move_list: list = [' ', emoji.emojize(':ogre:', language='alias'),
                                    emoji.emojize(':person_running:', language='alias')]
        if direction == 'up':
            new_y: int = moving_object.y - 1
            in_borders = (moving_object.y - 1) in range(5, len(self._map))
            is_empty = self._map[moving_object.y -
                                 1][moving_object.x] in possible_move_list
            if self._exit_open and moving_object.x in range(24, 28) and new_y == 4:
                self._puzzle_solved = True
        elif direction == 'down':
            new_y: int = moving_object.y + 1
            in_borders = (new_y) in range(5, len(self._map))
            is_empty = self._map[new_y][moving_object.x] in possible_move_list
            if moving_object.x in [11, 12] and new_y == 38:
                self.open_exit()
        elif direction == 'right':
            in_borders = (moving_object.x + 1) in range(7, len(self._map[10])-3)
            is_empty = self._map[moving_object.y][moving_object.x +
                                                  1] in possible_move_list
        elif direction == 'left':
            in_borders = (moving_object.x - 1) in range(7, len(self._map[10])-3)
            is_empty = self._map[moving_object.y][moving_object.x -
                                                  1] in possible_move_list
        return in_borders and is_empty

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
    pass
