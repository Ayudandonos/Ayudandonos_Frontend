import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2] ?? process.cwd();
const EXTENSIONS = new Set(['.ts', '.tsx']);

function parseEpsBlock(lines, startIndex) {
  if (!lines[startIndex]?.trim().startsWith('// Entrada:')) {
    return null;
  }

  const sections = { entrada: '', proceso: '', salida: '' };
  let current = null;
  let index = startIndex;

  while (index < lines.length) {
    const trimmed = lines[index].trim();

    if (trimmed === '' && current !== null) {
      index += 1;
      continue;
    }

    if (!trimmed.startsWith('//')) {
      break;
    }

    if (trimmed.startsWith('// Entrada:')) {
      current = 'entrada';
      const inline = trimmed.slice('// Entrada:'.length).trim();
      if (inline) {
        sections.entrada = inline;
      }
      index += 1;
      continue;
    }

    if (trimmed.startsWith('// Proceso:')) {
      current = 'proceso';
      const inline = trimmed.slice('// Proceso:'.length).trim();
      if (inline) {
        sections.proceso = inline;
      }
      index += 1;
      continue;
    }

    if (trimmed.startsWith('// Salida:')) {
      current = 'salida';
      const inline = trimmed.slice('// Salida:'.length).trim();
      if (inline) {
        sections.salida = inline;
      }
      index += 1;
      continue;
    }

    if (current) {
      const content = trimmed.slice(2).trim();
      if (content) {
        sections[current] = sections[current] ? `${sections[current]} ${content}` : content;
      }
      index += 1;
      continue;
    }

    break;
  }

  if (!sections.proceso || !sections.salida) {
    return null;
  }

  return { sections, endIndex: index };
}

function toJsDoc(sections) {
  return [
    '/**',
    ` * Entrada: ${sections.entrada || 'Ninguna.'}`,
    ` * Proceso: ${sections.proceso}`,
    ` * Salida: ${sections.salida}`,
    ' */',
  ].join('\n');
}

function convertContent(content) {
  const lines = content.split('\n');
  const output = [];
  let index = 0;
  let converted = 0;

  while (index < lines.length) {
    const parsed = parseEpsBlock(lines, index);

    if (parsed) {
      output.push(toJsDoc(parsed.sections));
      converted += 1;
      index = parsed.endIndex;
      continue;
    }

    output.push(lines[index]);
    index += 1;
  }

  return { content: output.join('\n'), converted };
}

function walkDirectory(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'scripts') {
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
  if (!fs.existsSync(srcDir)) {
    console.error(`No src directory found at ${srcDir}`);
    process.exit(1);
  }

  const files = walkDirectory(srcDir);
  let totalBlocks = 0;
  let changedFiles = 0;

  for (const filePath of files) {
    const original = fs.readFileSync(filePath, 'utf8');
    const { content, converted } = convertContent(original);

    if (converted > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      changedFiles += 1;
      totalBlocks += converted;
    }
  }

  console.log(`Converted ${totalBlocks} blocks in ${changedFiles} files under ${srcDir}`);
}

main();
