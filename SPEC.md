# Project Spec & Notes

> ✏️ **Draft.** Sections marked **[YOUR CALL]** describe what's built. Write the *why* in your own words. The challenge asks for your reasoning, not the AI's.

## AI usage

**Tools:** Claude (claude.ai, linked to my project folder and to Figma through the Figma MCP connector), Claude Code (CLI, also connected to Figma MCP).

**How I directed it**

- **Setup.** I asked Claude to set up Tailwind and connect Figma MCP. After it read the starter files and `CHALLENGE.md`, it recommended *not* using Tailwind. Reasons: the challenge grades token usage, semantic class naming, and "simpler is better". Tailwind would add a build step and hide the tokens behind utility classes. **I accepted this and kept plain CSS.**
- **Saving on Figma calls.** My Figma seat has a small monthly MCP limit, so I had Claude pull each frame only once:
  - one structure call (`get_metadata`) for the whole Designs page, which gave every frame's size and layout for the 1440 / 960+ / 360 breakpoints
  - one full design-context call for the 1440px frame
  - one for the "Get started today" banner

  The tablet and mobile layouts were built from the structure data rather than extra calls.
- **Prototype frame.** The structure data showed a "Prototype" frame labeled *Sticky nav* and *Sticky banner*. That's the one interaction the design specifies, so it was built first.
- **Translating Figma's output.** The Figma output is React + Tailwind with absolute positioning. I had Claude translate it into semantic HTML and token-based CSS grid/flex, not copy it.

**Representative prompts**

- "Please help me install tailwind and have claude figma mcp connected ready to go"
- "okay let's start this project"
- _[YOUR CALL: add the follow-up prompts you use as you refine, e.g. corrections after comparing against Figma]_

**Accepted / adjusted / rejected**

| AI suggestion | What I did |
|---|---|
| Skip Tailwind, use plain CSS with tokens | Accepted |
| Render all sections from `content.json` with small render functions instead of a framework | Accepted |
| _[YOUR CALL: add anything you changed or rejected]_ | |

## Design token usage

- Every color, font size, font weight and border radius in `main.css` comes from `tokens.css`.
- `tokens.css` has **no spacing, line-height or letter-spacing scale**. I added those once at the top of `main.css` (values from the Figma type styles and 8px grid), so the rest of the CSS only uses variables.
- **Gaps between the tokens and Figma** (each defined once at the top of `main.css`):
  - `--color-ink-900: #192129`: Figma's `text/primary`, also the nav and dark-surface color. The closest token, `--color-neutral-800` (#2d3943), is visibly lighter and bluer.
  - `--color-accent-purple: #9900e0`: end stop of the "Gradient/Blue 5" CTA buttons. There's no purple token.
  - In a real project I'd raise both with the design system team instead of extending locally.
- **Font.** Figma uses Sequel Sans. The page uses `--font-family-base` (system stack) as the token instructs, mapping Sequel's Black/Bold/Book/Light to the `--font-weight-*` tokens.
- **Small rounding calls:**
  - The app-store badges use `--radius-large` (Figma: 6px).
  - Badge text uses the nearest font-size tokens.

## Interaction & UX decisions

- **Sticky nav (from the Figma prototype):** `position: sticky` on the header at all sizes. Anchor links use `scroll-padding-top` so the form heading isn't hidden under the nav.
- **Sticky "Get started today" banner (from the Figma prototype):** sticks to the bottom of the viewport at 960px and wider. It's placed right after `<main>`, so it naturally settles above the footer at the end of the page, with no JavaScript. **[YOUR CALL]** On mobile it's *not* sticky, because at 236px tall it would cover about a third of a phone screen.
- **"Get started" hero button:** scrolls to the form (`#get-authority`, the id comes from `content.json`). Smooth scrolling is turned off for users who prefer reduced motion.
- **Hover states [YOUR CALL]:**
  - Primary buttons darken to `--color-primary-700`
  - Gradient buttons dim slightly
  - Outline buttons fill
  - Text links underline
  - Form fields darken their border
- **Focus [YOUR CALL]:** one consistent `:focus-visible` outline using `--border-weight-focus` and `--color-primary-300`, so keyboard users always see where they are and mouse users don't get rings on click.
- **Form labels [YOUR CALL]:** Figma shows the labels as placeholder text. I used floating labels: they start inside the field like the design, then move to the top border when the field is focused or filled, so the label never disappears while typing.
- **Form submit:** native browser validation for required fields and email format. On a valid submit it shows a polite on-page confirmation (`role="status"`) and resets the form. Nothing is sent anywhere.
- **Mobile features row [YOUR CALL]:** the 360 frame lays the three cards side by side wider than the screen, so on mobile they scroll horizontally with scroll-snap. The list is keyboard-focusable.
- **Mobile nav:** hamburger toggle (`aria-expanded`, closes with Escape, and resets when the window is resized past mobile).

## Assumptions & trade-offs

- **Images aren't in `content.json`**, so `script.js` maps them to sections by position (`MEDIA`). In production they'd come from the CMS.
- **The select options** (Company Type, State, Transportation Role) aren't in `content.json`, so I used placeholder lists.
- **Nav and footer** are built in HTML from `content.json` rather than as static images. The nav had to be real HTML to be sticky. The footer was cheap to render from the same data.
- **No framework or build step.** The page renders once from one JSON request, so React state/effects wouldn't add value here.
- **Rendering is client-side**, so the content needs JavaScript. A `<noscript>` message covers that case. With a real CMS, I'd pre-render the HTML for SEO.
- **No error-color token**, so invalid fields rely on the browser's built-in validation messages instead of custom red states.
- **Breakpoints follow the Figma frames:** mobile below 960px, then 960px+ and 1440px+. Tablet hero type sizes were estimated from the frame dimensions.

## If I had more time

- Pre-render the HTML at build time (or move to Next.js, as the team plans to) for SEO and first paint.
- Add custom inline validation messages once an error-color token exists.
- Pull image and select-option data from the CMS response instead of the `MEDIA` and `SELECT_OPTIONS` maps.
- Automated checks: HTML validation, axe accessibility scan, and visual regression against the Figma frames.
