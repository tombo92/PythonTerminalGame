"""
Shared pytest configuration.

Adds repo root and DeepIntoTheForest/ to sys.path (handled by pytest.ini
pythonpath setting), and stubs out `pynput` so that importing
DeepIntoTheForestLevels works on headless CI environments where pynput
cannot access a display or /dev/input.
"""
import sys
from unittest.mock import MagicMock

# Stub pynput.keyboard before any game module is imported.
# dungeon_quest.py does `from pynput import keyboard` at module level.
_pynput_stub = MagicMock()
sys.modules.setdefault("pynput", _pynput_stub)
sys.modules.setdefault("pynput.keyboard", _pynput_stub.keyboard)
