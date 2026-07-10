import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2] ?? process.cwd();
const EXTENSIONS = new Set(['.ts', '.tsx']);

function fixJsDocIndentation(content) {
  const lines = content.split('\n');
  const output = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.startsWith('/**')) {
      const blockStart = index;
      let blockEnd = index;

      while (blockEnd < lines.length && !lines[blockEnd].trim().endsWith('*/')) {
        blockEnd += 1;
      }

      let nextIndex = blockEnd + 1;
      while (nextIndex < lines.length && lines[nextIndex].trim() === '') {
        nextIndex += 1;
      }

      const nextLine = lines[nextIndex] ?? '';
      const indentMatch = nextLine.match(/^(\s+)\S/);

      if (indentMatch && !line.startsWith(indentMatch[1])) {
        const indent = indentMatch[1];
        for (let blockLine = blockStart; blockLine <= blockEnd; blockLine += 1) {
          output.push(indent + lines[blockLine]);
        }
        index = blockEnd + 1;
        continue;
      }
    }

    output.push(line);
    index += 1;
  }

  return output.join('\n');
}

function walkDirectory(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(fullPath, files);
      continue;
    }

    if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function main() {
  const srcDir = path.join(ROOT, 'src');
  let changedFiles = 0;

  for (const filePath of walkDirectory(srcDir)) {
    const original = fs.readFileSync(filePath, 'utf8');
    const fixed = fixJsDocIndentation(original);

    if (fixed !== original) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      changedFiles += 1;
    }
  }

  console.log(`Fixed indentation in ${changedFiles} files under ${srcDir}`);
}

main();
