# Guarding Logic Design

**Date:** 2025-11-12
**Status:** Approved

## Problem Statement

The current extension opens Claude Code terminal on every VS Code startup without checking if one already exists, and closes all editors indiscriminately, removing both auto-restored tabs and user-opened tabs.

## Requirements

1. Do not create a Claude Code terminal instance if one is already open
2. Preserve all tabs (both auto-restored and user-opened)
3. Only close editor panes that are side effects of opening the terminal

## Design

### Architecture Overview

Add two guards to the activation flow in extension.js:

1. **Duplicate Prevention Guard**: Check for existing Claude Code terminal before opening
2. **Tab Preservation**: Remove closeAllEditors call, keep only closeGroup

### Implementation Approach

**Duplicate Prevention:**
- Use `vscode.window.terminals` API to enumerate all open terminals
- Search for any terminal with "Claude" in the name (case-insensitive)
- Exit early if found

**Tab Preservation:**
- Remove the `closeAllEditors` command completely
- Keep `closeGroup` to clean up side-effect panes from terminal opening
- This preserves both auto-restored tabs and user-opened tabs

### Code Changes

**File:** extension.js

**Before:**
```javascript
setTimeout(async () => {
    try {
        // Close all editors
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');

        // Open Claude Code in terminal first
        await vscode.commands.executeCommand('claude-vscode.terminal.open');

        // Wait a moment for Claude Code to open, then close the editor group
        await new Promise(resolve => setTimeout(resolve, 200));

        // Close the active editor group (this should remove the empty pane)
        await vscode.commands.executeCommand('workbench.action.closeGroup');
    } catch (error) {
        // Silently fail - don't interrupt the user's workflow
    }
}, 500);
```

**After:**
```javascript
setTimeout(async () => {
    try {
        // GUARD 1: Check if Claude Code terminal already exists
        const existingClaudeTerminal = vscode.window.terminals.find(
            terminal => terminal.name.toLowerCase().includes('claude')
        );

        if (existingClaudeTerminal) {
            return; // Claude Code already open, nothing to do
        }

        // GUARD 2: Preserve all tabs (removed closeAllEditors)

        // Open Claude Code in terminal
        await vscode.commands.executeCommand('claude-vscode.terminal.open');

        // Wait for Claude Code to open
        await new Promise(resolve => setTimeout(resolve, 200));

        // Close only the side-effect editor group
        await vscode.commands.executeCommand('workbench.action.closeGroup');
    } catch (error) {
        // Silently fail - don't interrupt the user's workflow
    }
}, 500);
```

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Terminal name variations | "Claude" substring matches "Claude Code", "Claude Terminal", etc. |
| Multiple Claude terminals | `find()` returns first match, preventing redundant checks |
| User closes terminal manually | New workspace won't re-open (correct behavior) |
| Claude Code extension missing | try-catch handles missing command gracefully |
| Terminal created by other extensions | Unlikely to match "Claude" substring |

## Testing Considerations

1. Verify no duplicate terminal when opening multiple workspaces
2. Verify auto-restored tabs remain open
3. Verify user-opened tabs remain open
4. Verify side-effect editor panes are cleaned up
5. Verify behavior when Claude Code extension is disabled/missing

## Success Criteria

- Claude Code terminal opens once per VS Code session
- All user tabs (auto-restored and manually opened) are preserved
- No unwanted empty editor panes remain after activation
