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
import string
import time
import random
from icons import Icons

# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #
VERSION = "1.0.0"
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

    def cut_down_tree(self):
        print(f"{self.name} cuts down a tree")

    def climb_down(self):
        print(f"{self.name} climbs down the tree")

    def jump_left(self):
        print(f"{self.name} jumps to the left")

    def jump_right(self):
        print(f"{self.name} jumps to the right")

    def roll(self):
        print(f"{self.name} does a perfect roll (every gymnast would be proud!)")

    def kick(self):
        print(f"{self.name} kicks to the front")

    def reincarnate(self):
        print(f"{self.name} you came back from the dead")
        self._is_alive = True

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Private Methods
    # ----------------------------------------------------------------------- #
class Game:
    """
        game class
    """

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
                        if answer.lower() in ['yes', 'y']:
                            self.level = 1
                            break
                        self._kill_player_and_ask_for_restart()
                        break
            elif self.level == 1 or self.level == 7:
                if self.level == 1:
                    print(Icons.level1.value)
                    time.sleep(1)
                    print(f"{self.player.name} you are in front of a big dark forest and you are super brave, some say THE bravest. So you entering it to find the lost treasure.")
                    time.sleep(1)
                    input()
                print('You finding yourself at a crossroads:\n On the LEFT the thicket clears and you see the sun shining through the trees.\n On the RIGHT the opposite is the case. It seems like the road is vanishing in the darkness of the forest (spoookey).')
                while 1:
                    answer = input("What do you want to do? [LEFT, RIGHT] ")
                    if is_input_valid(answer, ['left', 'right', 'l', 'r']):
                        if answer.lower() in ['left', 'l'] and self.level == 1:
                            time.sleep(1)
                            print('You fool that was the way out of the forest. You are leaving the forest without the treasure and die in poverty (some decades later, but you die)')
                            self._kill_player_and_ask_for_restart()
                            break
                        elif answer.lower() in ['left', 'l'] and self.level == 7:
                            time.sleep(2)
                            print(f'{self.player.name} you made it ... really ... you have escaped the forest')
                            time.sleep(4)
                            print("WAIT, what about the promised treasure????\n")
                            time.sleep(2)
                            print(Icons.question_mark.value)
                            time.sleep(4)
                            print("You holding something into your hand: \n")
                            input("[Press a key to take a look]")
                            clear_terminal()
                            print(Icons.certificate.value)
                            time.sleep(3)
                            print_lines(
                                [f"\t{self.player.name} you have shown great courage and wisdome and that shouldn't go unrewarded:\n\n",
                                 "\t\tChoose two brave companions of your choice (e.g. Vicky and Tom) and take your family into the next adventure.",
                                 "\t\tThe next forest \"WALDHOCHSEILGARTEN JUNGFERNHEIDE\" is waiting for you ...\n\n",
                                 "\tPlease send a screenshot of this out into the world to start the preparation.\n\n"], 4)
                            addToClipBoard(f"{self.player.name} conqueror of the forest! Team Awesome is proud of you")
                            input("[Press a key to exit the game]")
                            return
                        elif answer.lower() in ['right', 'r']:
                            if self.level == 7:
                                print_lines(['going into the dark...', "risking your live ... AGAIN ...", "GOOD CHOICE!!!"], 1)
                            else:
                                print_lines(['going into the dark...', "risking your live...", "GOOD CHOICE!!!"], 1)
                            input()
                            self.level = 2
                            break
            elif self.level == 2:
                print(Icons.level2.value)
                time.sleep(1)
                height = random.randint(50, 100)
                addToClipBoard(str(height))
                print(f"{self.player.name} you reached a ledge of {height} meters. There is only one way to get up there ...")
                time.sleep(1)
                print("You have to built stairs out of tree trunks.")
                input()
                print("The average tree trunk (O) has a diameter of 50cm. If the goal for the stairs would be to reach a height of 1.5m it would look like that:")
                print("""
                       O
                      OO
                     OOO
                """)
                input()
                print("I have mentioned that you have an axe, haven't I? Yes you carry that heavy thing around the whole time, bit strange that you didn't notice it.")
                correct_answer = sum([i for i in range(height*2 + 1)])
                #print(correct_answer)
                while 1:
                    answer = input(f"How many trees do you have to cut down to reach the height of {height}m? ")
                    if answer.isdigit():
                        for _ in range(3):
                            self.player.cut_down_tree()
                            time.sleep(0.5)
                        if int(answer) == correct_answer:
                            self.level = 3
                            print(f"That was not as easy as expected, cutting down {answer} trees. I see (smell) you sweated a little bit, but you made it....")
                            time.sleep(0.5)
                            print("Let's get up that ledge...")
                            input()
                            break
                        for _ in range(3):
                            print('.')
                            time.sleep(0.5)
                        if int(answer) > correct_answer:
                            print(
                                "Too much work for one single person. Considered retrospectively the amount of trees you cut down was too high. You die from exhaustion.")
                            self._kill_player_and_ask_for_restart()
                        elif int(answer) < correct_answer:
                            print(f"You build a stairway out of the trunks, but you calculated too less trees....you are falling from your pile, break you neck and die")
                            self._kill_player_and_ask_for_restart()
                        break
            elif self.level == 3:
                print(Icons.level3.value)
                time.sleep(0.5)
                print(f"{self.player.name} you reached the top ledge and now you can enter a different part of the forest. It already got a bit late and the night falls....damn trunk stairway building")
                input()
                print("You should rest a bit, but the forest is still a dangerous place.")
                input()
                print("You could either climb up a tree, even if you are already a 'bit' exhausted and sleep on a big branch or you could find a nice cozy place on the ground...as cozy as sleeping on the ground could be.")
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
                            print('I told you it is dangerous here in the forest and you decided to sleep on the ground ...')
                            time.sleep(2)
                            print('Something or someone (it is really dark, as I mentioned) is attacking you while you are sleeping ...\n')
                            self._kill_player_and_ask_for_restart()
                        elif answer.lower() in ['tree', 't']:
                            print(f"damn {self.player.name}...")
                            time.sleep(2)
                            print("that was a really good decision, you are recovered and top fit to continue")
                            input()
                            self.level = 4
                        break
            elif self.level == 4:
                print(Icons.level4.value)
                print_lines([f"{self.player.name} you are up in the tree.",
                             "The sun is rising and you recognize how high you climbed up yesterday.",
                             "Let's see how you manage to get down from that monster of a tree.",
                             "You stepped on the first branch below you and .... CRRRRrrrrrRRRRRrrrrrrRAaaaCcK",
                             "The branch broke and fell to the ground, luckily you were able to grab the tree and didn't fall. (otherwise the level would be quite short :-D)",
                             f"\t {self.player.name} take a deep breath and start to use your brain!!!",
                             "You are recognizing some branches have cracks and you are rating them with the following system (and yes, you have paper and pencil, who yould go on such an adventure without it): "], 2)
                print_lines(
                    ["\n\t[0] no risk to die", "\t[1] one crack = 10% risk to die", "\t[2] two cracks = 20% risk to die", "\t.\n\t.\n\t.", "\t[10] the branch would not carry a butterfly = 100% risk to die"], 1)
                input()
                print("From your position you are able to find a view possible paths, that can be described like that: ")
                best_choice_indices: list = []
                best_choice_propability: float = 1
                paths = self._create_path_array()
                addToClipBoard(str(paths))
                for i, path in enumerate(paths):
                    print(f"\t[{i+1}] \t: {path}")
                    p = self._calculate_probability_of_survival(path)
                    if 0 < p <= best_choice_propability:
                        best_choice_propability = p
                        best_choice_indices.append(i)
                #print(best_choice_indices)
                while 1:
                    answer = input(
                        f"Which of these paths is the savest? [multiple correct answers possible, but one is enough] ")
                    if answer.isdigit():
                        for _ in range(3):
                            self.player.climb_down()
                            time.sleep(0.5)
                        if int(answer) in best_choice_indices:
                            self.level = 5
                            time.sleep(2)
                            print(
                                f"It seems today is your lucky day, with a survival propability of {(best_choice_propability*10):.2f}% you made it to the \"save\" ground.")
                            input()
                        else:
                            time.sleep(2)
                            print("CRRRRrrrrrRRRRRrrrrrrRiiiiiiCcK")
                            time.sleep(0.5)
                            print("CcccccccrRRrrrrrruuufUUUUUCcK")
                            time.sleep(0.5)
                            print(
                                "CcccccccccRRRRRrrrrrroOoOoOoOCcK")
                            time.sleep(1)
                            print(f"{self.player.name} the path you've choosen was too dangerous and you fell to the ground .... you know what that means ...")
                            self._kill_player_and_ask_for_restart()
                    break
            elif self.level == 5:
                print(Icons.level5.value)
                time.sleep(1)
                print_lines(["That was kind of fun, wasn't it!?", "NOOOO!!! you almost died and you are still in danger in that godforsaken forest ... what is FUNNY about that?",
                             "Let's continue, the treasure must be close ... hopefully.", "The forest is really dense again and almost all the light is absorbed by the treetops.",
                             "No sounds of birds or other animals, not even mosquitos. (but let's not be sad about that)", f"But you can feel that something is watching you, {self.player.name}.",
                             "The trees are like giant pillars of shadows and you get more and more the feeling you should leave that place as soon as possible.\n"], 4)
                time.sleep(2)
                print_lines(['You should have listened to your gut feeling.', 'Narsty furry creatures have surrounded you.', '\ttheir teeth are sharp ...', '\ttheir claws are even sharper\n\n',
                             Icons.monster.value, 'RUUUUUUUUuuuuhuuuunN ...', '...'], 3)
                input()
                print_lines(['You are faster than these \"vampire wookies\" but more and more are following you.',
                            '\tWhen they try to attack you from the left [L] -> you are jumping to the right [r]',
                            '\tWhen they try to attack you from the right [R] -> you are jumping to the left [l]',
                            '\tWhen they try to attack by jumping out of the trees [T] -> you are doing a forward roll [f]',
                            '\tWhen they try to attack from the front [F] -> you are kicking them directly into their ugly face [k]'])
                print("After succesfully dodging the first attacks you recognizing a pattern: ")
                perfect_move, attack_pattern = self._create_attack_pattern(1)
                print(attack_pattern)
                addToClipBoard(str(attack_pattern))
                while 1:
                    answer = input(f"What will be your next move? [r, l, f, k] ")
                    if is_input_valid(answer, ['r', 'l', 'f', 'k']):
                        time.sleep(3)
                        if answer == 'r':
                            self.player.jump_right()
                        elif answer == 'f':
                            self.player.roll()
                        elif answer == 'l':
                            self.player.jump_left()
                        elif answer == 'k':
                            self.player.kick()
                        if answer == perfect_move:
                            time.sleep(3)
                            print("Perfect move ... it is official, you are smarter than these beasts (you probaply have noticed, almost none of them went to school)")
                        else:
                            time.sleep(3)
                            print("Why did you even try to find the pattern, when you are not smart enough to forcast the next move?")
                            time.sleep(3)
                            print("WHY????")
                            time.sleep(3)
                            print("The monsters are tearing you into pieces ...")
                            time.sleep(3)
                            self._kill_player_and_ask_for_restart()
                        break
                clear_terminal()
                print('Yeah')
                input()


            elif self.level == 6:
                print(Icons.level6.value)
                time.sleep(1)
                print("After a perceived infinity prisoned here you are entering the first forest clearing since you entered.")
                time.sleep(3)
                print("Even this place of light feels not really save. More eyes are staring at you out of the surrounding darkness.")
                time.sleep(3)
                print(f"{self.player.name} in the middle of this clearing you are finding a slab of stone with the following inscriptions.")
                time.sleep(2)
                plaintext = "fünfhundertfünfzig minus siebenunddreissig mal vier plus achtzehn"
                cipher = encode_text(plaintext, self.player.name)
                addToClipBoard(cipher)
                correct_answer = 550 - 37 * 4 + 18
                print("\n" + "=" * (len(cipher) + 8))
                print("||  " + cipher + "  ||")
                print("=" * (len(cipher) + 8) + '\n')
                answer = input(f"{self.player.name} have you any idea that that means? ")
                print("\n\t\t☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ*･｡ﾟ☆ﾟ.*･｡ﾟ")
                print("☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ")
                print("☆ﾟ.*･｡.*･｡･｡☆｡｡☆  YOU CAST THE SPELL!   ･｡ﾟ☆ﾟ.･｡ﾟ☆ﾟ☆ﾟ.*･｡ﾟ")
                print("☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ")
                print("\t\t☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ\n")
                if answer == '420':
                    self.level = 6
                    time.sleep(2)
                    print(f"A bright light occured")
                    time.sleep(2)
                    print(Icons.firework.value)
                    input()
                else:
                    time.sleep(2)
                    print("At least you cast a spell, but it is not the right spell. Nothing is happening ... ")
                    time.sleep(4)
                    print("really nothing?")
                    time.sleep(4)
                    print("So that means you could try it once again, right?!")
                    time.sleep(4)
                    print("Would be nice, but the FOREST is not nice ... the creatures are flocking out of the thicket and attacking you with their claws\n")
                    self._kill_player_and_ask_for_restart()

    # ----------------------------------------------------------------------- #
    #  SUBSECTION: Private Methods
    # ----------------------------------------------------------------------- #
    def _create_new_player(self) -> Player:
        while 1:
            name = input("Who is playing this game?: ")
            if not name.isalpha() or len(name) < 3:
                print("Your name should at minimum constists of three LETTERS.")
                continue
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

    def _create_path_array(self) -> list:
        while 1:
            paths = []
            for _ in range(20):
                paths.append([random.randint(0, 10) for _ in range(random.randint(2, 8))])
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

    def _create_attack_pattern(self, number:int) -> tuple:
        pattern_list_1 = [('l', ['L', 'L', 'R', 'L', 'L', 'T', 'R', 'R', 'F', 'R', 'R', 'L', 'L', 'L']),
                          ('k', ['T', 'T', 'F', 'F', 'L', 'L', 'R','R', 'L', 'L', 'F', 'F', 'T', 'T']),
                          ('r', ['R', 'T', 'T', 'L', 'L', 'L', 'F', 'F', 'L', 'L'])]
        if number == 1:
            return random.choice(pattern_list_1)



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


def addToClipBoard(text):
    command = 'echo | set /p nul=' + text.strip() + '| clip'
    os.system(command)


def main():
    game = Game(level=5)
    game.start()
    print("bye bye bye, bye bye (in a backsstreet boys way...)")


# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #
if __name__ == '__main__':
    print(f"DeepIntoTheForestGame | VERSION: {VERSION}")
    print(Icons.level0.value)

    main()



