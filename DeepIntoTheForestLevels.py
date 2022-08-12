#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-06-01 17:38:02
# @Author  : Tom Brandherm
# @Python  : 3.9
# @Link    : link
# @Version : 1.0.1
"""
Short Introduction
"""

# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #
import random
import time
from helper_functions import addToClipBoard, encode_text, get_indices_of_element_in_list, is_input_valid, print_lines
from icons import Icons
from riddle import Riddle

# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #

class Forest_Level_1(Riddle):

    def _print_icon(self):
        print(Icons.level1.value)

    def _print_prolog(self):
        print(f"{self.name} you are in front of a big dark forest and you are super brave, some say THE bravest. So you entering it to find the lost treasure.\n")

    def _print_success_message(self):
        print_lines([' Going into the dark...',
                    " Risking your live...", " GOOD CHOICE!!!"], 1)
        input()

    def _print_fail_message(self):
        print('You fool that was the way out of the forest. You are leaving the forest without the treasure and die in poverty (some decades later, but you die)')

    def _give_necessary_information(self):
        print_lines(['You are finding yourself at a crossroad:', "\tOn the LEFT the thicket clears and you see the sun shining through the trees.",
                    "\tOn the RIGHT the opposite is the case. It seems like the road is vanishing in the darkness of the forest (spoookey)."],
                    2)

    def _calculate_correct_answer(self):
        self.correct_answer: list = ['right', 'r']

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input("What do you want to do? [LEFT, RIGHT] ")
            if is_input_valid(self.answer, ['left', 'right', 'l', 'r']):
                return self.answer.lower() in self.correct_answer

    def _generate_riddle_data(self):
        pass


class Forest_Level_2(Riddle):

    def _print_icon(self):
        print(Icons.level2.value)

    def _print_prolog(self):
        print_lines([f"{self.name} you reached a ledge of {self.riddle_data} meters. There is only one way to get up there ...",
                     "You have to built stairs out of tree trunks.\n"], 2)

    def _print_success_message(self):
        print_lines(
            [f"\nThat was not as easy as expected, cutting down {self.answer} trees. I see (smell) you sweated a little bit, but you made it ...",
             "Let's get up that ledge ..."], 2)
        input()

    def _print_fail_message(self):
        if int(self.answer) > self.correct_answer:
            print("Too much work for one single person. Considered retrospectively the amount of trees you cut down was too high. You die from exhaustion.")
        elif int(self.answer) < self.correct_answer:
            print("You build a stairway out of the trunks, but you calculated too less trees....you are falling from your pile, break you neck and die")
        print_lines(['.' * (i + 1) for i in range(3)], 1)

    def _give_necessary_information(self):
        addToClipBoard(str(self.riddle_data))
        print_lines(["The average tree trunk (O) has a diameter of 50cm. If the goal for the stairs would be to reach a height of 1.5m it would look like that:",
                     """
                        O
                       OO
                      OOO
                     """,
                     "I have mentioned that you have an axe, haven't I? Yes you carry that heavy thing around the whole time, bit strange that you didn't notice it."],
                    2)

    def _calculate_correct_answer(self):
        # gauss summation
        self.correct_answer: int = (self.riddle_data * (self.riddle_data + 1)) / 2

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(
                f"How many trees do you have to cut down to reach the height of {self.riddle_data}m? ")
            print_lines([f'{self.name} cuts down a tree' for _ in range(3)], 1.5)
            if self.answer.isdigit():
                return int(self.answer) == self.correct_answer
            else:
                is_input_valid('', [1]) # return always False

    def _generate_riddle_data(self):
        self.riddle_data: int = random.randint(50, 100)


