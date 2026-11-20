# Christine DeVries — Code Challenge Submission

A responsive "Solutions for Freight Brokers" page built with plain HTML, CSS and JavaScript. All page copy is loaded from `data/content.json` (the mock CMS response) and styled with the design tokens in `styles/tokens.css`.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (only used to run a tiny local web server, there's nothing to install or build)

## How to run locally

1. Open a terminal and go to the project folder:
   ```bash
   cd web-swe-code-challenge
   ```
2. Start the local server:
   ```bash
   npx serve .
   ```
   If asked "Ok to proceed?", type `y` and press Enter.
3. Open **http://localhost:3000** in your browser.

To stop the server, press `Ctrl + C` in the terminal.

> **Why a server?** The page loads its content with `fetch("data/content.json")`. Browsers block that request when a file is opened directly (`file://`), which shows up as a CORS error. Serving the folder over `http://localhost` puts the page and the JSON on the same origin, so no CORS configuration is needed.

## Project structure

```
index.html          Page skeleton with semantic landmarks and empty section mounts
script.js           Fetches content.json, renders each section, wires up the nav + form
styles/tokens.css   Design tokens (provided)
styles/main.css     Page styles, mobile-first, built only on tokens
data/content.json   Mock CMS content (provided)
assets/             Images and icons exported from the Figma file
scripts/fetch-assets.sh  One-time script used to download the Figma assets
SPEC.md             AI usage, token decisions, interaction decisions, trade-offs
```
