import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? inputPath;

const buffer = fs.readFileSync(inputPath);
const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;

let width;
let height;
let rgba;

if (isJpeg) {
  const decoded = jpeg.decode(buffer, { useTArray: true });
  width = decoded.width;
  height = decoded.height;
  rgba = decoded.data;
  for (let i = 0; i < rgba.length; i += 4) {
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    rgba[i + 3] = r > 235 && g > 235 && b > 235 ? 0 : 255;
  }
} else {
  const png = PNG.sync.read(buffer);
  width = png.width;
  height = png.height;
  rgba = png.data;
  for (let i = 0; i < rgba.length; i += 4) {
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    const a = rgba[i + 3];
    if (a === 0) continue;
    if (r > 235 && g > 235 && b > 235) rgba[i + 3] = 0;
  }
}

const out = new PNG({ width, height });
out.data = rgba;
fs.writeFileSync(outputPath, PNG.sync.write(out));
console.log(`Processed ${inputPath} -> ${outputPath} (${width}x${height}, alpha)`);
