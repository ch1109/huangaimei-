# 曜石影院：全站视觉统一验收

日期：2026-10-18。
范围：用户选择方案一；保留已认可的作品排布、统一后的现代无衬线字体、原始素材和全部内容，将首页、作品、关于、联系、弹窗及独立详情统一为深色视觉系统。

## 视觉依据、范围与归一化

- source visual truth path: `docs/theme-options/01-obsidian-cinema.png`，941 × 1672 像素，用户本轮明确选择的方案一。
- 这是配色和章节衔接概念图，节选了首个作品模块，未包含完整经历和其余作品。按用户先前明确要求保留现有布局及全部内容；不照抄概念图中的衬线斜体、重画封面、压缩后的章节高度或不准确文案。
- 桌面主验证 viewport: 1440 × 1400 CSS px，devicePixelRatio=1，documentElement.clientWidth=1425。工具返回的截图为 1425 × 1385；未做双倍密度放大。
- 关于、联系及初始详情验证 viewport: 1440 × 1000，截图 1425 × 990（详情弹窗截图为 1440 × 1000）。
- 手机 viewport: 390 × 844，详情截图同尺寸；首页有滚动条时内容宽 375。另验证 320 × 780、768 × 1024，以及默认桌面宽度 1920。
- state: 首页全部作品，4 个章节 / 6 个项目模块 / 20 部作品；作品对照定位于公司官方账号首个模块；关于定位个人介绍；联系定位页尾；详情分别验证竖屏艺术片和横屏个人练习。
- implementation screenshot paths: `docs/obsidian/desktop-hero.png`、`desktop-works-full.png`、`desktop-about.png`、`desktop-contact.png`、`desktop-detail.png`、`mobile-works.png`、`mobile-detail-fixed.png`、`tablet-about.png`、`direct-detail.png`。
- full-view comparison evidence: `docs/obsidian/comparison-overview.png`。左侧为完整方案图，右侧明确标为各章节的浏览器截图拼接，未伪称整页等长对比。图像均保持纵横比，按 640px 宽归一化。
- focused region comparison evidence: `comparison-works.png` 与 `comparison-about.png`，分别裁出对应内容区域，双方按 860px 宽等比显示。已实际打开合成对照图，比较配色、字体层次、作品网格、人物照片及章节分隔。原概念密度与既有布局的差异属于上述明确约束，不作为逐像素误差。
- 上一轮根目录报告保存在 `docs/obsidian/previous-design-qa.md`。

## Findings 与比较历史

1. 初轮 [P2] 手机横屏播放器撑宽详情页。
   - Location: `.player-shell.wide`、390px 手机详情《汽车广告视觉短片》。
   - Evidence: `mobile-detail.png`；`.detail-inner.clientWidth=357`，`scrollWidth=392`。通用的 200px 最小高度与 16:9 比例令播放器宽约 356px，超过实际内容宽 321px，产生横向滚动。
   - Fix: 明确横屏播放器 `width:100%;min-height:0`，保持原 16:9；下一件作品的文字容器允许收缩和换行，为旋转箭头保留边距。
   - Post-fix evidence: `mobile-detail-fixed.png`；同一视口和作品、同一项目简介阅读状态，内层 `clientWidth=scrollWidth=357`，播放器宽 321px。已打开修复后截图；完整说明在容器内正常换行。`comparison-mobile-fix.png` 保存修复前后合成证据。
2. 最终视觉对照：首页、作品、关于、联系均为 `rgb(23,23,27)`；四个作品章节共用 `#C6B2DE`。无浅色大块背景、跨章节色系漂移或不可读的旧深色正文残留。无尚未解决的 P0/P1/P2。

## 五项视觉检查

