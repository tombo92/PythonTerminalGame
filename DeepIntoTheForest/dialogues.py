#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2022-08-15 09:14:56
# @Author  : Tom Brandherm
# @Python  : 3.10
# @Link    : https://github.com/tombo92
# @Version : 1.0.0
"""
Dialog Enum Classes
- a '###' will be replaced with a new line and a short pause
"""

# =========================================================================== #
#  SECTION: Imports
# =========================================================================== #
from strenum import StrEnum
# =========================================================================== #
#  SECTION: Global definitions
# =========================================================================== #

# =========================================================================== #
#  SECTION: Class definitions
# =========================================================================== #


class Prolog(StrEnum):
    """
    Prolog dialogues
    """
    LEVEL_1 = "you are in front of a big dark forest and you are super brave," + \
        " some say THE bravest. So you entering it to find the lost treasure."

    LEVEL_2_A = "you reached a ledge of"
    LEVEL_2_B = "meters. There is only one way to get up there …"
    LEVEL_2_C = "You have to built stairs out of tree trunks.\n"

    LEVEL_3_A = "you reached the top ledge and now you can enter a different" + \
        " part of the forest. It already got a bit late and the night falls " + \
        "... damn trunk stairway building"
    LEVEL_3_B = "The stars are bright, maybe they can help to find the right direction ...\n"

    LEVEL_4 = "You should rest a bit, the forest is still a dangerous place" + \
        " ... especially at night.\n ###You could either climb up a tree, " + \
        "even if you are already a 'bit' exhausted and sleep on a big branch " + \
        "or you could find a nice cozy place on the ground...as cozy as" + \
        "sleeping on the ground could be."

    LEVEL_5_A = "you are up in the tree."
    LEVEL_5_B = "The sun is rising and you recognize how high you climbed " + \
        "up yesterday.###Let's see how you manage to get down from that " + \
        "monster of a tree.### ###You stepped on the first branch below you and" + \
        "###\n... CRRRRrrrrrRRRRRrrrrrrRAaaaCcK\n###The branch broke and fell to " + \
        "the ground, luckily you were able to grab the tree and didn't fall." + \
        "(otherwise the level would be quite short :-D)"
    LEVEL_5_C = "take a deep breath and start to use your brain!!!"
    LEVEL_5_D = "You are recognizing some branches have cracks and you are " + \
        "rating them with the following system (and yes, you have paper and " + \
        "pencil, who yould go on such an adventure without it): "

    LEVEL_6_A = "That was kind of fun, wasn't it!?###NOOOO!!! you almost died " + \
        "and you are still in danger in that godforsaken forest ... what is " + \
        "FUNNY about that?###Let's continue, the treasure must be close ... " + \
        "hopefully.###The forest is really dense again and almost all the light " + \
        "is absorbed by the treetops.###No sounds of birds or other animals, " + \
        "not even mosquitos. (but let's not be sad about that)"
    LEVEL_6_B = "But you can feel that something is watching you,"
    LEVEL_6_C = "The trees are like giant pillars of shadows and you get more " + \
        "and more the feeling you should leave that place as soon as possible." + \
        "\n###You should have listened to your gut feeling.###Narsty furry " + \
        "creatures have surrounded you.###\ttheir teeth are sharp ...###" + \
        "\ttheir claws are even sharper\n\n"
    LEVEL_6_D = "RUUUUUUUUuuuuhuuuunN ...\n###...\n"

    LEVEL_7_A = "After a perceived infinity prisoned here you are entering " + \
        "the first forest clearing since you entered.###Even this place of " + \
        "light feels not really save. More eyes are staring at you out of " + \
        "the surrounding darkness."
    LEVEL_7_B = "in the middle of this clearing you are finding a slab of " + \
        "stone with the following inscriptions."


class Success(StrEnum):
    """
    Success dialogues
    """
    LEVEL_1 = " Going into the dark …### Risking your life …### GOOD CHOICE!!!###"

    LEVEL_2_A = "\nThat was not as easy as expected, cutting down"
    LEVEL_2_B = "trees.  I see (smell) you sweated a little bit, but you made it ..."
    LEVEL_2_C = "Let's get up that ledge …"

    LEVEL_3 = " ###I didn't doubt you for a second ... the north polar star " + \
        "... way to easy for a good pathfinder like you.\n###\nYou have a new " + \
        "direction …###You are motivated …###\n… BUT …###"

    LEVEL_4_A = "Damn"
    LEVEL_4_B = "..."
    LEVEL_4_C = "That was a really good decision, you are recovered and top fit to continue!"

    LEVEL_5_A = "It seems today is your lucky day, with a survival propability of"
    LEVEL_5_B = "you made it to the 'save' ground."

    LEVEL_6_A = "Perfect move ... it is official, you are smarter than these " + \
        "beasts (you probably have noticed, almost none of them went to school)###" + \
        "It seems like you have shaken them off ...###Wait, another one is " + \
        "attacking you from from a tree\n"
    LEVEL_6_B = "does a perfect roll (every gymnast would be proud!)"
    LEVEL_6_C = "you should continue as fast as you can ..."
    LEVEL_6_D = "It looks like there is a light at the end of the road (tunnel) ..."

    LEVEL_7 = "A bright light occured"

    LEVEL_8_A = "you made it ... really ... you have escaped the forest"
    LEVEL_8_B = "WAIT, what about the promised treasure????\n"
    LEVEL_8_C = "You holding something into your hand: \n"
    LEVEL_8_D = "you have shown great courage and wisdome and that shouldn't go unrewarded:\n\n"
    LEVEL_8_E = "\t\tChoose two brave companions of your choice (e.g. Vicky " + \
        "and Tom) and take your family into the next adventure.###" + \
        "\t\tThe next forest \"WALDHOCHSEILGARTEN JUNGFERNHEIDE\" is " + \
        "waiting for you ...\n\n###\tPlease send a screenshot of this out " + \
        "into the world to start the preparation.\n\n"
    LEVEL_8_F = "conqueror of the forest! Team Awesome is proud of you"