class Forest_Level_3(Riddle):

    def _print_icon(self):
        print(Icons.level3.value)

    def _print_prolog(self):
        print_lines([f"{self.name} you reached the top ledge and now you can enter a different part of the forest. It already got a bit late and the night falls....damn trunk stairway building",
                     "The stars are bright, maybe they can help to find the right direction ...\n", Icons.stars.value], 3)

    def _print_success_message(self):
        print_lines(['', f"I didn't doubt you for a second ... the north polar star ... way to easy for a good pathfinder like you, {self.name}.\n",
                     "\nYou have a new direction ...",
                     "You are motivated ...",
                     "... BUT ..."], 3)
        input()

    def _print_fail_message(self):
        print_lines(["The ghost of your old pathfinder leader apears out of nowhere ...\n",
                     f"\n\n\t\"{self.name}, I am very disappointed about your lack of basic knowledge\"\n\n"], 3)

    def _give_necessary_information(self):
        addToClipBoard(str(self.riddle_data[1]))
        print_lines(["\nTake a look into the stars to find our next direction, the only thing you know is that you have to head NORTH: ",
              "\nMaybe that helps to find in which of these directions you shoud go ...\n", Icons.coords.value], 3)

    def _calculate_correct_answer(self):
        self.correct_answer: int = self.riddle_data[0]

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(
                "Where is north from your point of view? [FL, FR, BL, BR] ")
            if is_input_valid(self.answer, ['fl', 'fr', 'bl', 'br']):
                return self.answer.lower() == self.correct_answer

    def _generate_riddle_data(self):
        self.riddle_data: tuple = self._create_star_map()

    def _create_star_map(self) -> tuple:
        x_shift = random.randint(-5, 5)
        y_shift = random.randint(-5, 5)
        star_map = [(random.randint(-10, 0), random.randint(-10, 10))
                    for _ in range(random.randint(5, 7))]
        star_map += [(-9 + x_shift, -0.5 + y_shift),
                     (-8 + x_shift, 0 + y_shift),
                     (-7 + x_shift, -0.5 + y_shift),
                     (-6 + x_shift, 2 + y_shift),
                     (-6 + x_shift, 1 + y_shift),
                     (-6 + x_shift, -1 + y_shift),
                     (-6 + x_shift, -3 + y_shift),
                     (-5 + x_shift, 2 + y_shift),
                     (-5 + x_shift, 1 + y_shift),
                     (-4.5 + x_shift, 2.5 + y_shift),
                     (-4 + x_shift, -1 + y_shift),
                     (-4 + x_shift, -3 + y_shift),
                     (-4 + x_shift, 3 + y_shift),
                     (-3.5 + x_shift, 3.5 + y_shift)]

        north_polar_star = star_map[-1]
        star_map += [(random.randint(0, 10), random.randint(-10, 10))
                     for _ in range(random.randint(5, 7))]

        if north_polar_star[0] > 0 and north_polar_star[1] > 0:
            direction = 'fr'
        elif north_polar_star[0] < 0 and north_polar_star[1] > 0:
            direction = 'fl'
        elif north_polar_star[0] < 0 and north_polar_star[1] < 0:
            direction = 'bl'
        else:
            direction = 'br'
        return direction, star_map


class Forest_Level_4(Riddle):

    def _print_icon(self):
        print(Icons.level4.value)

    def _print_prolog(self):
        print_lines(["You should rest a bit, the forest is still a dangerous place ... especially at night.\n",
                     "You could either climb up a tree, even if you are already a 'bit' exhausted and sleep on a big branch or you could find a nice cozy place on the ground...as cozy as sleeping on the ground could be."], 3)

    def _print_success_message(self):
        print_lines(['', f"Damn {self.name}...",
                     "That was a really good decision, you are recovered and top fit to continue!"], 2)
        input()

    def _print_fail_message(self):
        print_lines(['', 'I told you it is dangerous here in the forest and you decided to sleep on the ground ...',
                     'Something or someone (it is really dark, as I mentioned) is attacking you while you are sleeping ...\n'], 3)

    def _give_necessary_information(self):
        pass

    def _calculate_correct_answer(self):
        self.correct_answer: list = ['tree', 't']

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input("Where dou you want to sleep? [TREE, GROUND] ")
            if is_input_valid(self.answer, ['tree', 't', 'ground', 'g']):
                print("you fall asleep...")
                print_lines(['\t' + i*' ' + 'z' for i in range(4)] + ['\t' + 4*' ' + 'Z'], 0.5)
                return self.answer.lower() in self.correct_answer

    def _generate_riddle_data(self):
        pass


