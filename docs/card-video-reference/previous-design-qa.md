# 紫黑弥散背景与首帧封面验收

日期：2026-10-19。范围：全站参考紫黑背景，保留浅色卡片并增加轻微透底；首页花舞瞬间、夏加尔改用视频第一帧。

## Findings 与迭代

- [P2，已修复] home-initial.png 中原裁切位置截断了封面中文标题。将 W11 的 object-position 调为 center 60%，W15 调为 center 58%。重新捕获 home-final.png，并与用户原图同图比较，中文标题已完整显示。
- 最终没有未解决的 P0/P1/P2。Finova 图片只提供背景颜色与光线方向，不复制其排版文案。保留浅灰卡片、虹彩背面及悬挂排布是用户明确要求的差异。

## 比较依据

- source visual truth path：docs/purple-diffusion/user-reference.jpg，2532 × 1170。原文件为用户提供的 D:/xwechat_files/wxid_d0cdhx7yr49e22_fee7/temp/RWTemp/2026-10/0ee3bd158eed7664b5b35c203a92dfdb/5e4515caa24727adec573a1e57e1b4b8.jpg。
- 两张封面依据：同目录 cover-reference-W11.png、cover-reference-W15.png、cover-targets.png。实际素材从 public/media/W11.mp4 与 W15.mp4 解码第一帧，没有取后续画面或生成封面。
- implementation screenshot path：docs/purple-diffusion/home-final.png。viewport 1440 × 1000 CSS px，devicePixelRatio=1；浏览器截图接口返回可视内容区域 1425 × 990 像素。state：首页顶端、四张正面、静止状态。
- full-view comparison evidence：comparison-background.png。参考图裁取网站本身 (562,146)–(1968,1025)，排除外框和设备边缘，与真实首页等比缩小并排。比较右上、左下紫色光域和黑色中心，不比较不同产品布局。
- focused region comparison evidence：comparison-covers.png。用户两张原图与最终两张卡片同图展示。保留近方形画框，中文标题完整；上部 EFFIAN 标识及部分画面边缘因画幅差异受到裁切，这是保留现有布局的结果。
- 先检查 home-initial.png，修改后重新捕获 home-final.png，再查看上述两个组合对照。旧版卡片验收保存在 previous-design-qa.md。

## 五项视觉检查

- Fonts and typography：沿用 Microsoft YaHei UI / Microsoft YaHei / PingFang SC / system-ui 字体栈、字号、字重与换行。正文、导航、焦点采用白色及浅紫；浅色卡片保留深灰字，图片和文字 opacity 为 1。
- Spacing and layout rhythm：四张卡片的尺寸、位置、间距、圆角和标题结构未改。1440 × 1000 下四张卡片完整可见。390 × 844 使用已有局部横向滚动，body.scrollWidth=375，小于 viewport 390；手机背面 clientHeight=scrollHeight=334，无内容溢出。
- Colors and tokens：共享固定背景层，黑色中心、右上与左下紫色弥散，CSS saturate(.82) brightness(.76) 控制亮度。导航、作品、关于、联系和详情使用同一色系。卡片底色仍为 rgb(241 239 243)，alpha .9；虹彩材质单独以 .9 透明度绘制。依据背景最亮像素和滤镜近似计算，常用小字对比约 4.8:1 以上，仅为辅助估算，非完整无障碍审计。
- Image quality and asset fidelity：背景位图 public/theme/purple-diffusion.webp 保留参考的紫色方向与黑色负空间，没有额外图形或文字。首帧为 720 × 1280 WebP。W01、W18 原封面、吊线、虹彩位图与图标组件保留。生成素材与提取命令见 asset-generation.md。
- Copy and content：没有新增营销语、描述、计数或个人经历；作品标题及负责内容保留原始数据。

## 浏览器证据与检查

- home-final.png 为四张正面，card-back.png 为原虹彩背面和播放、详情入口。
- works.png、about.png、contact.png 展示连续背景及文字。运行时检查全部 section 背景透明，使用同一 body 背景层。
- detail-modal.png：首页翻面后点击查看详情，详情显示同色背景，关闭返回卡片。detail-direct.png：单独打开 /works/flowers-in-motion，也采用紫黑背景。
- mobile-front.png：390 × 844 首页，首帧中文标题完整可见。手机翻面后检查高度没有溢出；mobile-back.png 记录翻面过程，不作为静止状态视觉依据。
- 首页实际图片 src 为 /home/W11-first-frame.webp、/home/W15-first-frame.webp；另两张为 /media/W01.webp、/media/W18.webp，opacity 均为 1。
- 浏览器 error 日志为空。4 个测试文件、26 项测试通过，生产构建通过并生成 20 个作品分享页面。没有实体手机验证。

