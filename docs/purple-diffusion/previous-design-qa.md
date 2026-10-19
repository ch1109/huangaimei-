# 首页悬挂作品卡验收

日期：2026-10-19。范围：按用户提供的视频修改首页，展示四部作品，并实现悬停、翻面和播放。

## 视觉依据与比较方法

- source visual truth path：`docs/home-stack-reference/reference.mp4`，用户提供的视频，1170 × 814，10.92 秒。原始路径为 `D:/xwechat_files/wxid_d0cdhx7yr49e22_fee7/msg/video/2026-10/7499d10045789f95be07b910f065196e_raw.mp4`。
- 选择视频 6.7 秒的第二张卡片背面作为状态依据：`native-6.7.png`。另查看 0、1、2.2、4.5、9.5、10.7 秒的原尺寸帧，确认轻微晃动、翻面及虹彩效果。
- implementation screenshot path：`reference-size-final.png`，1170 × 892 CSS px、devicePixelRatio=1。现有网站导航高 78px，裁去导航后得到 `component-final.png`，1170 × 814，与视频内容区域保持同一尺寸。页面 clientWidth=1155；右侧 15px 滚动条不属于设计差异。
- state：第二张作品卡片显示背面，其余三张显示正面，首页顶端。视频人物内容换为已有的真实作品内容，姓名、职位、二维码没有复制到作品集。
- full-view comparison evidence：`comparison-final.png`。源图和组件截图同置一张图内，等比缩放到各 900px 宽，实际打开比较。
- focused region comparison evidence：`comparison-cards.png`。双方裁取相同的 (80,210)–(1090,670) 内容区域，检查连接点、封面、标题、背面文字和操作入口。
- 桌面完整首页：`desktop-final.png`，1440 × 1000，四张卡片均为正面。另检查 1280 × 800、768 × 1024、390 × 844、320 × 780。

## Findings 与迭代

1. [P2，已修复] 初稿在矮屏下卡片底部不完整，四张卡片也铺得过宽。证据：`desktop-initial.png`、`desktop-1440-initial.png`、`comparison-initial.png`。修复：舞台最大宽 1180px，同时根据窗口高度收紧；窄屏使用局部横向滚动；首页浅色背景至少铺满首屏。最终 1440 × 1000 的卡片底边分别约为 768、818、801、826px，均在首屏内；参考尺寸下卡片宽 214.5px，首卡左上角约 (105,283)，与视频首卡约 (110,280) 的位置接近。
2. [P2，已修复] 原深色页面的全局 hover 色在浅色首页上过淡。证据：`desktop-1280.png` 的品牌悬停颜色。修复：单独设置浅色首页的品牌、链接 hover 色和焦点描边，并加深小字。最终品牌悬停色为 rgb(89,65,110)，`desktop-final.png` 可见文字清楚。
3. 窄屏检查后将播放和底部操作的触控高度设为至少 44px。320px 下四张卡片背面均为 clientHeight=scrollHeight=334，无内容溢出。证据：`mobile-320-back-final.png`、`mobile-front-final.png`、`mobile-last-back-final.png`。
4. 最后一轮完整视图及卡片局部并排比较后，没有未解决的 P0/P1/P2。背面虹彩使用实际位图材质，随指针轻微移动；吊线是透明位图，随舞台同比缩放，连接在卡片顶部。

## 五项视觉检查

- Fonts and typography：沿用现代中文无衬线字体栈 Microsoft YaHei UI / Microsoft YaHei / PingFang SC / system-ui，保持直立字形。首页标题最高 54px，雾紫色第二行；作品名约 16–20px。参考的拉丁字体替换为中文字体，未添加手写体、重复英文口号或大段介绍。
- Spacing and layout rhythm：四张等宽卡片共享一条浅弧吊线，各自具有轻微不同的悬挂高度。导航和标题沿用页面边距，卡片组居中；参考尺寸下卡片位置和密度接近原视频。小于 1100px 使用横向滚动舞台，保证卡片文字大小；页面自身没有横向溢出。
- Colors and tokens：首页使用 #FCFBFD、#F1EFF3、#9685AC 与深灰文字；卡片背面使用低饱和虹彩材质。作品列表保持既有深色样式，进入作品区后导航同步切回深色。参考视频的白色留白、灰紫色文字与卡片材质是此次视觉依据。
- Image quality and asset fidelity：四张封面分别来自 W11、W01、W15、W18 的原片画面，按卡片画幅裁切；未替换为参考视频里的虚构人物。两个装饰位图为 `public/home/suspension-rig.png`、`public/home/card-sheen.png`，通过内置 ImageGen 生成，提示词和素材信息见 `asset-generation.md`。保留项目已有图标组件，没有新增模拟人物或假素材。
- Copy and content：仅保留黄爱美、视频拍摄与剪辑、真实作品名、类型、所属项目及负责内容；首页和导航没有作品总数、编号、重复英文介绍或新增履历事实。

## 交互与检查

- 四张卡片分别点击翻面，背面可播放、查看详情、返回封面；Escape 返回并恢复正面焦点。翻面本身不会播放视频。
- 真实浏览器点击花舞瞬间背面的播放按钮：原片 readyState=4、paused=false、播放时间持续增加。关闭后视频节点为 0，焦点恢复到 `hero-play-W11`。
- 手机宽度下可横向定位到第四张金堂十二时辰；浏览器观察到容器 scrollLeft=689，页面自身不溢出。键盘与点击选择的状态由同一组件维护。
- 查看全部作品跳到 #works，作品区顶端约 96px，导航切回深色；个人练习筛选显示 4 部，全部作品恢复 20 部，首页仍保留四张精选卡片。
- 390px、320px 下检查了正面、背面和最后一张卡片；768px 检查了平板布局。未做实体手机验证。
- 尊重 prefers-reduced-motion；该设置下取消倾斜、材质跟随和翻面过渡，仍能切换内容。
- 浏览器 error 日志为空。生产构建通过，生成 20 个作品分享页面；4 个测试文件、26 项测试全部通过；git diff --check 无空白错误。
- 本地服务运行于 http://127.0.0.1:5173/，没有部署外部托管。

## Follow-up Polish

- [P3] 视频中的绳线带有细小形变；此版保留固定吊线与卡片顶部的弹性转动，没有加入完整绳体物理模拟。
- [P3] 手机目前通过原生横向滚动浏览卡片，没有增加额外说明文字或分页计数。

## Implementation Checklist

- [x] 四部真实作品、浅色悬挂卡片和简短文案。
- [x] 指针倾斜、虹彩材质、翻面、播放、返回与焦点恢复。
- [x] 桌面、矮屏、平板和窄屏检查。
- [x] 同状态的完整视图与局部对照。
- [x] 构建与 26 项测试通过。

final result: passed
