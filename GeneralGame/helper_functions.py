#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-06-01 18:04:49
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
import os
import string
import time


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
        print(line.replace('\\n', '\n').replace('\\t', '\t'))
        time.sleep(delay)


def addToClipBoard(text):
    command = 'echo | set /p nul=' + text.strip() + '| clip'
    os.system(command)


def get_indices_of_element_in_list(alist: list, value_to_check) -> list:
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


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #

if __name__ == '__main__':
    pass


