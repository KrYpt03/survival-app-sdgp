import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = path.join(__dirname, 'src');

// File extension regex
const relativeImportRegex = /from\s+['"](\.[^'"]+)['"]/g;

// Walk through all files in the src directory recursively
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (file.endsWith('.ts')) {
      callback(filePath);
    }
  });
}

// Process a file to add .js extensions to imports
function processFile(filePath) {
  console.log(`Processing ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace imports without .js extension
  const newContent = content.replace(relativeImportRegex, (match, importPath) => {
    // Skip if the import already has a file extension
    if (importPath.endsWith('.js')) {
      return match;
    }
    modified = true;
    return match.replace(importPath, `${importPath}.js`);
  });

  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed imports in ${filePath}`);
  }
}

// Process all TypeScript files
walkDir(srcDir, processFile);
console.log('Done fixing imports!'); 