## Implementation Checklist

- [x] 全站背景、导航和两种详情页统一配色。
- [x] 保留浅色卡片与虹彩背面，仅材质透底。
- [x] 两张实际首帧替换，调整裁切并对照检查。
- [x] 桌面、手机、详情、控制台、测试与构建检查。

final result: passed

## 首页卡片与留白后续调整

2026-10-19 用户要求首页吊挂卡片作为主要设计放大，并减少页面之间的留白。移除首页按视口撑高的最小高度，舞台上限提高至 1440px，收紧作品、关于和联系区间距。大屏卡片线性尺寸增加约 22%，卡片至数据区由约 516px 缩至 97px。矮屏与手机分别检查显示范围、翻面内容和整体横向溢出；最终生产构建通过。最新记录及截图见 `docs/spacing-refinement/验收记录.md`。

## 后续分类与文字边界调整

2026-10-19 按用户最终指定，分类改为 IP拍摄剪辑、保司定制与通用模板视频剪辑、艺术内容与人物故事剪辑、个人创作练习。桌面分类单行排列；窄屏按整个分类换行，每个标签文字保持单行。统一正文边界、左右留白与长标题换行，调整窄屏数据字号和联系标题。

最终证据与七种屏宽检查见 `docs/content-boundaries/验收记录.md`、`desktop-final.png`、`responsive-final.json`。所有分类均一行、抽检文字横向溢出为 0；模板分类正确显示两个模块八部作品；最新构建及 26 项测试通过，控制台 error 为空。

final result: passed

## 分类按钮方案一与统一圆角（2026-10-19）

用户选择方案一后，分类改为独立圆角底板，去掉分割线和下划线，浅紫渐变表示选中，提供真实悬停、键盘焦点和轻压反馈。源图为 docs/filter-buttons/option-1-reference.png（1672 × 941）；默认、悬停、选中三种状态的真实截图与源图同置于 comparison-states.png，已实际查看。桌面采用现有15px中文字号，概念图中的演示标题和状态说明不加入网站。

[P2，已修复] 768px时最后一项曾独占第二行，证据为 tablet-initial.png。减小该断点的按钮内边距，tablet-final.png 显示五项同排。浏览器点击分类分别得到IP拍摄2部、模板8部、艺术故事6部、个人练习4部、全部20部；键盘可切换，只有当前项显示浅紫选中层。尊重减少动态效果设置。最终对照没有未解决的P0/P1/P2。

按用户后续要求，将矩形形状统一为 --radius:12px。source visual truth path 为 docs/shared-radius/user-reference.png（996 × 912，用户局部截图，原页面视口未知）；implementation screenshot path 为 docs/shared-radius/desktop-works.png。viewport 为1440 × 1000 CSS px，DPR=1，截图输出1425 × 990像素。state 为原截图对应的四张模板视频封面。full-view comparison evidence 为 comparison-full.png；focused region comparison evidence 为 comparison-corners.png，确认直角变为12px圆角且图片不变。组合图等比归一化，不依据不同源视口的缩放差异评价列宽。

五项检查：字体及文案沿用现有内容；间距与媒体尺寸保持现有规则；颜色沿用紫黑背景及浅紫选中；图片与原片保持来源且沿圆角正确裁切；所有非圆形卡片、矩形播放器和照片接入共享12px圆角。20张封面及图片、首页卡片、分类、人物照片的实测均为12px，溢出裁切开启；390px下弹窗及播放器也为12px，页面没有横向溢出。原有圆形控件保持圆形。

详情视频实际可播放，关闭后视频节点清除；浏览器error日志为空。生产构建及4个文件26项测试通过，未做实体手机验证。详细记录见 docs/shared-radius/验收记录.md，前一版完整QA保存在同目录 previous-design-qa.md。

final result: passed


## 冷白通透卡片（2026-10-19）

用户选择最新白色方案2，并要求卡片质感更透明。按选定的冷瓷白方向，先生成一张增加通透感的修订效果，再在现有网页中调整卡片正反面材质；保留现有布局、素材、文案、尺寸、圆角与交互。

