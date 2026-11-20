/**
 * Broker page renderer.
 * Fetches data/content.json (stand-in for a CMS response) and renders each
 * [data-section] mount point in index.html. Plain functions returning HTML
 * strings: no framework needed for a static, render-once page.
 */

const CONTENT_URL = "data/content.json";
const ASSET_PATH = "assets/";
const DESKTOP_QUERY = window.matchMedia("(min-width: 960px)");

/*
 * Imagery isn't part of content.json, so it's mapped here by position.
 * In production these would come from the CMS alongside the copy.
 */
const MEDIA = {
  hero: {
    src: "hero-dashboard.png",
    alt: "DAT One load board and rate analytics shown on desktop and mobile",
    width: 544,
    height: 335,
  },
  features: [
    { src: "screen-load-board.png", alt: "DAT One load board search results" },
    { src: "screen-rate-analytics.png", alt: "DAT rate analytics dashboard" },
    { src: "screen-contract-award.png", alt: "Contract bid award summary" },
  ],
  spotlights: [
    { src: "screen-load-board.png", alt: "DAT One load board search results" },
    { src: "screen-rate-analytics.png", alt: "DAT iQ market rate dashboard" },
  ],
  reviews: [
    { src: "review-1.png", alt: "Capterra rating", width: 183 },
    { src: "review-2.png", alt: "G2 badge", width: 120 },
    { src: "review-3.png", alt: "G2 badge", width: 120 },
    { src: "review-4.png", alt: "Review rating", width: 183 },
  ],
};

/* Select options aren't in content.json; placeholder values for the demo. */
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const SELECT_OPTIONS = {
  companyType: ["Freight Broker", "Carrier", "Shipper", "Other"],
  state: US_STATES,
  transportationRole: ["Owner / Operator", "Dispatcher", "Broker Agent", "Executive", "Other"],
};

const AUTOCOMPLETE = {
  firstName: "given-name",
  lastName: "family-name",
  email: "email",
  phone: "tel",
  companyName: "organization",
  state: "address-level1",
};

/* ---------- helpers ---------- */

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

