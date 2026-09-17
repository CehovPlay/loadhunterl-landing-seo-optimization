# LoadHunter preloader → Telegram animated emoji

The animation is the site's own preloader — the one that holds the screen
before the landing opens — lifted from `index.html`
(`<!--lh-preloader-start-->` … `<!--lh-preloader-end-->`).

## What is reproduced, exactly
Same choreography, same curves, same relative delays as the CSS there:

| step | timing (index.html) | in the emoji |
|---|---|---|
| left wing flies in | 0.5s `cubic-bezier(.16,1,.3,1)`, delay 0.2s | 0 → 500 ms |
| right wing follows | same curve, delay 0.42s | 220 → 720 ms |
| centre dot pops | 0.42s `cubic-bezier(.34,1.56,.64,1)` (overshoots), delay 0.68s | 480 → 900 ms |
| mark fades out | 0.28s ease (`.lh-pl-logo`) | 1700 → 1940 ms |

`frame.html` runs the real cubic-bezier solver, not an approximation of those
curves. Two deliberate departures: the wordmark is dropped (unreadable at
100 px, and `lh-pl-shift` exists only to make room for it), and the parting
`.lh-pl-half` panels are replaced by a dark disc that never leaves — which is
what lets the fade-out flow back into the assembly as one loop.

## The loop
Seamless by construction: the state at 2000 ms is byte-identical to the state
at 0 ms (verified — mean |Δ| between the last and the first frame is 0.0).

## Files
- `lh-loader-emoji.webm` — custom emoji: white mark on a dark disc
- `lh-loader-sticker.webm` — video sticker, same animation at 512×512
- `frame.html` — the animation; `window.__render(tMs)` draws one exact frame
- `shoot.mjs` — headless Chrome → 60 transparent PNG frames
- `preview.html` — the webm looping at 100/64/34/20 px on light and dark
- `preview.png` — frames over light / dark chat backgrounds

## Specs
Both are VP9 + alpha (`yuva420p`, `ALPHA_MODE=1`, transparent outside the
disc), 2.0 s, 30 fps, no audio track.

| | size | file | Telegram cap |
|---|---|---|---|
| emoji | 100×100 | 14.5 KB | 64 KB |
| sticker | 512×512 | 74 KB | 256 KB |

The sticker is not an upscale: `shoot.mjs` takes a pixel size and rasterises
the same vectors through `deviceScaleFactor` (512 → 5.12).

## Rebuild
```
npm i puppeteer-core
node shoot.mjs disc 100        # → frames-disc/     (emoji)
node shoot.mjs sticker 512     # → frames-sticker/  (sticker, use -crf 12)
ffmpeg -y -framerate 30 -i frames-disc/f%03d.png \
  -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 0 -crf 20 \
  -deadline best -cpu-used 0 -an -metadata:s:v:0 alpha_mode=1 lh-loader-emoji.webm
```
To verify alpha, decode with `-c:v libvpx-vp9` — ffmpeg's native VP9 decoder
silently drops the alpha side-stream and reports the file as opaque.