- source visual truth path：`docs/cold-white-glass/selected-white-2.png`；透明修订目标为 `docs/cold-white-glass/refined-glass-reference.png`，均为1536×1024像素。
- implementation screenshot path：`docs/cold-white-glass/desktop-front.jpg`；桌面背面为 `desktop-back.jpg`，手机正反面为 `mobile-front.jpg`、`mobile-back.jpg`。
- viewport：桌面1536×1024 CSS px，DPR=1；截图输出1521×1014像素，约0.9902等比缩放。手机390×844 CSS px，输出375×812像素。
- state：首页 `/#selected`，四张卡片正面；另检查第一张卡片翻面、进入详情和关闭返回。
- full-view comparison evidence：`docs/cold-white-glass/comparison-full.jpg`。源图与实拍同图并排，实际网页保留完整导航及原有响应式尺寸，因此源图裁过的顶部和AI图中轻微位置偏差不作为本次颜色修改的布局目标。
- focused region comparison evidence：`docs/cold-white-glass/comparison-card.jpg`。按实际DOM边界裁取第一张卡片，两张卡片等比归一到317×440像素后同图比较，检查底板、字色、分割线和按钮。

### Findings 与修复历史

- [P2，已修复] 首次辅助字色 `#5b6070` 在86%底板叠加黑色的保守估算对比约4.28:1。改为 `#535869` 后同条件估算为4.83:1。该估算为辅助检查，不是完整无障碍审计。修复后的 `runtime.json` 确认实际字色与CSS一致。
- 首轮底板过于平整，补用已有 `/home/card-sheen.png`，正反面均以12%透明度轻量绘制；保留白色边缘内高光。初版证据为 `desktop-initial.jpg`、`comparison-card-initial.jpg`；修改后重新截图并查看最终两张组合对照。
- 最终对照未发现需要继续修改的P0/P1/P2问题。生成效果图对人物和图片细节有轻微重绘，网页继续使用原始视频帧，这是保留素材真实性的明确选择。

### 五项视觉检查

- Fonts and typography：沿用现有中文字体栈、字号、字重、行高及单行标题适配；标题深灰 `#252733`，辅助文字 `#535869`。不把卡片整体设为半透明，文字与图片的opacity实测均为1。
- Spacing and layout rhythm：保持四张吊挂卡片位置、大小、间距与共享12px圆角。1536px下四张正面完整显示；390px保持原有卡片区横向滚动，页面和body宽度375px，没有整页横向溢出。手机背面clientHeight=scrollHeight=365px。
- Colors and tokens：底板 `rgb(246 248 253 / .86)`，背景模糊22px并降低透入色彩饱和度；淡色箭头按钮、白色边线和弱高光配合冷白材质。背面使用相同底板，原高饱和虹彩层从90%降到12%，避免翻面后变为另一套颜色。不支持背景模糊时底板提高到96%保证阅读。
- Image quality and asset fidelity：保留W01、W03原片海报、W11/W15开场帧、吊线与已有虹彩位图。没有替换真实视频内容，没有以新图覆盖交互组件。图片透明度实测均为1，素材尺寸及裁切不变。
- Copy and content：作品标题、分类、负责内容及播放/详情文字完全沿用现有数据。

### 浏览器与构建检查

- 已在IAB实际检查桌面和390px手机正面、翻面、Escape返回封面、详情打开和关闭返回。
- 运行时材质和图片透明度记录见 `docs/cold-white-glass/runtime.json`。
- 浏览器error日志为空。最终生产构建通过并生成20个作品分享页；本次为CSS材质修改，未新增测试或重复运行无关功能测试。未做实体手机和无backdrop-filter浏览器的实机验证。

### Implementation Checklist

- [x] 选定方案2的冷白色及通透修订效果已保存。
- [x] 卡片正反面统一冷白磨砂材质，真实图片保持不透明。
- [x] 修正小字对比并重拍同状态桌面对照。
- [x] 桌面、手机、翻面、详情入口和生产构建验证。

final result: passed


## 卡片背面恢复原方案（2026-10-19）

用户要求背面保留原方案。本次将冷白材质和字色覆盖限制在正面，恢复背面原有90%虹彩位图、透明底板、16px背景模糊、紫色小字与深紫播放按钮。正面的冷白底板、86%透明参数、淡色箭头按钮和12%弱纹理保持不变。

