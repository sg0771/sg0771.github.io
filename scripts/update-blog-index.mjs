import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const blogDir = path.join(rootDir, 'blog');
const indexPath = path.join(blogDir, 'README.md');

function toTitle(fileName) {
  const parsed = path.parse(fileName);
  const title = parsed.name
    .replace(/^\d{4}-\d{2}-\d{2}-+/, '')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]');

  return title.trim() || parsed.name;
}

const entries = await readdir(blogDir, { withFileTypes: true });
const posts = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => name.toLowerCase().endsWith('.md') && name !== 'README.md')
  .sort((a, b) => b.localeCompare(a, 'zh-Hans-CN'));

const lines = [
  '# 我的文档',
  '所有文章存放在 blog 目录，点击下面的标题即可浏览内容。',
  '',
  '## 文章目录',
  '',
  ...posts.map((name) => `- [${toTitle(name)}](/blog/${encodeURIComponent(name)})`),
  '',
];

await writeFile(indexPath, lines.join('\n'), 'utf8');
console.log(`Updated ${path.relative(rootDir, indexPath).replaceAll(path.sep, '/')}`);
