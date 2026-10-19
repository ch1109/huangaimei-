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
