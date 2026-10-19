# 卡片形态与交互动效验收

2026-10-19。本轮仅按参考视频修改首页四张卡片，连接线按用户要求保留。上一次验收已备份至 docs/card-video-reference/previous-design-qa.md。

## 参考与实现证据

source visual truth path：D:/xwechat_files/wxid_d0cdhx7yr49e22_fee7/msg/video/2026-10/7499d10045789f95be07b910f065196e_raw.mp4。视频为1170×814，10.92秒。已查看抽帧序列、3.3秒正面与4.5秒背面；解码帧为 docs/card-video-reference/reference-front.jpg 和 reference-back.jpg。原站布局和内容以用户附图 C:/Users/10679/AppData/Local/Temp/codex-clipboard-fd8b7675-20a8-4764-9e6c-90f3b60f2603.png 为依据。

implementation screenshot path：docs/card-video-reference/desktop-final.png、desktop-back.png、desktop-front-hover.png、desktop-back-hover.png。
viewport：1930×1244 CSS px，DPR=1；工具保存1915×1234像素，约0.992倍缩放。源视频解码帧1170×814原生像素，无额外密度缩放。
state：四张正面、W11背面、正反面悬停。

full-view / focused region comparison evidence：已实际打开 docs/card-video-reference/comparison.jpg，同图包含参考全景、实现精选区以及正面和虹彩背面局部。全景以580px宽、局部以270px宽等比展示，不拉伸。参考约0.72的卡片宽高比与原站相同；背景、作品图片、中文内容、布局与连接线属于用户要求保留的产品上下文，不按视频整页替换。

## 实现

- 四张卡片从顶部中心独立轻摆，采用不同初始偏角、周期与相位。悬停卡片暂停自动摆动，其余继续。
- 正反面都跟随鼠标倾斜，俯仰最高±8°，水平偏转为初始角叠加±14°，平面旋转为初始角叠加±2.5°。弹簧回位，悬停轻微放大至1.018。
- 翻面采用0.26秒转出与0.58秒回弹转入，在90°侧面切换内容，带轻微过冲。动画期间禁用实际按钮，避免误触。
- 继续使用已有 /home/card-sheen.png；正面为90%冷白底板与24%弱虹彩，背面保留原虹彩。反光位置随角度变化。
- 可见卡片参与倾斜；正反面的原生点击入口保持稳定。背面展示动作对辅助技术隐藏，实际操作层提供播放、详情和返回按钮。点击范围覆盖摆动边缘。
- 减少动态时关闭摇摆、倾斜、缩放与翻面过渡；触屏不执行鼠标跟随。保留原横向滚动和键盘路径，高对比模式显示原生按钮。

## 五项视觉检查

字体与排版：沿用现有中文字体、层级和完整标题，长标题规则不变，背面标题正常换行。
间距与布局：四张卡片尺寸、错落位置、封面裁切和原圆角体系保留；各断点的点击层与可见背面使用相同内边距和按钮高度。
颜色与材质：珍珠白半透明正面与柔和粉、青、黄、紫色虹彩背面符合参考方向；紫黑背景按范围保留。
图片质量：使用真实作品封面与首帧，没有替换为参考人物或二维码，没有新增拉伸、锯齿和错误裁切。
文案：作品名称、机构、负责内容及原有操作文案保留，无新增无关内容。

## 功能与连接线

实际IAB浏览器操作四张卡片完成正面→背面→返回，最终均为phase=idle、flipped=false。背面悬停时三个按钮中心的elementFromPoint均命中对应按钮，悬停卡片自动摆动暂停，其余继续。

W11播放进入 /works/flowers-in-motion，原片 /media/W11.mp4 的paused=false、readyState=4，时间正常增加。查看详情没有创建video元素；关闭后焦点返回原入口，Escape可返回封面。桌面没有页面横向溢出，浏览器error/warn日志为空。

src/components/SuspensionRig.tsx修改前后SHA256相同：551B3BE2664E209B604F4C9FD2570DE764B59FE28CBF483ECA4584310ECA6DE7。连接线CSS、卡片位置和挂点DOM均保留，四个吊线端点的x/y实测误差均为0，见runtime.json。未改线路形状、颜色、粗细或节点。

pnpm build通过；pnpm test的5个文件、39项测试通过。

## 比较历史与结论

第一次完整组合图对照未发现本次范围内的P0/P1/P2视觉问题。实施中补充原生禁用状态、稳定点击层和摆动边缘点击范围，并复查卡片循环操作及构建。组合图第二次仅修正参考背面取景范围，不涉及页面修改。

未用手机浏览器或系统级减少动态设置进行设备模拟；减少动态和触屏功能路径由现有DOM测试覆盖，不将桌面结果表述为手机实机验收。

Findings：无未解决的P0/P1/P2。
Implementation Checklist：材质、鼠标跟随、独立轻摆、回弹翻面、稳定按钮和原连接线保留均完成。

final result: passed

