const fs = require('fs').promises;
const path = require('path');
const chokidar = require('chokidar');
const { scanFolderStructure } = require('./folder-tree-lib');

const DEFAULT_OUTPUT_FILENAME = 'folder-structure.txt';

async function saveStructureToFile(structure, rootName, outputFile) {
  const lines = [];

  function buildLines(obj, prefix = '') {
    const entries = Object.entries(obj);
    entries.forEach(([name, value], index) => {
      const isLastEntry = index === entries.length - 1;
      const pointer = isLastEntry ? '└── ' : '├── ';
      lines.push(prefix + pointer + name);
      if (value && typeof value === 'object') {
        const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
        buildLines(value, newPrefix);
      }
    });
  }

  lines.push(rootName + '/');
  buildLines(structure);

  await fs.writeFile(outputFile, lines.join('\n'), 'utf8');
  console.log(`Folder structure saved to ${outputFile}`);
}

async function generateAndSaveStructure(rootDir, outputFile, ignoredFolders, ignoredFiles) {
  try {
    const rootName = path.basename(rootDir);
    const struct = await scanFolderStructure(rootDir, 10, 0, ignoredFolders, ignoredFiles);
    await saveStructureToFile(struct, rootName, outputFile);
  } catch (error) {
    console.error('Failed to generate folder structure:', error.message);
  }
}

const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

function watchAndUpdate(rootDir, outputFile, ignoredFolders, ignoredFiles) {
  const ignoredPatterns = [
    ...ignoredFolders.map(f => new RegExp(`(^|[\\/\\\\])${f}([\\/\\\\]|$)`)),
    ...ignoredFiles.map(f => new RegExp(`(^|[\\/\\\\])${f}$`)),
    new RegExp(`${path.basename(outputFile).replace('.', '\\.')}$`, 'i'),
  ];

  const watcher = chokidar.watch(rootDir, {
    ignored: ignoredPatterns,
    ignoreInitial: true,
  });

  const debouncedUpdate = debounce(async (event, pathChanged) => {
    console.log(`Detected ${event} on ${pathChanged}. Updating folder structure...`);
    await generateAndSaveStructure(rootDir, outputFile, ignoredFolders, ignoredFiles);
  }, 300);

  watcher.on('all', debouncedUpdate);
}

async function init(rootDir = null, options = {}) {
  const ROOT_DIR = rootDir ? path.resolve(rootDir) : path.resolve(__dirname);

  const {
    ignoredFolders = ['node_modules', '.git'],
    ignoredFiles = [],
    outputFilename = DEFAULT_OUTPUT_FILENAME,
  } = options;

  const outputFile = path.join(ROOT_DIR, outputFilename);

  await generateAndSaveStructure(ROOT_DIR, outputFile, ignoredFolders, ignoredFiles);
  watchAndUpdate(ROOT_DIR, outputFile, ignoredFolders, ignoredFiles);
}

module.exports = { init };
