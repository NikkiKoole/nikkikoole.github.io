#!/bin/sh
# standalone-play.sh — make a copied dreamengine wasm build LINKABLE on its own.
#
#   tools/standalone-play.sh <slug> "<Title>" "<one-line description>" [<og-image-file>]
#   e.g. tools/standalone-play.sh pedalboard "Pedalboard" "A guitar you play through a
#        pedalboard you build." pedalboard-og.png
#
# docs/play/<slug>/ is copied verbatim out of dreamengine's site/<slug>/ build, so its
# index.html is a BUILD ARTIFACT: the tab title says "dreamengine" and it carries no
# description or OpenGraph tags. A link to it therefore previews as nothing at all when
# pasted into a chat, a tweet or a forum post.
#
# This patches the copied page so the bare playable is a shareable URL in its own right:
#   • <title> + meta description + canonical
#   • OpenGraph + Twitter card (image = docs/assets/images/<og-image-file>)
#   • manifest name/short_name (the title used when it's saved to a phone home screen)
# It does NOT touch the canvas, the loader, or anything else the engine owns, and it adds
# no overlay on top of the cart, so nothing can steal a tap from the game.
#
# IDEMPOTENT + RE-RUNNABLE: everything it injects lives between mipolai:standalone markers,
# which it strips before re-inserting. After copying a FRESH build over docs/play/<slug>/,
# just run it again.
set -e

slug="$1"; title="$2"; desc="$3"; og="${4:-$slug.png}"
[ -n "$slug" ] && [ -n "$title" ] && [ -n "$desc" ] || {
  echo "usage: tools/standalone-play.sh <slug> \"<Title>\" \"<description>\" [<og-image-file>]" >&2; exit 1; }

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
page="$root/docs/play/$slug/index.html"
mani="$root/docs/play/$slug/manifest.json"
[ -f "$page" ] || { echo "no such page: docs/play/$slug/index.html" >&2; exit 1; }
[ -f "$root/docs/assets/images/$og" ] || echo "warning: docs/assets/images/$og is missing (the preview image won't load)" >&2

url="https://mipolai.com/play/$slug/"
img="https://mipolai.com/assets/images/$og"

# the injected head block, between markers so a re-run replaces it cleanly
block=$(cat <<HEAD
  <!-- mipolai:standalone-start (tools/standalone-play.sh — re-run after copying a fresh build) -->
  <title>$title</title>
  <meta name="description" content="$desc">
  <link rel="canonical" href="$url">
  <meta property="og:type" content="website">
  <meta property="og:url" content="$url">
  <meta property="og:title" content="$title">
  <meta property="og:description" content="$desc">
  <meta property="og:image" content="$img">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="$url">
  <meta property="twitter:title" content="$title">
  <meta property="twitter:description" content="$desc">
  <meta property="twitter:image" content="$img">
  <link rel="icon" href="cart.png">
  <link rel="apple-touch-icon" href="cart.png">
  <!-- mipolai:standalone-end -->
HEAD
)

tmp=$(mktemp)
BLOCK="$block" awk '
  /mipolai:standalone-start/ { skip = 1 }               # drop a previous injection
  /mipolai:standalone-end/   { skip = 0; next }
  skip                       { next }
  /<title>/                  { next }                   # our block owns the title now
  { print }
  /<meta charset=/ && !done   { print ENVIRON["BLOCK"]; done = 1 }
' "$page" > "$tmp"
mv "$tmp" "$page"

# the home-screen name (display:fullscreen PWA); keep the rest of the manifest untouched
tmp=$(mktemp)
sed -e "s/\"name\": *\"[^\"]*\"/\"name\": \"$title\"/" \
    -e "s/\"short_name\": *\"[^\"]*\"/\"short_name\": \"$title\"/" "$mani" > "$tmp"
mv "$tmp" "$mani"

echo "patched docs/play/$slug/index.html + manifest.json"
echo "  title   $title"
echo "  share   $url"
echo "  preview $img"
