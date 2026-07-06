#!/usr/bin/env bash
# optimize-image.sh — shrink + convert an image into docs/assets/images/
#
# Encodes the "media diet" judgment so it's one command, not hand-tuned flags:
#   photos      -> WebP (smaller than JPEG at equal quality; the site already ships .webp)
#   screenshots -> PNG, colour-quantized (keeps text/pixels crisp, drops the file size)
#
# Usage:
#   tools/optimize-image.sh <src> <name> [photo|shot] [maxwidth]
#
#   <src>      path to the full-size original (any format magick/cwebp reads: jpg/png/webp/heic…)
#   <name>     output basename, NO extension — the script picks the extension by type
#              (use a descriptive slug: "ibm-xt", not the random download name)
#   photo|shot photo (default) = real photograph  -> .webp @ q80
#              shot            = UI / pixel screenshot -> .png quantized to 256 colours
#   maxwidth   longest edge to downscale to (default: photo 900, shot 1000). Never upscales.
#
# Examples:
#   tools/optimize-image.sh ~/Downloads/ibm-pc.jpg        ibm-xt            photo
#   tools/optimize-image.sh ~/Downloads/div-studio.png    div-games-studio  shot
#   tools/optimize-image.sh ~/Downloads/wide-banner.jpg   header            photo  1400
#
# Prints before/after size. Writes to docs/assets/images/<name>.<ext>. Never touches the source.
set -euo pipefail

# --- locate the repo's image dir relative to this script (so it works from anywhere) ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/../docs/assets/images"

# --- args ---
if [ $# -lt 2 ]; then
  grep '^#' "$0" | sed 's/^# \{0,1\}//'   # print this header as help
  exit 1
fi
SRC="$1"; NAME="$2"; TYPE="${3:-photo}"

if [ ! -f "$SRC" ]; then echo "error: source not found: $SRC" >&2; exit 1; fi
if ! command -v magick >/dev/null; then echo "error: ImageMagick (magick) not installed" >&2; exit 1; fi

case "$TYPE" in
  photo)
    command -v cwebp >/dev/null || { echo "error: cwebp not installed (brew install webp)" >&2; exit 1; }
    MAXW="${4:-900}"
    OUT="$OUT_DIR/$NAME.webp"
    # cwebp resizes only if the source is wider (0 height = keep aspect). Guard the upscale ourselves.
    SRCW=$(magick identify -format '%w' "$SRC")
    RW=$MAXW; [ "$SRCW" -lt "$MAXW" ] && RW=0     # RW=0 -> cwebp keeps original width
    cwebp -quiet -q 80 -resize "$RW" 0 "$SRC" -o "$OUT"
    ;;
  shot)
    MAXW="${4:-1000}"
    OUT="$OUT_DIR/$NAME.png"
    # -resize with '>' only shrinks, never upscales. Quantize to 256 colours + strip metadata.
    magick "$SRC" -resize "${MAXW}x${MAXW}>" -colors 256 -strip "$OUT"
    ;;
  *)
    echo "error: type must be 'photo' or 'shot', got: $TYPE" >&2; exit 1;;
esac

# --- report ---
before=$(wc -c < "$SRC" | tr -d ' ')
after=$(wc -c < "$OUT" | tr -d ' ')

# Guard: never ship a file bigger than the source. If our processing didn't help
# (e.g. an already-tiny, already-quantized screenshot) AND the source is the same
# format as the output, just use the source verbatim.
src_ext=$(printf '%s' "${SRC##*.}" | tr '[:upper:]' '[:lower:]'); out_ext="${OUT##*.}"
if [ "$after" -ge "$before" ] && [ "$src_ext" = "$out_ext" ]; then
  cp "$SRC" "$OUT"
  after=$(wc -c < "$OUT" | tr -d ' ')
  echo "note: original was already smaller/optimized — kept it as-is."
elif [ "$after" -ge "$before" ]; then
  echo "note: result ($((after/1024)) KB) is not smaller than the $src_ext source ($((before/1024)) KB) — the original may already be well-optimized."
fi

dims=$(magick identify -format '%wx%h' "$OUT")
printf '%s  (%s)\n  %s KB  ->  %s KB\n' \
  "$OUT" "$dims" "$((before/1024))" "$((after/1024))"
echo "Reference it in content as: ![alt text](../assets/images/$(basename "$OUT"))"
