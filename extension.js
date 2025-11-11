const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Get configuration
    const config = vscode.workspace.getConfiguration('claudeAutoOpen');
    const enabled = config.get('enabled', true);

    if (!enabled) {
        return;
    }

    // Open Claude Code after a short delay
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
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
