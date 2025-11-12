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
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
