# Claude Auto Open

Automatically opens Claude Code in a terminal when you open a VS Code workspace.

## Installation

1. Copy this extension folder to your VS Code extensions directory:
   ```bash
   cp -r claude-auto-open-extension ~/.vscode/extensions/
   ```

2. Restart VS Code or run "Developer: Reload Window" from the command palette (Cmd+Shift+P)

## Configuration

You can enable/disable the extension in VS Code settings:

```json
{
  "claudeAutoOpen.enabled": true
}
```

Or search for "Claude Auto Open" in VS Code settings (Cmd+,)

## How it works

The extension listens for the `onStartupFinished` event and automatically opens Claude Code in a terminal after a 500ms delay to ensure the workspace is fully loaded.

The extension includes two guards:
- **Duplicate Prevention**: Checks if a Claude Code terminal is already open before creating a new one
- **Tab Preservation**: Keeps all your open tabs (both auto-restored and manually opened) when activating

## Troubleshooting

If Claude Code doesn't open automatically:

1. Check that the Claude Code extension is installed
2. Check that `claudeAutoOpen.enabled` is set to `true` in settings
3. Check the Developer Console (Help > Toggle Developer Tools) for any error messages
4. Try increasing the delay in `extension.js` if your workspace takes longer to load
