import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

export const editorialEase = [.22, 1, .36, 1] as const;
const steps = [
  ['整理', '确认要求，整理素材', '根据已有文稿与制作要求，整理拍摄素材和可用画面。'],
  ['拍摄', '让画面各就其位', '商业口播参与真人拍摄；艺术与人物故事侧重已有素材筛选和镜头组接。'],
  ['剪辑', '找到表达的节奏', '调整镜头与口播节奏，完成音乐匹配、字幕与画面包装。'],
  ['交付', '在协作中打磨成片', '与文案、运营及技术团队协作，根据反馈调整并完成交付。'],
];
export function Workflow() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start .85', 'end .45'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return <ol ref={ref} className="workflow-steps" data-motion="13-workflow">
    <li className="workflow-track" aria-hidden="true"><motion.span style={reduced ? { '--progress': 1 } as never : { '--progress': scale } as never} /></li>
    {steps.map(([word, title, description], index) => <motion.li key={word}
      initial={reduced ? false : { opacity: .35, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .55 }} transition={{ duration: .45, delay: index * .06, ease: editorialEase }}>
      <span className="workflow-number mono">0{index + 1}</span><span className="workflow-word">{word}</span>
      <h4>{title}</h4><p>{description}</p>
    </motion.li>)}
  </ol>;
}