class Failure(StrEnum):
    """
    Failure dialogues
    """
    LEVEL_1 = "You fool that was the way out of the forest. You are leaving " + \
        "without the treasure and die in poverty(some decades later, but you die)"

    LEVEL_2_A = "\nToo much work for one single person. Considered retrospectively " + \
        "the amount of trees you cut down was too high. You die from exhaustion."
    LEVEL_2_B = "\nYou build a stairway out of the trunks, but you calculated too " + \
        "less trees ... you are falling from your pile, break you neck and die."

    LEVEL_3_A = "The ghost of your old pathfinder leader apears out of nowhere ...\n"
    LEVEL_3_B = "\n\n\t\""
    LEVEL_3_C = ", I am very disappointed about your lack of basic knowledge\".\n\n"

    LEVEL_4 = "I told you it is dangerous here in the forest and you decided " + \
        "to sleep on the ground …###Something or someone (it is really dark, as I " + \
        "mentioned) is attacking you while you are sleeping ...\n"

    LEVEL_5_A = " ###CRRRRrrrrrRRRRRrrrrrrRiiiiiiCcK###CcccccccrRRrrrrrruuufUUUUUCcK" + \
        "###CcccccccccRRRRRrrrrrroOoOoOoOCcK"
    LEVEL_5_B = "the path you've choosen was too dangerous and you fell to the ground " + \
        " you know what that means ..."

    LEVEL_6 = "Why did you even try to find the pattern, when you are not smart " + \
        "enough to forcast the next move?###WHY????###The monsters are tearing you into pieces ...### "

    LEVEL_7 = " ###At least you cast a spell, but it is not the right spell. Nothing is happening ... " + \
        "###\n\treally nothing?\n###So that means you could try it once again, right?!### " + \
        "###Would be nice, but the FOREST is not nice ... the creatures are flocking " + \
        "out of the thicket and attacking you with their claws### "


class Info(StrEnum):
    """
    Information dialogues
    """
    LEVEL_1 = "You are finding yourself at a crossroad:###\n\tOn the LEFT the " + \
        "thicket clears and you see the sun shining through the trees.###" + \
        "\tOn the Right the opposite is the case. It seems like the road is " + \
        "vanishing in the darkness of the forest (spoooky).\n"

    LEVEL_2 = "The average tree trunk(O) has a diameter of 50cm. If the " + \
        "goal for the stairs would be to reach a height of 1.5m it would " + \
        "look like that:###" + \
        """\n
                        O
                       OO
                      OOO\n
        """ + "###I have mentioned that you have an axe, haven't I? Yes you " + \
        "carry that heavy thing around the whole time, bit strange that you didn't notice it."

    LEVEL_3 = "\nTake a look into the stars to find our next direction, " + \
        "the only thing you know is that you have to head NORTH:###\nMaybe " + \
        "that helps to find in which of these directions you shoud go ...\n"

    LEVEL_5 = "\n\t[0] no risk to die###\t[1] one crack = 10% risk to die###" + \
        "\t[2] two cracks = 20% risk to die###\t.\n\t.\n\t.###\t[10] the " + \
        "branch would not carry a butterfly = 100% risk to die\n###" + \
        "From your position you are able to find a view possible paths, " + \
        "that can be described like that: "

    LEVEL_6 = "You are faster than these \"vampire wookies\" but more " + \
        "and more are following you.###\tWhen they try to attack you from " + \
        "the left [L] -> you are jumping to the right [r]###" + \
        "\tWhen they try to attack you from the right [R] -> you are " + \
        "jumping to the left [l]###\tWhen they try to attack by jumping " + \
        "out of the trees [T] -> you are doing a forward roll [f]###" + \
        "\tWhen they try to attack from the front [F] -> you are kicking " + \
        "them directly into their ugly face [k]\n###After succesfully " + \
        "dodging the first attacks you are recognizing a pattern: \n"


class Question(StrEnum):
    """
    Question dialogues
    """
    LEVEL_1 = "What do you want to do? [LEFT, RIGHT] "

    LEVEL_2 = "How many trees do you have to cut down to reach the height of"

    LEVEL_3 = "Where is north from your point of view? [FL, FR, BL, BR] "

    LEVEL_4 = "Where dou you want to sleep? [TREE, GROUND] "

    LEVEL_5 = "Which of these paths is the savest? [multiple correct " + \
        "answers possible, but one is enough] "

    LEVEL_6 = "What will be your next move? [r, l, f, k] "

    LEVEL_7 = "have you any idea that that means? "


if __name__ == '__main__':
    pass