class Forest_Level_5(Riddle):

    def _print_icon(self):
        print(Icons.level5.value)

    def _print_prolog(self):
        print_lines([f"{self.name} you are up in the tree.",
                     "The sun is rising and you recognize how high you climbed up yesterday.",
                     "Let's see how you manage to get down from that monster of a tree.",
                     "You stepped on the first branch below you and .... CRRRRrrrrrRRRRRrrrrrrRAaaaCcK",
                     "The branch broke and fell to the ground, luckily you were able to grab the tree and didn't fall. (otherwise the level would be quite short :-D)",
                     f"\t {self.name} take a deep breath and start to use your brain!!!",
                     "You are recognizing some branches have cracks and you are rating them with the following system (and yes, you have paper and pencil, who yould go on such an adventure without it): "], 2)

    def _print_success_message(self):
        print_lines(
            ['', f"It seems today is your lucky day, with a survival propability of {(self.correct_answer[0]*100):.2f}% you made it to the \"save\" ground."], 2)
        input()

    def _print_fail_message(self):
        print_lines(['', "CRRRRrrrrrRRRRRrrrrrrRiiiiiiCcK",
                     "CcccccccrRRrrrrrruuufUUUUUCcK", "CcccccccccRRRRRrrrrrroOoOoOoOCcK",
                     f"{self.name} the path you've choosen was too dangerous and you fell to the ground .... you know what that means ..."], 1)

    def _give_necessary_information(self):
        addToClipBoard(str(self.riddle_data))
        print_lines(
            ["\n\t[0] no risk to die",
             "\t[1] one crack = 10% risk to die",
             "\t[2] two cracks = 20% risk to die",
             "\t.\n\t.\n\t.",
             "\t[10] the branch would not carry a butterfly = 100% risk to die\n",
             "From your position you are able to find a view possible paths, that can be described like that: "],
            1)
        for i, path in enumerate(self.riddle_data):
            print(f"\t[{i+1}] \t: {path}")

    def _calculate_correct_answer(self) -> tuple:
        propabilities: list = [0]
        best_choice_propability: float = 0
        for path in self.riddle_data:
            p: float = self._calculate_probability_of_survival(path)
            best_choice_propability = max(p, best_choice_propability)
            propabilities.append(p)
        self.correct_answer: tuple = (best_choice_propability,
                                      get_indices_of_element_in_list(
                                        propabilities,
                                        best_choice_propability))

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(
                "Which of these paths is the savest? [multiple correct answers possible, but one is enough] ")
            if self.answer.isdigit():
                print_lines([f"{self.name} climbs down the tree" for _ in range(3)], 0.5)
                return int(self.answer) in self.correct_answer[1]
            else:
                is_input_valid('', [1])  # return always False

    def _generate_riddle_data(self):
        self.riddle_data: list = self._create_path_array()

    def _create_path_array(self) -> list:
        while 1:
            paths = []
            for _ in range(20):
                paths.append([random.randint(0, 10)
                             for _ in range(random.randint(2, 5))])
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


class Forest_Level_6(Riddle):

    def _print_icon(self):
        print(Icons.level6.value)

    def _print_prolog(self):
        print_lines(["That was kind of fun, wasn't it!?", "NOOOO!!! you almost died and you are still in danger in that godforsaken forest ... what is FUNNY about that?",
                     "Let's continue, the treasure must be close ... hopefully.", "The forest is really dense again and almost all the light is absorbed by the treetops.",
                     "No sounds of birds or other animals, not even mosquitos. (but let's not be sad about that)", f"But you can feel that something is watching you, {self.name}.",
                     "The trees are like giant pillars of shadows and you get more and more the feeling you should leave that place as soon as possible.\n", 'You should have listened to your gut feeling.', 'Narsty furry creatures have surrounded you.', '\ttheir teeth are sharp ...', '\ttheir claws are even sharper\n\n',
                     Icons.monster.value, 'RUUUUUUUUuuuuhuuuunN ...\n', '...\n'], 3)

    def _print_success_message(self):
        print_lines(
            ["Perfect move ... it is official, you are smarter than these beasts (you probably have noticed, almost none of them went to school)",
             "It seems like you have shaken them off ...",
             "Wait, another one is attacking you from from a tree\n", f"{self.name} does a perfect roll (every gymnast would be proud!)", f"{self.name} you should continue as fast as you can ...",
             "It looks like there is a light at the end of the road (tunnel) ..."], 3)
        input()

    def _print_fail_message(self):
        print_lines(
            ["Why did you even try to find the pattern, when you are not smart enough to forcast the next move?", "WHY????", "The monsters are tearing you into pieces ..."], 3)

    def _give_necessary_information(self):
        addToClipBoard(str(self.riddle_data[1]))
        print_lines(
            ['You are faster than these \"vampire wookies\" but more and more are following you.',
             '\tWhen they try to attack you from the left [L] -> you are jumping to the right [r]',
             '\tWhen they try to attack you from the right [R] -> you are jumping to the left [l]',
             '\tWhen they try to attack by jumping out of the trees [T] -> you are doing a forward roll [f]',
             '\tWhen they try to attack from the front [F] -> you are kicking them directly into their ugly face [k]\n',
             "After succesfully dodging the first attacks you are recognizing a pattern: \n", self.riddle_data[1]], 2)

    def _calculate_correct_answer(self) -> tuple:
        self.correct_answer: str = self.riddle_data[0]

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input("What will be your next move? [r, l, f, k] ")
            if is_input_valid(self.answer, ['r', 'l', 'f', 'k']):
                time.sleep(3)
                if self.answer == 'r':
                    print(f"{self.name} jumps to the right")
                elif self.answer == 'f':
                    print(f"{self.name} does a perfect roll (every gymnast would be proud!)")
                elif self.answer == 'l':
                    print(f"{self.name} jumps to the left")
                elif self.answer == 'k':
                    print(f"{self.name} kicks to the front")
                return self.answer == self.correct_answer

    def _generate_riddle_data(self):
        self.riddle_data: list = self._create_attack_pattern()

    def _create_attack_pattern(self) -> tuple:
        pattern_list = [
            # left left something left left something right right something right right ...
            ('r', ['L', 'L', 'R', 'L', 'L', 'T', 'R',
             'R', 'F', 'R', 'R', 'L', 'L', 'L']),
            # pattern starts new after the FF
            ('k', ['T', 'T', 'F', 'F', 'L', 'L', 'R', 'R', 'L', 'L',
             'F', 'F', 'T', 'T']),
            # each letter has a specific amount of occurence
            ('r', ['R', 'T', 'T', 'L', 'L', 'L', 'F', 'F', 'R', 'F', 'F', 'L', 'L'])]
        return random.choice(pattern_list)


