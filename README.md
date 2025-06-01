# Folder Structure

Automatically generate and monitor your project folder structure. The output is a `.txt` file that shows the folder and file hierarchy in a tree view.

## Installation

```bash
npm install folder-structure
```

## Use

> It must be used at the application entry point, such as index.js, server.js, ,app.js, main.mjs or others according to your project entry point.

#### CommonJS
```js
const path = require('path');
require('folder-structure').init(__dirname, {
  ignoredFolders: ['node_modules', '.git', 'dist', 'build'],
  ignoredFiles: ['.gitignore'],
  outputFilename: 'my-folder-structure.txt',
});
```

#### ESM
```js
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { init } from 'folder-structure';

const __dirname = dirname(fileURLToPath(import.meta.url));

init(resolve(__dirname), {
  ignoredFolders: ['node_modules', '.git', 'dist', 'build'],
  ignoredFiles: ['.gitignore'],
  outputFilename: 'my-folder-structure.txt',
});
```

## Configuration Options

| Options          | Type       | Default                    | Information                    |
| ---------------- | ---------- | -------------------------- | --------------------------- |
| `ignoredFolders` | `string[]` | `['node_modules', '.git']` | Ignored folder		      |
| `ignoredFiles`   | `string[]` | `[]`                       | Ignored files              |
| `outputFilename` | `string`   | `'folder-structure.txt'`   | Structure output file name |

## Example Output

```bash
my-project/
├── public
│   └── index.html
├── src
│   ├── components
│   │   └── Header.js
│   └── App.js
└── package.json
```