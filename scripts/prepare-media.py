"""生成站内资源，保留原文件。使用已安装的 ffmpeg / ffprobe。"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess, json

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public/media'
DEST.mkdir(exist_ok=True)
FEATURED = {'W11': 8, 'W01': 2, 'W15': 12, 'W18': 8}

def run(*args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)], check=True)

def prepare(path):
    wid = path.stem
    info = json.loads(subprocess.check_output(['ffprobe', '-v', 'quiet', '-show_streams', '-show_format', '-of', 'json', str(path)]))
    video = next(s for s in info['streams'] if s['codec_type'] == 'video')
    seconds = float(info['format']['duration'])
    start = FEATURED.get(wid, 2)
    poster = DEST / f'{wid}.webp'
    run('-ss', start, '-i', path, '-frames:v', 1, '-vf', 'scale=720:-2', '-quality', 84, poster)
    output = DEST / f'{wid}.mp4'
    if not output.exists():
        if max(video['width'], video['height']) <= 1280 and int(info['format']['size']) / seconds < 170000:
            run('-i', path, '-c', 'copy', '-movflags', '+faststart', output)
        else:
            run('-i', path, '-vf', 'scale=w=min(1280\,iw):h=min(1280\,ih):force_original_aspect_ratio=decrease:force_divisible_by=2', '-c:v', 'libx264', '-preset', 'fast', '-crf', 25, '-maxrate', '1400k', '-bufsize', '2800k', '-threads', 2, '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', output)
    data = {'poster': f'/media/{wid}.webp', 'video': f'/media/{wid}.mp4', 'width': video['width'], 'height': video['height'], 'seconds': round(seconds, 3), 'bytes': output.stat().st_size}
    if wid in FEATURED:
        run('-ss', start, '-i', path, '-t', 6, '-an', '-vf', 'scale=w=min(480\,iw):h=min(600\,ih):force_original_aspect_ratio=decrease:force_divisible_by=2,fps=24', '-c:v', 'libx264', '-preset', 'fast', '-crf', 27, '-threads', 2, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', DEST / f'{wid}-preview.mp4')
        data['preview'] = f'/media/{wid}-preview.mp4'
    print(f'{wid}: {video["width"]}×{video["height"]}, {seconds:.2f}s, {output.stat().st_size / 1048576:.2f}MB', flush=True)
    return wid, data

with ThreadPoolExecutor(max_workers=3) as pool:
    media = dict(pool.map(prepare, sorted((ROOT / 'assets/originals').glob('W*.mp4'))))
(ROOT / 'src/data/media.json').write_text(json.dumps(media, ensure_ascii=False, indent=2) + '\n')