class Forest_Level_7(Riddle):

    def _print_icon(self):
        print(Icons.level7.value)

    def _print_prolog(self):
        print_lines(
            ["After a perceived infinity prisoned here you are entering the first forest clearing since you entered.", "Even this place of light feels not really save. More eyes are staring at you out of the surrounding darkness.", f"{self.name} in the middle of this clearing you are finding a slab of stone with the following inscriptions."], 3)

    def _print_success_message(self):
        print_lines(
            [f"A bright light occured", Icons.firework.value], 2)
        input()

    def _print_fail_message(self):
        print_lines(
            ['', "At least you cast a spell, but it is not the right spell. Nothing is happening ... ", "really nothing?", "So that means you could try it once again, right?!", "Would be nice, but the FOREST is not nice ... the creatures are flocking out of the thicket and attacking you with their claws\n"], 4)

    def _give_necessary_information(self):
        addToClipBoard(str(self.riddle_data))
        print("\n" + "=" * (len(self.riddle_data) + 8))
        print("||  " + self.riddle_data + "  ||")
        print("=" * (len(self.riddle_data) + 8) + '\n')

    def _calculate_correct_answer(self) -> tuple:
        self.correct_answer: int = 550 - 37 * 4 + 18

    def _ask_for_answer_and_compare(self) -> bool:
        while 1:
            self.answer = input(f"{self.name} have you any idea that that means? ")
            print("\n\t\t☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ*･｡ﾟ☆ﾟ.*･｡ﾟ")
            print("☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ")
            print("☆ﾟ.*･｡.*･｡･｡☆｡｡☆  YOU CAST THE SPELL!   ･｡ﾟ☆ﾟ.･｡ﾟ☆ﾟ☆ﾟ.*･｡ﾟ")
            print("☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ")
            print("\t\t☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ☆ﾟ.*･｡ﾟ\n")
            return self.answer == str(420)

    def _generate_riddle_data(self):
        plaintext = "fünfhundertfünfzig minus siebenunddreissig mal vier plus achtzehn"
        self.riddle_data: str = encode_text(plaintext, self.name)


class Forest_Level_8(Forest_Level_1):
    def _print_icon(self):
        pass

    def _print_prolog(self):
        pass

    def _print_success_message(self):
        print_lines(
            ['', f'{self.name} you made it ... really ... you have escaped the forest', "WAIT, what about the promised treasure????\n", Icons.question_mark.value, "You holding something into your hand: \n"], 3)
        input("[Press a key to take a look]")
        print_lines([Icons.certificate.value, f"\t{self.name} you have shown great courage and wisdome and that shouldn't go unrewarded:\n\n",
                     "\t\tChoose two brave companions of your choice (e.g. Vicky and Tom) and take your family into the next adventure.",
                     "\t\tThe next forest \"WALDHOCHSEILGARTEN JUNGFERNHEIDE\" is waiting for you ...\n\n",
                     "\tPlease send a screenshot of this out into the world to start the preparation.\n\n"], 4)
        addToClipBoard(
            f"{self.name} conqueror of the forest! Team Awesome is proud of you")
        input("[Press a key to exit the game]")

    def _print_fail_message(self):
        print_lines([' Going into the dark...',
                    " Risking your live ... AGAIN ...", " GOOD CHOICE!!!"], 1)

    def _calculate_correct_answer(self):
        self.correct_answer: list = ['left', 'l']


# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #

if __name__ == '__main__':
    pass


