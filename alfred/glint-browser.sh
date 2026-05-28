#!/bin/bash
# Glint: Open clipboard text in Glint browser UI for review
# Alfred setup: Hotkey trigger → set argument to "Selection in macOS" → Run Script
# The selected text is automatically copied to clipboard by Alfred.

TEXT="$(pbpaste)"

if [ -z "$TEXT" ]; then
  osascript -e 'display notification "No text selected" with title "Glint" sound name "Basso"'
  exit 1
fi

ENCODED=$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1]))" "$TEXT")

open "http://localhost:5173/?text=$ENCODED"
