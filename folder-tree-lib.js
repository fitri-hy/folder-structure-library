const fs = require('fs').promises;
const path = require('path');

async function scanFolderStructure(
  dirPath,
  maxDepth = 10,
  currentDepth = 0,
  ignoredFolders = [],
  ignoredFiles = []
) {
  if (currentDepth > maxDepth) return null;

  try {
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) throw new Error(`Path "${dirPath}" bukan folder.`);

    const entries = await fs.readdir(dirPath);
    const structure = {};

    for (const entry of entries) {
      if (ignoredFolders.includes(entry)) continue;
      if (ignoredFiles.includes(entry)) continue;

      const fullPath = path.join(dirPath, entry);
      const entryStats = await fs.stat(fullPath);

      if (entryStats.isDirectory()) {
        structure[entry] = await scanFolderStructure(
          fullPath,
          maxDepth,
          currentDepth + 1,
          ignoredFolders,
          ignoredFiles
        );
      } else if (entryStats.isFile()) {
        structure[entry] = null;
      } else {
        structure[entry] = null;
      }
    }

    return structure;
  } catch (err) {
    throw err;
  }
}

module.exports = { scanFolderStructure };
