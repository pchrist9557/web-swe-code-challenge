# Project Spec & Notes

## AI usage

`SPEC.md` was drafted with Claude from the build history; I edited it and wrote the reasoning for the interaction decisions myself.

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

Follow-up prompts while refining:

- "Can you check if Figma MCP is connected here"
- "Do a quick Figma check on all the specs: typography, colors, font size, styles are in place and match the Figma settings" (caught 5 mismatches, all fixed)
- "I don't see frames to build the navigation dropdown. Double check [the Figma file], the README and the challenge file to make sure I don't need to build those options" (confirmed out of scope)
- "I selected pchrist9557. Can you double check before I do the git remote add?" (caught that the repo still pointed at DAT's starter)
- "How did you implement the HTML? I need a whole explanation of what you did"

**Accepted / adjusted / rejected**

| AI suggestion | What I did |
|---|---|
| Skip Tailwind, use plain CSS with tokens | Accepted |
| Render all sections from `content.json` with small render functions instead of a framework | Accepted |
| Spot-check against Figma found 5 mismatches (heading color, divider width, button letter-spacing, footer padding, badge gap) | Had them fixed, then re-checked: 105/105 values match |
| Nav chevrons suggest dropdown menus | Checked Figma and the brief before building: no menu designs exist and the nav can be static, so I kept the chevrons and didn't build menus |
| Publish to GitHub through VS Code | Caught that the repo still pointed at DAT's starter repo; renamed that remote and published to my own instead |
| Tailwind for styling (my original plan) | Rejected after weighing it against the grading criteria (token usage, semantic class names, "simpler is better") |

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
- **Sticky "Get started today" banner (from the Figma prototype):** sticks to the bottom of the viewport at 960px and wider. It's placed right after `<main>`, so it naturally settles above the footer at the end of the page, with no JavaScript. On mobile I chose not to make it sticky: the banner stacks to ~236px tall there, and pinning it would cover about a third of the screen while someone is trying to read. The design only shows the sticky behavior at desktop size, so I kept it to 960px and up.
- **"Get started" hero button:** scrolls to the form (`#get-authority`, the id comes from `content.json`). Smooth scrolling is turned off for users who prefer reduced motion.
- **Hover states:** Figma doesn't define hover states, so I kept them subtle and consistent, used only existing tokens (no new colors), and made every clickable element respond so it reads as interactive.
  - Primary buttons darken to `--color-primary-700`
  - Gradient buttons dim slightly
  - Outline buttons fill
  - Text links underline
  - Form fields darken their border
- **Focus:** one consistent `:focus-visible` outline using `--border-weight-focus` and `--color-primary-300`, so keyboard users always see where they are and mouse users don't get rings on click. I chose visibility over subtlety here: a 4px ring using the design system's own focus token works on both light and dark sections of the page.
- **Form labels:** Figma shows the labels as placeholder text. I used floating labels: they start inside the field like the design, then move to the top border when the field is focused or filled. Placeholder-only labels vanish once you type, which makes it easy to lose track of which field you're in, so I kept the design's look but made the label stay visible.
- **Form submit:** native browser validation for required fields and email format. On a valid submit it shows a polite on-page confirmation (`role="status"`) and resets the form. Nothing is sent anywhere.
- **Mobile features row:** the 360 frame lays the three cards side by side, wider than the screen, so on mobile they scroll horizontally with scroll-snap. I followed the design rather than stacking them, because a swipeable row keeps the section short on a phone, and the next card peeking in at the edge hints that there's more. The list is keyboard-focusable so it can also be scrolled without a mouse.
- **Mobile nav:** hamburger toggle (`aria-expanded`, closes with Escape, and resets when the window is resized past mobile).
- **Nav dropdowns:** the chevrons match the design, but Figma has no open-menu state and `content.json` has no menu items, so I didn't build dropdowns. The brief says links don't need to go anywhere unless Figma calls them out, and the nav could even be a static image.

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
