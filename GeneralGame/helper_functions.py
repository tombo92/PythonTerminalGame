#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-06-01 18:04:49
# @Author  : Tom Brandherm
# @Python  : 3.10
# @Link    : https://github.com/tombo92
# @Version : 1.1.0
"""
helper functions
"""

# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #
import os
import random
import string
import time
from colorama import Style


# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #
# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #

def is_input_valid(answer: str, options: list) -> bool:
    if answer.lower() in options:
        return True
    print("Please concentrate my friend and give a valid answer ... what do you want to do?")
    return False


def print_lines(lines: list, delay: int = 0):
    for line in lines:
        print(line)
        time.sleep(delay)


def addToClipBoard(text):
    command = 'echo | set /p nul=' + text.strip() + '| clip'
    os.system(command)


def get_indices_of_element_in_list(alist: list, value_to_check) -> list[int]:
    indices = []
    for i, value in enumerate(alist):
        if value == value_to_check:
            indices.append(i)
    return indices


def clear_terminal():
    os.system('cls' if os.name == 'nt' else 'clear')


def caesar(plaintext: str, shift: int) -> str:
    alphabet = string.ascii_lowercase
    shifted_alphabet = alphabet[shift:] + alphabet[:shift]
    table = str.maketrans(alphabet, shifted_alphabet)
    return plaintext.translate(table)


def encode_text(plaintext: str, key: str) -> str:
    cipher = ''
    for i, letter in enumerate(plaintext.replace(' ', '')):
        if i % 4 == 0:
            cipher += ' '
        cipher += caesar(letter,
                         string.ascii_lowercase.index(key.lower()[i % len(key)]))
    return cipher


def split_dialog(dialog: str) -> list[str]:
    return dialog.split('###')


def replace_character(new_char: str, old_string: str, pos: int) -> str:
    old_string_list: list = list(old_string)
    old_string_list[pos] = new_char
    return "".join(old_string_list)


def rainbow_str(uncolored_str: str) -> str:
    """
    give each letter of a string a different random color

    Parameters
    ----------
    uncolored_str : str
         a uncolred string

    Returns
    -------
    str
        colored string
    """
    colors = [f'\033[3{i}m' for i in range(
        1, 8)] + [f'\033[9{i}m' for i in range(0, 7)] + ['']
    color_str: str = ''
    for letter in uncolored_str:
        color_str += random.choice(colors) + f"{letter}{Style.RESET_ALL}"
    return color_str


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #

if __name__ == '__main__':
    pass