const asset = (file) => ASSET_PATH + file;

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const button = ({ label, href = "#", variant = "primary" }, extraClass = "") =>
  `<a class="btn btn--${escapeHtml(variant)} ${extraClass}" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;

const list = (items, renderItem) => items.map(renderItem).join("");

/* ---------- section renderers ---------- */

function renderNav({ links, actions }) {
  const navLinks = list(links, (link) => {
    const chevron = link.hasMenu
      ? `<img src="${asset(link.current ? "icon-chevron-down-active.svg" : "icon-chevron-down.svg")}" alt="" width="24" height="24">`
      : "";
    const current = link.current ? ' aria-current="page"' : "";
    return `<li><a class="site-nav__link" href="${escapeHtml(link.href)}"${current}>${escapeHtml(link.label)}${chevron}</a></li>`;
  });

  return `
    <nav class="site-nav" aria-label="Primary">
      <a class="site-nav__logo" href="#">
        <img src="${asset("dat-logo.svg")}" alt="DAT Freight &amp; Analytics home" width="206" height="35">
      </a>
      <button class="site-nav__toggle" type="button" aria-expanded="false" aria-controls="site-nav-menu">
        <span class="visually-hidden">Menu</span>
        <span class="site-nav__toggle-bars" aria-hidden="true"></span>
      </button>
      <div class="site-nav__menu" id="site-nav-menu">
        <ul class="site-nav__links">${navLinks}</ul>
        <button class="icon-button" type="button" aria-label="Search">
          <img src="${asset("icon-search.svg")}" alt="" width="24" height="24">
        </button>
        <div class="site-nav__actions">
          ${list(actions, (action) => button(action, "btn--sm"))}
        </div>
      </div>
    </nav>`;
}

function renderHero({ heading, subheading, callout }) {
  const image = MEDIA.hero;
  return `
    <div class="container hero__inner">
      <div class="hero__content">
        <h1 class="hero__title" id="hero-title">${escapeHtml(heading)}</h1>
        <p class="hero__subheading">${escapeHtml(subheading)}</p>
        <div class="callout">
          <span class="callout__icon">
            <img src="${asset("icon-account-balance.svg")}" alt="" width="24" height="24">
          </span>
          <p class="callout__text">
            <strong>${escapeHtml(callout.heading)}</strong>
            <span>${escapeHtml(callout.text)}</span>
          </p>
          ${button({ ...callout.cta, variant: "gradient" }, "callout__cta")}
        </div>
      </div>
      <img class="hero__media" src="${asset(image.src)}" alt="${escapeHtml(image.alt)}"
        width="${image.width}" height="${image.height}" fetchpriority="high">
    </div>`;
}

function renderFeatures({ heading, items }) {
  const cards = list(items, (item, index) => {
    const image = MEDIA.features[index];
    const media = image
      ? `<div class="feature-card__media"><img src="${asset(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy"></div>`
      : "";
    return `
      <li class="feature-card">
        ${media}
        <h3 class="feature-card__title">${escapeHtml(item.title)}</h3>
        <p class="feature-card__text">${escapeHtml(item.description)}</p>
      </li>`;
  });

  return `
    <div class="container">
      <h2 class="section-title" id="features-title">${escapeHtml(heading)}</h2>
      <ul class="features__list" tabindex="0" aria-label="${escapeHtml(heading)}">${cards}</ul>
    </div>`;
}

function renderSpotlights(spotlights) {
  return list(spotlights, (spotlight, index) => {
    const image = MEDIA.spotlights[index];
    const titleId = `spotlight-${slugify(spotlight.title)}`;
    const media = image
      ? `<figure class="spotlight__media"><img src="${asset(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy"></figure>`
      : "";
    return `
      <hr class="divider">
      <section class="spotlight spotlight--media-${escapeHtml(spotlight.mediaPosition)}" aria-labelledby="${titleId}">
        <div class="container spotlight__inner">
          <div class="spotlight__content">
            <h2 class="spotlight__title" id="${titleId}">${escapeHtml(spotlight.title)}</h2>
            <p class="spotlight__text">${escapeHtml(spotlight.description)}</p>
            <ul class="checklist">
              ${list(spotlight.benefits, (benefit) => `<li>${escapeHtml(benefit)}</li>`)}
            </ul>
          </div>
          ${media}
        </div>
      </section>`;
  }) + '<hr class="divider">';
}

function renderField(field) {
  const id = `field-${field.name}`;
  const label = `${escapeHtml(field.label)}${field.required ? "*" : ""}`;
  const required = field.required ? " required" : "";
  const autocomplete = AUTOCOMPLETE[field.name] ? ` autocomplete="${AUTOCOMPLETE[field.name]}"` : "";

  if (field.type === "select") {
    const options = SELECT_OPTIONS[field.name] || [];
    return `
      <div class="field field--select">
        <select class="field__control" id="${id}" name="${escapeHtml(field.name)}"${required}${autocomplete}>
          <option value=""></option>
          ${list(options, (option) => `<option>${escapeHtml(option)}</option>`)}
        </select>
        <label class="field__label" for="${id}">${label}</label>
      </div>`;
  }

  return `
    <div class="field">
      <input class="field__control" id="${id}" name="${escapeHtml(field.name)}" type="${escapeHtml(field.type)}"
        placeholder=" "${required}${autocomplete}>
      <label class="field__label" for="${id}">${label}</label>
    </div>`;
}

function renderAuthorityForm(form) {
  const { legend, options } = form.authorityNeeded;
  const checkboxes = list(options, (option) => `
    <label class="checkbox">
      <input class="checkbox__input" type="checkbox" name="authorityNeeded" value="${escapeHtml(option)}">
      <span>${escapeHtml(option)}</span>
    </label>`);

  return `
    <div class="authority__inner">
      <h2 class="section-title" id="authority-title">${escapeHtml(form.heading)}</h2>
      <form class="authority-form" action="#" method="post">
        <div class="authority-form__fields">${list(form.fields, renderField)}</div>
        <fieldset class="checkbox-group">
          <legend class="checkbox-group__legend">${escapeHtml(legend)}</legend>
          <div class="checkbox-group__options">${checkboxes}</div>
        </fieldset>
        <p class="authority-form__consent">${escapeHtml(form.consent)}</p>
        <button class="btn btn--primary btn--sm btn--block" type="submit">${escapeHtml(form.submitLabel)}</button>
        <p class="authority-form__status" role="status" aria-live="polite"></p>
      </form>
    </div>`;
}

function renderCta({ heading, text, actions }) {
  return `
    <div class="cta-banner__inner">
      <div class="cta-banner__copy">
        <h2 class="cta-banner__title" id="cta-title">${escapeHtml(heading)}</h2>
        <p class="cta-banner__text">${escapeHtml(text)}</p>
      </div>
      <div class="cta-banner__actions">
        ${list(actions, (action) => button(action.variant === "primary" ? { ...action, variant: "gradient" } : action))}
      </div>
    </div>`;
}

function renderFooter(footer) {
  const columns = list(footer.columns, (column) => `
    <div class="footer-nav__column">
      <h2 class="footer-nav__heading">${escapeHtml(column.heading)}</h2>
      <ul>${list(column.links, (link) => `<li><a href="#">${escapeHtml(link)}</a></li>`)}</ul>
    </div>`);

  const social = list(footer.social, (name) => `
    <li>
      <a class="footer-social__link" href="#">
        <span class="footer-social__icon"><img src="${asset(`social-${slugify(name)}.svg`)}" alt="" width="8" height="8"></span>
        ${escapeHtml(name)}
      </a>
    </li>`);

  const reviews = list(MEDIA.reviews, (review) => `
    <li><a href="#"><img src="${asset(review.src)}" alt="${escapeHtml(review.alt)}" width="${review.width}" height="60" loading="lazy"></a></li>`);

  return `
    <nav class="footer-nav" aria-label="Footer">${columns}</nav>
    <ul class="footer-social" aria-label="Social media">${social}</ul>
    <div class="footer-block">
      <p>${escapeHtml(footer.appDownload)}</p>
      <ul class="footer-badges">
        <li>
          <a class="store-badge" href="#">
            <img src="${asset("store-apple.svg")}" alt="" width="20" height="24">
            <span class="store-badge__text"><span class="store-badge__eyebrow">Download on the</span> App Store</span>
          </a>
        </li>
        <li>
          <a class="store-badge" href="#">
            <img src="${asset("store-google-play.svg")}" alt="" width="21" height="24">
            <span class="store-badge__text">
              <span class="store-badge__eyebrow">Get it on</span>
              <img class="store-badge__wordmark" src="${asset("store-google-play-wordmark.svg")}" alt="Google Play" width="74" height="15">
            </span>
          </a>
        </li>
      </ul>
    </div>
    <div class="footer-block">
      <h2 class="footer-block__heading">${escapeHtml(footer.reviewHeading)}</h2>
      <ul class="footer-reviews">${reviews}</ul>
    </div>
    <ul class="footer-legal">${list(footer.legalLinks, (link) => `<li><a href="#">${escapeHtml(link)}</a></li>`)}</ul>
    <p class="footer-copyright">${escapeHtml(footer.copyright)}</p>`;
}

/* ---------- mounting ---------- */

const RENDERERS = {
  nav: renderNav,
  hero: renderHero,
  features: renderFeatures,
  spotlights: renderSpotlights,
  authorityForm: renderAuthorityForm,
  cta: renderCta,
  footer: renderFooter,
};

function render(content) {
  Object.entries(RENDERERS).forEach(([key, renderSection]) => {
    const mount = document.querySelector(`[data-section="${key}"]`);
    if (mount && content[key]) mount.innerHTML = renderSection(content[key]);
  });

  // The form's anchor id comes from the CMS so the hero CTA link stays in sync.
  const formSection = document.querySelector('[data-section="authorityForm"]');
  if (formSection && content.authorityForm?.id) formSection.id = content.authorityForm.id;
}

/* ---------- interactions ---------- */

function setupNavToggle() {
  const nav = document.querySelector(".site-nav");
  const toggle = nav?.querySelector(".site-nav__toggle");
  if (!nav || !toggle) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  // Reset the mobile menu when the viewport grows past the mobile breakpoint.
  DESKTOP_QUERY.addEventListener("change", () => setOpen(false));
}

function setupForm() {
  const form = document.querySelector(".authority-form");
  if (!form) return;
  const status = form.querySelector(".authority-form__status");

  // Native constraint validation runs first; "submit" only fires when valid.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstName = form.elements.firstName?.value.trim();
    status.textContent = `Thanks${firstName ? `, ${firstName}` : ""}! This demo form doesn't send data anywhere.`;
    form.reset();
  });
}

function showLoadError() {
  const main = document.getElementById("main");
  if (main) {
    main.innerHTML = '<p class="page-message">Sorry, this page couldn’t load its content. Please refresh to try again.</p>';
  }
}

async function init() {
  try {
    const response = await fetch(CONTENT_URL);
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    render(await response.json());
    setupNavToggle();
    setupForm();
  } catch {
    showLoadError();
  }
}

init();
