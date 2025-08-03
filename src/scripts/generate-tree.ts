import fs from 'fs';
import path from 'path';

const IGNORED = ['node_modules', '.git', '.next', 'dist'];
const OUTPUT_FILE = path.join(__dirname, 'structure.txt');

function generateTree(dir: string, prefix = ''): string {
  let output = '';

  const items = fs
    .readdirSync(dir)
    .filter((item) => !IGNORED.includes(item) && !item.startsWith('.DS_Store'))
    .map((item) => {
      const fullPath = path.join(dir, item);
      const isDir = fs.statSync(fullPath).isDirectory();
      return { item, isDir };
    })
    .sort((a, b) => {
      // Urutkan: folder dulu, lalu file, lalu nama A-Z
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.item.localeCompare(b.item);
    });

  items.forEach(({ item, isDir }, index) => {
    const isLast = index === items.length - 1;
    const fullPath = path.join(dir, item);
    const branch = isLast ? '└── ' : '├── ';
    output += `${prefix}${branch}${item}\n`;

    if (isDir) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      output += generateTree(fullPath, nextPrefix);
    }
  });

  return output;
}

// ⛳ Root folder project
const root = path.resolve(__dirname, '../../');
const treeOutput = generateTree(root);

// Simpan ke file
fs.writeFileSync(OUTPUT_FILE, treeOutput);
console.log(`✅ Struktur folder disimpan di: ${OUTPUT_FILE}`);
