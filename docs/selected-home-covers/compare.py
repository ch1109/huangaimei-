from pathlib import Path
import json
import shutil
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parent
sources = [
    Path('C:/Users/10679/AppData/Local/Temp/codex-clipboard-c6c919db-dc3c-4f11-8977-ccebc4f18eb7.png'),
    Path('C:/Users/10679/AppData/Local/Temp/codex-clipboard-ac77c061-dc85-43a6-bf25-1cc65af09ce2.png'),
]
for index, path in enumerate(sources, 1):
    shutil.copy2(path, root / f'selected-{index}.png')

desktop = Image.open(root / 'desktop.png').convert('RGB')
runtime = json.loads((root / 'desktop-runtime.json').read_text())
sx, sy = desktop.width / 1440, desktop.height / 1000
reference_boxes = [(36, 94, 683, 816), (38, 100, 656, 730)]
focus = Image.new('RGB', (1120, 336), '#e9e7ee')
draw = ImageDraw.Draw(focus)
for index, (source, box) in enumerate(zip(sources, reference_boxes)):
    target = Image.open(source).convert('RGB').crop(box)
    r = runtime[index]['image']
    implementation = desktop.crop((round(r['x']*sx), round(r['y']*sy), round((r['x']+r['width'])*sx), round((r['y']+r['height'])*sy)))
    for column, (im, label) in enumerate([(target, 'SELECTED'), (implementation, 'BROWSER')]):
        cell = index*2+column
        thumb = ImageOps.contain(im, (260, 280))
        x = cell*280+(280-thumb.width)//2
        y = 40+(280-thumb.height)//2
        focus.paste(thumb, (x, y))
        draw.text((cell*280+16, 15), f'{runtime[index]["id"]} {label}', fill='#292233')
focus.save(root / 'comparison-covers.png')

overview = Image.new('RGB', (1750, 740), '#e9e7ee')
d = ImageDraw.Draw(overview)
for index, source in enumerate(sources):
    thumb = ImageOps.contain(Image.open(source).convert('RGB'), (330, 660))
    overview.paste(thumb, (index*350+(350-thumb.width)//2, 50))
d.text((20, 16), 'SELECTED CARD REFERENCES', fill='#292233')
browser = ImageOps.contain(desktop, (1020, 690))
overview.paste(browser, (720, 50))
d.text((740, 16), 'BROWSER HOMEPAGE - EXISTING FOUR-CARD LAYOUT', fill='#292233')
overview.save(root / 'comparison-full.png')
print({'desktop': desktop.size, 'sources': [Image.open(p).size for p in sources]})
