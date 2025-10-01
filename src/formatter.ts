import * as vscode from 'vscode';
import * as fs from 'fs';
import { spawn } from 'child_process';

/**
 * Gets the path to the google-java-format JAR file from user settings.
 * @returns The path to the JAR file.
 * @throws Error if the JAR path is not configured or the file doesn't exist.
 */
function getFormatterJar(): string {
    const config = vscode.workspace.getConfiguration('googleJavaFormatter');
    const jarPath = config.get<string>('jarPath', '');

    if (!jarPath) {
        throw new Error(
            'Google Java Formatter JAR path not configured. ' +
            'Please set "googleJavaFormatter.jarPath" in your settings to point to the google-java-format JAR file. ' +
            'Download from https://github.com/google/google-java-format/releases'
        );
    }

    if (!fs.existsSync(jarPath)) {
        throw new Error(
            `Google Java Formatter JAR not found at: ${jarPath}. ` +
            'Please verify the path in your settings and ensure the file exists.'
        );
    }

    console.log(`Using formatter JAR at: ${jarPath}`);
    return jarPath;
}

/**
 * Formats Java code using the google-java-format tool.
 * @param text The Java code to format.
 * @returns A promise that resolves to the formatted code.
 */
export function formatJava(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            // Get the path to the JAR from settings.
            const jarPath = getFormatterJar();

            // Spawn a new Java process to run the formatter.
            // The '-' argument tells the tool to read from stdin.
            const formatterProcess = spawn('java', ['-jar', jarPath, '-']);

            let formattedText = '';
            let errorOutput = '';

            // Collect formatted output from stdout.
            formatterProcess.stdout.on('data', (data) => {
                formattedText += data.toString();
            });

            // Collect error output from stderr.
            formatterProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            // Handle process exit.
            formatterProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Formatter exited with code ${code}: ${errorOutput}`);
                    // Provide a more helpful error message for common issues.
                    if (errorOutput.includes('UnsupportedClassVersionError')) {
                        return reject(new Error('A required Java version is not installed or configured correctly. Please check your JAVA_HOME and path.'));
                    }
                    if (errorOutput.toLowerCase().includes('error: syntax error')) {
                        return reject(new Error('The Java code contains syntax errors.'));
                    }
                    return reject(new Error(errorOutput || `Formatter exited with code ${code}`));
                }
                resolve(formattedText);
            });
            
            // Handle spawn errors (e.g., 'java' command not found).
            formatterProcess.on('error', (err) => {
                console.error('Failed to start formatter process.', err);
                reject(new Error('Could not execute the `java` command. Please ensure Java is installed and in your PATH.'));
            });

            // Write the code to the process's stdin and close it.
            formatterProcess.stdin.write(text);
            formatterProcess.stdin.end();

        } catch (error) {
            reject(error);
        }
    });
}
