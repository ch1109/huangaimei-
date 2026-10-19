# 本轮素材记录

## 背景

用户依据：同目录 user-reference.jpg，只取 Finova 网站背景色与光线位置。
生成工具：内置 ImageGen，参考图编辑，非透明背景。
原始生成文件：C:/Users/10679/.codex/generated_images/01a14f25-f986-7130-b177-cd0aea96e3ab/exec-aa1f0749-d52a-43e0-8612-6fbdd6ef8d09.png。
使用文件：public/theme/purple-diffusion.webp，1536 × 1024，26,364 字节。Pillow quality=94 转为 WebP；CSS saturate(.82) brightness(.76) 控制背景亮度。图中无文字、组件或卡片。

提示词原文：

```text
Create ONLY the clean background image for a website, faithfully extracting the BACKGROUND COLOR AND LIGHTING DIRECTION of the inner Finova website shown in the supplied screenshot. This is a background asset, NOT a website mockup. Remove ALL text, logos, interface, panels, cards, buttons, numbers, symbols, frames, device bezel, outer screenshot margins and bottom home indicator. Fill the entire canvas edge to edge with the background itself. Landscape 1536 x 1024.
Match the inner website's deep near-black center with two smooth diffuse PURPLE glows: one broad vertical lavender-violet light field entering the UPPER RIGHT EDGE, the other entering the LOWER LEFT CORNER. Strongest purple color is muted luminous #754DCF near the far right upper edge and #7042C5 at the bottom-left edge, blending smoothly through #35214F and #130D1E into almost pure black #030305. The purple should feel like the reference's soft defocused light, more saturated violet than pale pink, sophisticated and minimal. Broad blurred transitions; no distinct circles, blobs, streaks, waves, rings, hard lines, illustrated smoke, stars, particles, grain, blue or cyan. Most of the center, upper-left and lower-right must remain nearly black so white interface text stays readable. The upper-right glow fills roughly the outermost 25 percent of the width, extending downward to mid-height; lower-left glow fills the outermost 20 percent, extending up from the bottom. No bright white spot anywhere, and no colors lighter than the intended muted violet. Keep the reference's relative brightness and black negative space. This is a flat smooth raster background field used directly behind a real portfolio UI.
```

## 视频第一帧

- 来源：public/media/W11.mp4、public/media/W15.mp4。
- 输出：public/home/W11-first-frame.webp、public/home/W15-first-frame.webp，均 720 × 1280。
- 命令：ffmpeg -hide_banner -loglevel error -i public/media/W11.mp4 -frames:v 1 -quality 92 -y public/home/W11-first-frame.webp，W15 同理，没有 -ss 偏移。
- 原始内容、黑边及文字未改，在既有近方形画框中 object-fit: cover。W11 object-position center 60%，W15 center 58%，保留中文标题。
- 只更换红框标出的两张首页卡片，包括翻面的小图；作品库封面包装与原始视频未改动。
