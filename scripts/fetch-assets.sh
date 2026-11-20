#!/usr/bin/env bash
# One-time download of image/SVG assets exported from the Figma file
# (dat.com_broker, "1440px" frame) via the Figma MCP server.
# Figma asset URLs expire ~7 days after export, so run this right away.
# Usage (from the project root):  bash scripts/fetch-assets.sh
set -euo pipefail

BASE="https://www.figma.com/api/mcp/asset"
DEST="assets"
mkdir -p "$DEST"

fetch() { # fetch <file-name> <asset-id>
  curl -fsSL -o "$DEST/$1" "$BASE/$2"
  echo "  ✓ $1"
}

echo "Downloading assets into ./$DEST"
# Nav
fetch dat-logo.svg                     daa014ce-af3c-4c9b-974d-e0cbe437b96f.svg
fetch icon-chevron-down.svg            3dd4fa61-3e19-4c45-bfdc-705899844a65.svg
fetch icon-chevron-down-active.svg     8a8903ac-be68-4249-b3eb-aabfd9edcab3.svg
fetch icon-search.svg                  3f61354d-a8d9-430f-b762-be2d0094c369.svg
# Hero
fetch hero-gradient.svg                13eaceae-1f25-4a2c-8884-771c07beba96.svg
fetch hero-dashboard.png               e688cf87-18e5-43fe-a982-7e250e385d29.png
fetch icon-account-balance.svg         d60130b8-a919-4a05-aa4f-36ebc9a1b6f3.svg
# Features + spotlights
fetch screen-load-board.png            cd9f4513-ea3f-4ede-821c-26bb46d3a61a.png
fetch screen-rate-analytics.png        b8ece0bf-335e-4d0f-8930-ac8d2ca4fbd6.png
fetch screen-contract-award.png        8ec49671-338a-4482-a6ea-f06534114fcb.png
fetch spotlight-bg.png                 268cb0f5-8445-4382-8f0c-88d19fb2dc44.png
fetch icon-check-circle.svg            ce5d5b87-a473-40bb-8996-494a8d6b87a5.svg
# Form
fetch icon-arrow-drop-down.svg         14bfbf21-0ce6-41cd-8cbb-e017f3d71f5d.svg
fetch icon-checkbox-checked.svg        076b2ae7-bfe4-4570-8cc5-67d1ea3e11a1.svg
# Footer
fetch social-facebook.svg              cd4239dc-de47-4ca9-af89-3993f5cbbe58.svg
fetch social-x.svg                     8d846e8f-c8e2-471b-bc95-6cc8a435b857.svg
fetch social-youtube.svg               27795b61-0f84-4943-8e10-57a852bc6a60.svg
fetch social-instagram.svg             edc6cd9a-28ae-40b6-b5dc-73c2e6054d04.svg
fetch store-apple.svg                  a9690a81-cda6-481a-b105-811700f32f51.svg
fetch store-google-play.svg            332db178-5125-4b23-96b5-95a6e6d3e556.svg
fetch store-google-play-wordmark.svg   630df1c1-c058-4eec-8c38-4a5a1bbc96da.svg
fetch review-1.png                     e2d80c15-443e-41b8-b64f-3c79041bd19d.png
fetch review-2.png                     9e1b7f66-82d4-45ac-93e6-0b7c03eb9f25.png
fetch review-3.png                     f044f234-61b1-4c7c-a928-f9657708c3bf.png
fetch review-4.png                     0594a13a-e3aa-4528-995b-39e12a3bf35a.png
echo "Done."
