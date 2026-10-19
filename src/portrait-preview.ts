import './styles.css';
import './edition.css';
import './collections.css';
import './obsidian.css';
import './motion.css';
import './atmosphere.css';
import './layout.css';
import './portrait-preview.css';

const portraits: Record<string, { file: string; title: string; alt: string; position: string; analysis: string }> = {
  '1': { file: '01-mickey.webp', title: '米奇合影', alt: '黄爱美与米奇玩偶的合影', position: '50% 46%', analysis: '亲切、活泼，人物表情很有记忆点。但玩偶、货架和暖色背景会分散注意力，视觉重量偏大，更适合强调个人生活感。' },
  '2': { file: '02-garden.webp', title: '草帽绿植', alt: '黄爱美戴草帽站在绿植前', position: '50% 46%', analysis: '自然清新，深绿背景能接住网页的暗色氛围，草帽让轮廓清楚。绿叶纹理较密，旅行和生活方式的气息更明显。' },
  '3': { file: '03-pink.webp', title: '浅粉上衣 · 推荐', alt: '黄爱美穿浅粉色上衣站在店铺门口', position: '50% 48%', analysis: '浅粉上衣与页面淡紫文字呼应，浅色建筑也延续原照片的明亮感。半身构图自然，人物朝向右侧介绍文字，整体最协调。' },
  '4': { file: '04-tree.webp', title: '白衣树影', alt: '黄爱美穿白色上衣站在树影下', position: '50% 48%', analysis: '白衣与暗色背景对比清楚，视线直接，适合自我介绍。构图比前两张简洁；照片偏青，与紫色光晕并置时会更有冷调感。' },
  original: { file: '', title: '当前原图', alt: '黄爱美的个人照片', position: '50% 42%', analysis: '原图的浅色背景和生活感比较均衡。四个备选沿用同样的照片框、文字、背景和低饱和处理，方便直接判断替换效果。' },
};

const image = document.querySelector<HTMLImageElement>('#preview-portrait')!;
const controls = document.querySelectorAll<HTMLButtonElement>('[data-photo]');

function selectPortrait(id: string, updateUrl = true) {
  const portrait = portraits[id] ?? portraits['1'];
  const selected = portraits[id] ? id : '1';
  image.src = portrait.file ? `/profile/portrait-options/${portrait.file}` : '/profile/huang-aimei-portrait-960.webp';
  image.alt = portrait.alt;
  image.style.objectPosition = portrait.position;
  document.querySelector('#option-number')!.textContent = selected === 'original' ? 'ORIGINAL' : `OPTION 0${selected}`;
  document.querySelector('#option-title')!.textContent = portrait.title;
  document.querySelector('#option-analysis')!.textContent = portrait.analysis;
  controls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.photo === selected)));
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('photo', selected);
    window.history.replaceState(null, '', url);
  }
}

controls.forEach(button => button.addEventListener('click', () => {
  selectPortrait(button.dataset.photo!);
  if (button.closest('.portrait-options')) window.scrollTo({ top: 0, behavior: 'smooth' });
}));
selectPortrait(new URLSearchParams(window.location.search).get('photo') ?? '1', false);
