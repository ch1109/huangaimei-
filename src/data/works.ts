import raw from './works.json';
import media from './media.json';
import covers from './covers.json';
import caseStudies from './case-studies.json';
import { portfolioCollections, collectionForWork, individualIntroductions, type CollectionId, type ProjectId } from './collections';

export const categories = ['全部', '商业内容', '艺术与故事', '个人练习'] as const;
export type Category = typeof categories[number] | CollectionId | ProjectId;
export interface CaseMoment { time: string; seconds: number; image: string; alt: string; title: string; description: string }
export interface CaseStudy { workId: string; focus: string; summary: string; moments: CaseMoment[] }
export interface Work {
  id: string; slug: string; title: string; shortTitle: string;
  category: Exclude<typeof categories[number], '全部'>; kind: string; duration: string;
  projectType: string; organization?: string; responsibilities: string[];
  productionNote?: string; featured?: boolean; poster?: string; cover?: string; video?: string;
  preview?: string; width?: number; height?: number; sourceUrl: string;
  highlight?: string; caseStudy?: CaseStudy;
  collectionId: CollectionId; projectId: ProjectId; projectIntroduction?: string;
}
export const sourceUrl = 'https://hq8krg01cra.feishu.cn/wiki/WoAlwpk0Cidf60kq4rrccVY3n9c';
export const works: Work[] = raw.map((w) => {
  const collection = collectionForWork(w.id);
  return { ...w, ...(media as Record<string, object>)[w.id], cover: (covers as Record<string, string>)[w.id], sourceUrl: `${sourceUrl}#${collection.anchor}`, collectionId: collection.id, projectId: collection.projectId, projectIntroduction: individualIntroductions[w.id], caseStudy: caseStudies.find(item => item.workId === w.id) };
}) as Work[];
export const caseWorks = works.filter(work => work.caseStudy);
export const featured = ['W01', 'W03', 'W11', 'W15'].map(id => works.find(w => w.id === id)!);
export function filterWorks(category: Category) {
  const selected = category === '全部' ? works : works.filter(w => w.category === category || w.collectionId === category || w.projectId === category);
  if ((categories as readonly string[]).includes(category)) return selected;
  return portfolioCollections.flatMap(collection => collection.workIds.map(id => selected.find(work => work.id === id)).filter((work): work is Work => !!work));
}
// Presentation order is independent from source data and category playback order.
export const showcaseOrder = ['W11', 'W01', 'W18', 'W15', 'W19', 'W17'];
export function displayWorks(category: Category) {
  if (category !== '全部') return filterWorks(category);
  return [...showcaseOrder.map(id => works.find(w => w.id === id)!), ...works.filter(w => !showcaseOrder.includes(w.id))];
}
export function nextWork(slug: string, category: Category = '全部') {
  const current = works.find(work => work.slug === slug);
  const list = filterWorks(category === '全部' && current ? current.collectionId : category);
  const index = list.findIndex(w => w.slug === slug);
  return list[(index + 1) % list.length];
}