- Fonts and typography：所有可编辑中英文和数字均使用同一 `Microsoft YaHei UI / Microsoft YaHei / PingFang SC / system-ui / sans-serif` 字族。保留用户要求的正体无衬线，不回退概念图的衬线斜体。标题、正文、编号与辅助文字通过字号、字重分层；关于正文提升至桌面 14px、手机 13px。封面及原片内嵌文字保留原样。
- Spacing and layout rhythm：保留作品的左简介右双列、章节序号、六个模块、移动端单独适配个人练习的原有排布。导航、章节细线、留白共享同一节奏；关于和联系取消整块反色。320 / 390 / 768 / 1440 宽均无页面横向溢出，已检查手机横屏详情的内部宽度。
- Colors and tokens：`src/obsidian.css` 集中定义底色 #17171B、抬升表面 #212127、主文字 #F2F0E9、正文 #BDB9C6、辅助文字 #A59FAD、雾紫 #C6B2DE。所有筛选选中、链接、焦点、关闭按钮和播放器状态共用同一色系。计算纯色表面的正文对比度 9.29:1、辅助文字 6.95:1；详情正文 8.33:1；详情辅助文字 6.22:1；筛选选中态 8.70:1。这些是指定颜色对的检查，不代表完整可访问性认证。
- Image quality and asset fidelity：复用所有现有视频、封面和原始个人照片，未重新生成、拉伸、替换素材。原图清晰度和宽高比保持原来设置。保留真实帧和已认可的照片构图；概念图重绘或不同裁切不覆盖真实素材。
- Copy and content：数据文件未修改。浏览器确认四个章节、六个模块、20 张作品卡及20个详情入口；项目简介、职责、个人练习标识和制作说明完整保留。六个模块均维持飞书原文入口。

## 交互与验证

- 分类实际点击：保司与通用模板 8 部；艺术与人物故事 6 部；个人练习 4 部；恢复全部 20 部。
- 键盘 Tab 聚焦分类按钮：雾紫 2px 实线轮廓，offset 5px，清晰可见。
- 竖屏详情：深色抬升表面、标题、返回/关闭、项目简介正常。点击《花舞瞬间》播放，readyState=4、paused=false、currentTime=10.64 秒、error=null；关闭后返回作品区。
- 横屏手机详情：播放器和长项目说明正常；修复后无内部横向溢出。
- 直接访问 `/works/insurance-online`：独立详情背景 #212127，页面外围 #17171B。
- 首页导航、关于、联系锚点实际点击检查；简历链接仍为 `/resume/huang-aimei.pdf`，邮件入口保留。
- 动效：关于与经历淡入和作品统一为 18px 位移 / 0.55s；保留既有 `useReducedMotion` 与 CSS 减少动态效果规则，链接新增微动也受该偏好约束。
- 浏览器 error 日志：空。
- 现有自动化测试：3 个文件 / 23 项通过。
- TypeScript、生产构建通过；最后手机修复后重新构建通过，生成20个作品分享页面。

## Follow-up Polish 与边界

- 无阻挡交付的 P3 项。未对全部20部作品完整播放至片尾，也未在真机 Safari/Android 验证；本轮完成桌面浏览器响应式与代表性播放验证。
- 没有发布到外部托管；保留用户已启动的本地服务和浏览器预览。

## Implementation Checklist

- [x] 首屏、作品、关于、联系同底色与同一强调色
- [x] 正文、筛选、焦点、播放器、弹窗和独立详情同步调整
- [x] 保留布局、原素材、20 部作品与完整介绍
- [x] 手机横屏溢出修复并复验
- [x] 全幅和局部合成对照已打开检查
- [x] 构建、现有测试、浏览器主流程验证

## 后续调整：移除飞书原文入口

按用户截图要求，移除六个项目模块的“飞书原文”、详情底部的“飞书原作”及视频异常状态下的原作入口，保留重试和下一件作品操作。浏览器确认首页与详情中飞书链接均为 0，20 部作品仍完整显示。证据：`docs/obsidian/feishu-links-removed.png`。重新构建与现有 23 项测试均通过。

## 后续调整：统一动效与页眉

统一模块错峰入场、分类过渡、悬停和首屏视差，移除滚动时的大面积模糊；修复重复锚点滚动的干扰。页眉改为“黄爱美 / 视频拍摄与剪辑师”，移除“聊聊新作品”。详见 `docs/motion-refinement/验收记录.md` 与本轮浏览器截图、动效录制。最终构建和24项测试通过；没有改变原始作品数据、配色或网格。

final result: passed
