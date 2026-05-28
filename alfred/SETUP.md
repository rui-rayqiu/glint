# Alfred Workflow Setup

Polish text from any app using a system-wide hotkey, without switching to the browser.

## Prerequisites

- Alfred with Powerpack (free Alfred doesn't support workflows)
- `jq` installed: `brew install jq`
- Glint server running (`npm run dev`)

## Clipboard Mode (fastest)

Select text anywhere → press hotkey → polished text replaces your clipboard.

### Setup

1. Open **Alfred Preferences** → **Workflows**
2. Click **+** (bottom left) → **Blank Workflow** → name it "Glint" → **Create**
3. Right-click the canvas → **Triggers** → **Hotkey**
4. Set your hotkey (e.g., `Ctrl+Shift+P`)
5. Set **Argument** to "Selection in macOS"
6. Click **Save**
7. Right-click canvas → **Actions** → **Run Script**
8. Set Shell to `/bin/bash`
9. Paste as the script:
   ```bash
   /path/to/glint/alfred/glint-clipboard.sh
   ```
   Replace `/path/to/glint` with your actual clone location.
10. Click **Save**
11. Drag a line from the Hotkey block to the Run Script block to connect them

### How it works

Alfred's "Selection in macOS" copies the selected text to your clipboard. The script reads from the clipboard via `pbpaste`, sends it to the Glint API, and puts the polished result back on the clipboard.

### Usage

1. Select text in any app
2. Press your hotkey
3. Wait a few seconds for the macOS notification
4. Cmd+V to paste the polished text

## Browser Review Mode

Select text anywhere → press hotkey → Glint opens in your browser with the text pre-filled and auto-submitted. You review the result and copy manually.

### Setup

Same steps as above, but use a different hotkey (e.g., `Ctrl+Shift+O`) and this script:

```bash
/path/to/glint/alfred/glint-browser.sh
```

### Usage

1. Select text in any app
2. Press your hotkey
3. Glint opens in your browser with the polished result
4. Click Copy or Accept

## Auto-paste (optional)

You can make Alfred automatically paste the polished text back into your app, so the full flow is: select text → hotkey → polished text replaces selection.

1. After your Run Script block, right-click the canvas → **Utilities** → **Delay**
2. Set the delay to **0.5s** (gives the clipboard time to update)
3. Right-click the canvas → **Outputs** → **Dispatch Key Combo**
4. Set the key combo to **Cmd+V**
5. Connect the blocks: Run Script → Delay → Dispatch Key Combo

## Tips

- You can set up both workflows with different hotkeys
- The server must be running for either mode to work. Consider adding `npm run dev` to your login items or use a launch agent
