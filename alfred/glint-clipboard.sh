#!/bin/bash
# Glint: Polish clipboard text via API (no browser needed)
# Alfred setup: Hotkey trigger → set argument to "Selection in macOS" → Run Script
# The selected text is automatically copied to clipboard by Alfred.

TEXT="$(pbpaste)"

if [ -z "$TEXT" ]; then
  osascript -e 'display notification "No text selected" with title "Glint" sound name "Basso"'
  exit 1
fi

RESULT=$(curl -s -X POST http://localhost:3001/api/polish \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg text "$TEXT" '{text: $text}')" \
  | jq -r '.polished // .error')

if [ $? -eq 0 ] && [ -n "$RESULT" ] && [ "$RESULT" != "null" ]; then
  echo -n "$RESULT" | pbcopy
  osascript -e 'display notification "Text polished and copied!" with title "Glint"'
else
  osascript -e 'display notification "Failed to polish text" with title "Glint" sound name "Basso"'
fi