source visual truth path：`docs/spacing-refinement/desktop-card-back.jpg`（1425×990像素，原虹彩背面）；implementation screenshot path：`docs/original-card-back/restored-back.jpg`（1425×990像素）。两者对应1440×1000 CSS px、DPR=1的桌面布局，工具截图约0.9896倍等比缩放。state为W11翻到背面，旧截图W11位于第一张，现按已核定的作品顺序位于第三张；源图旧短标题、旧按钮圆角不作为本次材质恢复的目标。

full-view证据为上述两张完整截图；focused region comparison evidence为 `docs/original-card-back/comparison-back.jpg`，裁取同一作品背面并统一到302×421像素后，同图检查虹彩、字色和按钮颜色。实际查看了该组合图及当前完整截图，虹彩由淡粉、青绿、淡黄到紫的材质已恢复。

五项检查：字体字号与现有标题数据沿用，长标题继续按原有规则换行；卡片尺寸、间距、共享12px圆角及交互没有更改；背面色值和材质恢复到调整前规则，正面运行时参数与冷白方案一致；真实视频帧及原虹彩位图保持来源；没有新增或回退文案。所有卡片的正反面计算样式见 `docs/original-card-back/runtime.json`，背面纹理opacity=.9、播放按钮rgb(48,39,55)，正面底板rgba(246,248,253,.86)、纹理opacity=.12。

Findings：没有未解决的P0/P1/P2。生产构建通过，实际翻面验证完成。本次仅恢复背面原有颜色和材质，不重复运行无关功能测试。

Implementation Checklist：已恢复原背面；已确认当前冷白正面保留；已对照截图并构建通过。

final result: passed


## 全站动态背景（2026-10-19）

用户要求整体背景有动态感，颜色可以动态变化。复用现有 `public/theme/purple-diffusion.webp`，在body的两层固定背景上分别使用24秒与32秒的缓慢位移，蓝紫层以20秒周期淡入淡出。色相滤镜保持静态，仅动画transform与opacity；背景中心保持暗色，无新增JavaScript循环或依赖。

实现文件：`src/atmosphere.css`。两个背景层均不响应鼠标事件，向视口外扩展6%避免移动时露出边缘；手机沿用原有背景铺法。系统prefers-reduced-motion开启时关闭动画并恢复原静态紫色背景。

浏览器证据：`docs/animated-atmosphere/phase-a.jpg`、`phase-b.jpg`为同一1440×1000 CSS px视口、不同时刻的真实截图，输出1425×990像素。两次计算样式记录在对应json中，位移矩阵持续变化，蓝紫层opacity由0.182548变化为0.577913，确认动画实际运行。`color-phases.jpg`为两张真实截图的并排对照。`about.jpg`显示同一动态背景在关于区连续呈现，正文仍清晰；`mobile.jpg`为390×844 CSS px手机检查。

五项检查：本次没有更改字体和文案；布局与卡片尺寸不变，手机页面宽375px且视口390px，没有新增横向溢出；背景色温在紫至蓝紫间平滑变化，中心负空间保持黑色；复用原背景位图，未改照片与视频素材；正面冷白通透和背面原虹彩样式的规则均保留。原生作品详情弹窗继续保留自身已有的背景材质。

浏览器error日志为空；生产构建通过并生成20个作品分享页。媒体查询的静态回退规则已代码检查，当前浏览器系统设置为非减少动态效果，未进行系统设置切换或媒体仿真。未新增与实现重复的CSS测试，未做实体手机性能测量。

Findings：没有未解决的P0/P1/P2。Implementation Checklist：背景流动与变色已实现；实际不同时刻截图及运行时参数已核对；桌面其他区块和手机已检查；构建通过。

final result: passed


## 关于我照片改为白衣树影（2026-10-19）

用户框选照片对比图第4张“白衣树影”，将关于我的正式照片从米奇合影替换为该照片。直接复用本地已保存的 `public/profile/portrait-options/04-tree.webp`（1200×1800），保留原照片内容。生成480/960像素宽的WebP，并无重压缩复制1200像素版本，供 `src/Home.tsx` 的响应式srcSet使用；原照片和其他候选图保留。

裁切沿用用户选中预览的object-position:50% 48%，图片替代文字同步为“黄爱美穿白色上衣站在树影下”。网页画框尺寸和布局保持现有规则。

实际浏览器验证：1440×1000下图片393×490px，桌面截图 `docs/tree-portrait/desktop.jpg`；390×844下图片225.25×300.33px，手机截图 `docs/tree-portrait/mobile.jpg`。均已加载正确白衣树影照片，脸部及上半身完整，手机页面宽375px，无新增横向溢出。生产构建通过，未为素材替换新增无关测试。

