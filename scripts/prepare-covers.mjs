// 压缩已生成的封面原稿，不改变封面设计或原视频。
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const works = JSON.parse(readFileSync('src/data/works.json', 'utf8'));
const covers = JSON.parse(readFileSync('src/data/covers.json', 'utf8'));
mkdirSync('public/covers', { recursive: true });
for (const { id } of works) {
  const source = `assets/cover-designs/${id}.png`;
  if (!existsSync(source)) continue;
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-vf', 'scale=1200:-2', '-quality', '84', `public/covers/${id}.webp`]);
  covers[id] = `/covers/${id}.webp`;
  console.log(`${id} 封面压缩完成`);
}
writeFileSync('src/data/covers.json', JSON.stringify(covers, null, 2) + '\n');
