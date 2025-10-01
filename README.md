# Google Java Formatter

A VS Code extension that formats Java files using the official [google-java-format](https://github.com/google/google-java-format) tool.

## Features

- Formats Java code using google-java-format
- Integrates with VS Code's built-in formatting commands
- Use any version of google-java-format by pointing to a local JAR file

## Requirements

- **Java Runtime**: Java must be installed and available in your PATH
- **google-java-format JAR**: Download from [GitHub releases](https://github.com/google/google-java-format/releases)

## Installation & Setup

1. Install the extension
2. Download the google-java-format JAR file (e.g., `google-java-format-1.28.0-all-deps.jar`)
3. Configure the JAR path in your VS Code settings:

```json
{
  "googleJavaFormatter.jarPath": "/path/to/google-java-format-1.28.0-all-deps.jar"
}
```

### Set as Default Java Formatter

If you have multiple Java formatters installed, set this as your default:

```json
{
  "[java]": {
    "editor.defaultFormatter": "your-publisher-name.google-java-formatter"
  }
}
```

Or use the VS Code UI: Open a Java file → `Shift+Option+F` (macOS) or `Shift+Alt+F` (Windows/Linux) → Select "Google Java Formatter" when prompted.

## Usage

Format your Java files using any of these methods:

- **Format Document**: `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (macOS)
- **Right-click** → `Format Document`
- **Command Palette** → `Format Document`

## Settings

| Setting | Type | Description |
|---------|------|-------------|
| `googleJavaFormatter.jarPath` | string | Path to the google-java-format JAR file |

---

## Development

### Prerequisites

- Node.js and npm (or pnpm)
- TypeScript

### Setup

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode (auto-compile on changes)
npm run watch
```

### Running & Debugging

1. **Compile the extension**:
   ```bash
   npm run compile
   ```

2. **Press F5** in VS Code to launch the Extension Development Host

3. **In the new window**, open or create a `.java` file
   - The extension only activates when a Java file is opened
   - Check the Debug Console for the activation message

4. **Configure the JAR path** in the Extension Development Host window's settings

5. **Test formatting** on a Java file using `Shift+Option+F` (macOS) or `Shift+Alt+F` (Windows/Linux)

### Project Structure

```
├── src/
│   ├── extension.ts      # Extension entry point
│   ├── formatter.ts      # Formatter logic
│   └── test/             # Tests
├── out/                  # Compiled JavaScript (generated)
├── test-files/           # Sample Java files for testing
└── package.json          # Extension manifest
```

### Key Files

- **`src/extension.ts`**: Registers the document formatting provider
- **`src/formatter.ts`**: Spawns the Java process and handles formatting
- **`package.json`**: Defines the extension configuration and activation events

### Activation Event

The extension activates on `onLanguage:java`, meaning it only loads when a Java file is opened. This keeps VS Code startup fast.
