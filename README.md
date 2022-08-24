# PythonTerminalGamme

## Introduction

This program is a mixture out of a general and specific terminal games. The game is designed that the user can win multiple puzzle levels to win the whole game. Every game should follow the same structure with a different storyline. Every level consists of:

* Prolog &rarr; introduction into the level
* Puzzle Intro &rarr; introduction into the puzzle with all necessary information
* Puzzle &rarr; puzzle to solve
* Success &rarr; success notification after the puzzle is solved
* Fail &rarr; fail notification after the answer is wrong

 #### DeepIntoTheForest Game 
 **VERSION 1.1.1**
 
 ![DeepIntoTheForestIcon](https://github.com/tombo92/PythonTerminalGame/blob/master/DeepIntoTheForest/app.ico?raw=true)|
 
A good intro ...

## How to use

### Setup

* The tool is written in Python and the version **3.10.6** is used.
* **Installation of the used libaries**

  The used libaries (that are not installed by default) are listed in the **`requirements.txt`** file.
  To install them use the command: 
  
  ```console
  pip install -r requirements.txt
  ```

### Usage
```python
# =========================================================================== #
#  SECTION: Function definitions
# =========================================================================== #

def main():
    pass

# =========================================================================== #
#  SECTION: Main Body
# =========================================================================== #
if __name__ == '__main__':
    main()
```

## PyInstaller
```console
  Python/Python310/python.exe -m PyInstaller --onefile --icon=DeepIntoTheForest/app.ico --dist=DeepIntoTheForest/dist/  DeepIntoTheForest/DeepIntoTheForest.py --name DeepIntoTheForest
  ```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Links

Helpfull links:

* [pyinstaller](https://readthedocs.org/projects/pyinstaller/downloads/pdf/latest/)