final result: passed

## 首页采用选定封面（2026-10-19）

source visual truth path：`docs/selected-home-covers/selected-1.png`（727×1047）及 `selected-2.png`（695×945），对应用户明确选择的W01与W03卡片封面。本次目标仅为卡片内的海报，沿用网页已有四卡布局、冷白正面、虹彩背面、文案和交互。

implementation screenshot path：`docs/selected-home-covers/desktop.png`，1440×1000 CSS px、DPR=1，输出1425×990像素。state：首页四张卡片正面。全景组合对照为 `comparison-full.png`，海报区域对照为 `comparison-covers.png`：按实际DOM坐标裁取浏览器图片区域，并以1425/1440和990/1000归一截图坐标；参考图等比缩放，不拉伸为方形。源图是单张卡片局部截图，不据此重新设计整页布局或四卡尺寸。

### Findings 与比较历史

- [P2，已修复] 第一轮1280×720截图 `desktop-initial.png` 中，原来的object-fit:cover裁去了W01底部标题。将这两张方形海报改为contain，深蓝底色补齐窗口余量，保留12px圆角。重新拍摄同一1280×720视口的 `desktop-1280-final.png`，底部标题完整；1440px最终截图和390px截图再次确认完整海报未被窗口裁切。各截图页面滚动位置不同，局部被粘性导航遮住的部分属于滚动状态，不作图片裁切判断。
- 最终组合图中，人物动作、手势、背景主题及标题层级与选定方向一致；方形素材准备时扩展了背景边缘，照片细节经过生成式重建，并非逐像素提取。标题保留在位图内，没有另用HTML模拟。
- 未发现本次封面替换范围内仍需修复的P0/P1/P2问题。

### 五项视觉检查

- Fonts and typography：封面沿用选定的大字号、底部左对齐、白色及浅紫主标题；网页完整标题继续使用现有单行适配规则，未新增宣传文字。
- Spacing and layout rhythm：四卡顺序仍为W01、W03、W11、W15。仅前两张使用contain保证完整海报；窗口和卡片共享12px圆角，现有悬挂尺寸与位置不变。
- Colors and tokens：保留深紫海报、冷白卡片及当前网站背景；仅两张海报窗口的空余区域使用#101324衬底。没有覆盖其他并行修改的背景或卡片材质规则。
- Image quality and asset fidelity：W01为1254×1254，W03为1024×1024。网页采用quality94的WebP，分别151718、130628字节；PNG母版在 `assets/cover-designs/home-selected/`，默认生成原件保留。海报与真实视频播放资源分开，不改动原片。
- Copy and content：W01为“高客线上买保险 / 为什么 / 非要找你？”，W03为“泰盈人生 / 低利率时代 / 如何规划未来？”。完整作品标题、职责、视频与作品区原封面数据保持现有内容；W11、W15继续用已选第一帧。

### 响应式及功能

- 390×844 CSS px下，页面clientWidth=scrollWidth=375px，无整页横向溢出，保留卡片区横向浏览。证据为 `mobile-W01.png`、`mobile-W03.png`。
- W03翻面clientHeight=scrollHeight=365px，负责内容与按钮没有溢出。
- 实际点击两张卡片翻面、播放、关闭详情并返回封面；分别播放 `/media/W01.mp4`、`/media/W03.mp4`，两者paused=false。
- 浏览器error日志为空。生产构建通过，封面映射及原有交互测试通过。没有新增镜像实现的测试；已更新原有首页素材断言。
- 未做实体手机测试。视口覆盖已在结束前重置，首页预览保留。

### 素材制作要求

使用内置Image Gen分别从两张选定参考图准备独立方形海报：移除外层卡片、元信息、吊线和页脚；保留人物身份、W01持笔姿态、W03双手低位交叠姿态、深紫背景、保险/2026大字、相关场景及底部标题；只扩展少量背景以适配方形，禁止裁去人物或标题。后续仅做WebP格式压缩。最终使用文件为 `public/home/W01-selected-cover.webp` 和 `public/home/W03-selected-cover.webp`。

### Implementation Checklist

- [x] 两张选定封面已用于首页前两张卡片及其背面小图。
- [x] 修复窗口裁切，保留完整文字及统一圆角。
- [x] 桌面、窄屏、翻面与原视频播放已检查。
- [x] 组合对照与构建验证完成。

final result: passed

