"""Extract original-film frames referenced by case-studies.json; no AI-generated imagery."""
from pathlib import Path
import json, os, subprocess
root = Path(__file__).resolve().parents[1]
bundled = root / '.tools/video-decoder/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
ffmpeg = os.environ.get('FFMPEG_PATH') or (str(bundled) if bundled.exists() else 'ffmpeg')
for case in json.loads((root / 'src/data/case-studies.json').read_text(encoding='utf-8')):
    for moment in case['moments']:
        target = root / 'public' / moment['image'].lstrip('/')
        target.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-ss', str(moment['seconds']), '-i', str(root / 'public/media' / (case['workId'] + '.mp4')), '-frames:v', '1', '-vf', 'scale=480:-2', '-quality', '85', str(target)], check=True)
        print(case['workId'], moment['time'], target.name)
