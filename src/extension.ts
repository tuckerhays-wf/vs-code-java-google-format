// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { formatJava } from './formatter';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


    console.log('Congratulations, your "java-google-formatter" extension is now active!');

    // Register the formatting provider for Java files.
    // This is the core of the extension, connecting our formatting logic
    // to VS Code's formatting system.
    const disposable = vscode.languages.registerDocumentFormattingEditProvider('java', {

        async provideDocumentFormattingEdits(document: vscode.TextDocument): Promise<vscode.TextEdit[]> {
            // Get the full text of the document to be formatted.
            const originalText = document.getText();

            try {
                // Call our formatter function to get the formatted text.
                const formattedText = await formatJava(originalText);

                // If the formatted text is the same, no need to edit.
                if (formattedText === originalText) {
                    return [];
                }

                // Calculate the range of the entire document.
                const start = new vscode.Position(0, 0);
                const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
                const fullRange = new vscode.Range(start, end);

                // Create a TextEdit to replace the entire document content.
                return [vscode.TextEdit.replace(fullRange, formattedText)];

            } catch (error) {
                // If an error occurs, show an informative message to the user.
                const message = error instanceof Error ? error.message : 'An unknown error occurred during formatting.';
                vscode.window.showErrorMessage(`Google Java Format failed: ${message}`);

                // Return an empty array to indicate no changes should be made.
                return [];
            }
        }
    });

    // Add the disposable to the context's subscriptions so it will be cleaned up
    // when the extension is deactivated.
    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
