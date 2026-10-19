// Project groups follow Feishu; display copy is edited for the portfolio.
export const portfolioProjects = [
  { id: 'official', number: '01', title: '公司官方账号', subtitle: '真人口播拍摄与剪辑', english: 'SHOOT & EDIT', label: 'IP拍摄剪辑' },
  { id: 'templates', number: '02', title: '加保科技', subtitle: '保司定制模板与小程序通用模板', english: 'COMMERCIAL TEMPLATES', label: '保司定制与通用模板视频剪辑' },
  { id: 'yifan', number: '03', title: '艺梵公司', subtitle: '艺术内容与人物故事剪辑', english: 'ART & HUMAN STORIES', label: '艺术内容与人物故事剪辑' },
  { id: 'practice', number: '04', title: '个人创作练习', subtitle: '广告、文旅与 AI 视频剪辑', english: 'PERSONAL PRACTICE', label: '个人创作练习' },
] as const;
export type ProjectId = typeof portfolioProjects[number]['id'];

export const portfolioCollections = [
  {
    id: 'official-account', projectId: 'official', title: '公司官方账号视频', english: 'ON CAMERA',
    anchor: 'ITP8db898oK3faxH7U1c4X9RnOc',
    introduction: ['在加保科技任职期间，为公司官方账号拍摄、剪辑保险话题口播视频。'],
    responsibilities: ['真人口播拍摄', '后期剪辑'],
    note: '', workIds: ['W01', 'W02'],
  },
  {
    id: 'custom-templates', projectId: 'templates', title: '保司定制视频模板', english: 'CUSTOM TEMPLATES',
    anchor: 'FBgrdi7NLo06ivx9mpccnMC7nLc',
    introduction: ['为泰康、中意人寿制作的定制视频模板，内容包括产品介绍、旅居和品牌宣传。'],
    responsibilities: ['视频剪辑', '标题与贴图设计', '字幕排版', '整体视觉包装'],
    note: 'AI 示例人物由公司提供，我负责剪辑与视觉包装。', workIds: ['W03', 'W04', 'W05', 'W06'],
  },
  {
    id: 'general-templates', projectId: 'templates', title: '小程序通用视频模板', english: 'GENERAL TEMPLATES',
    anchor: 'OgUtdeAbBosEWlxLlx0c3ABKnIe',
    introduction: ['用于公司小程序日常更新的视频模板，包括保险科普、产品介绍和热点话题。'],
    responsibilities: ['视频剪辑', '标题与贴图设计', '字幕排版', '整体视觉包装'],
    note: 'AI 示例人物由公司提供，我负责剪辑与视觉包装。', workIds: ['W07', 'W09', 'W08', 'W10'],
  },
  {
    id: 'art-films', projectId: 'yifan', title: '艺术作品剪辑', english: 'ART IN MOTION',
    anchor: 'MKWmd0aWdoM1nHx6aAMcYoQvnCd',
    introduction: ['将摄影、绘画和创意艺术素材剪辑成短片，配合音乐编排画面。'],
    responsibilities: ['素材查找与筛选', '画面剪辑与编排', '背景音乐匹配', '整体节奏把控'],
    note: '', workIds: ['W11', 'W12', 'W13', 'W14'],
  },
  {
    id: 'people-stories', projectId: 'yifan', title: '人物故事长视频混剪', english: 'PEOPLE & STORIES',
    anchor: 'LPFrdSA7xodRGAx4JGXcv3CXnsb',
    introduction: ['围绕夏加尔、钱锺书与林徽因的经历，整理相关影像和作品素材，剪辑人物故事视频。'],
    responsibilities: ['素材查找与筛选', '画面剪辑与编排', '背景音乐匹配', '整体节奏把控'],
    note: '', workIds: ['W15', 'W16'],
  },
  {
    id: 'personal-practice', projectId: 'practice', title: '广告、文旅与 AI 视觉', english: 'EDITING PRACTICE',
    anchor: 'V6WcdtXzYoSkVTxsptrctO4DnMe',
    introduction: ['工作之外做的一些剪辑练习，包括汽车广告、城市文旅、视觉故事和 AI 视频。'],
    responsibilities: ['视频剪辑', '剪辑节奏', '画面编排'],
    note: '广告题材作品为个人练习，非品牌委托。', workIds: ['W17', 'W19', 'W18', 'W20'],
  },
] as const;
export type CollectionId = typeof portfolioCollections[number]['id'];
export function collectionForWork(id: string) {
  return portfolioCollections.find(collection => (collection.workIds as readonly string[]).includes(id))!;
}

// Short descriptions use the supplied subject matter without unfinished source excerpts.
export const individualIntroductions: Record<string, string> = {
  W17: '以奔驰汽车为题材的广告剪辑练习，结合车身、内饰、驾驶场景与传统建筑画面。',
  W19: '一支关于女孩与蝴蝶相遇的视觉叙事练习。',
  W18: '按十二时辰的顺序，串联金堂的风光、建筑、美食与日常生活。',
  W20: '以自然堂为题材的 AI 视频剪辑练习，画面以雪山、湖泊等自然景观为主。',
};
