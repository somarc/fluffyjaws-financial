import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

const SEARCH_ITEMS = [
  ['FluffyJaws Bonds', '/products/fluffyjaws-bonds'],
  ['Bonds', '/products/fluffyjaws-bonds'],
  ['FluffyJaws ETFs', '/products/fluffyjaws-etfs'],
  ['ETFs', '/products/fluffyjaws-etfs'],
  ['FluffyCoins', '/products/fluffycoins'],
  ['FluffyJaws HypeRails', '/products/fluffyjaws-hyperrails'],
  ['HypeRails', '/products/fluffyjaws-hyperrails'],
  ['Risk Profiler', '/tools/risk-profiler'],
  ['Portfolio Builder', '/tools/portfolio-builder'],
  ['Compare', '/compare'],
  ['Learn', '/learn'],
  ['Contact', '/contact'],
];

function buildNavSearch() {
  const search = document.createElement('form');
  search.className = 'nav-search';
  search.setAttribute('role', 'search');

  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Search';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('aria-label', 'Search FluffyJaws Financial');

  const results = document.createElement('ul');
  results.className = 'nav-search-results';
  results.hidden = true;

  search.append(input, results);

  const render = () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      results.hidden = true;
      results.replaceChildren();
      return;
    }

    const matches = SEARCH_ITEMS
      .filter(([title]) => title.toLowerCase().includes(query))
      .slice(0, 6);
    results.replaceChildren(...matches.map(([title, href]) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = href;
      link.textContent = title;
      item.append(link);
      return item;
    }));
    results.hidden = matches.length === 0;
  };

  search.addEventListener('input', render);
  search.addEventListener('submit', (event) => {
    event.preventDefault();
    const first = results.querySelector('a');
    if (first) window.location.href = first.href;
    else if (input.value.trim()) window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
  });
  search.addEventListener('focusout', () => {
    window.setTimeout(() => { results.hidden = true; }, 150);
  });

  return search;
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Builds the mascot brand panel — the full-bleed face image that anchors
 * the far-left edge of the nav bar on all screen sizes.
 *
 * Structure injected into .nav-brand (before .default-content-wrapper):
 *
 *   <div class="nav-brand-panel">
 *     <img class="nav-brand-logo"
 *          src="/icons/fluffyjaws-mascot.webp"
 *          alt="FluffyJaws — dapper shark mascot"
 *          width="220" height="220">
 *   </div>
 *
 * CSS handles the full-bleed object-fit: cover treatment.
 * The image lives at /icons/fluffyjaws-mascot.webp in the repo (codebus).
 * Source: 220×220 webp — see blocks/header/README or nav/NOTES.md.
 *
 * @returns {HTMLElement} The brand panel element
 */
function buildBrandPanel() {
  const panel = document.createElement('div');
  panel.className = 'nav-brand-panel';

  const img = document.createElement('img');
  img.className = 'nav-brand-logo';
  // Codebus path — commit /shared/fluffyjaws/nav/fluffyjaws-mascot-nav.webp
  // to the repo as /icons/fluffyjaws-mascot.webp
  img.src = '/icons/fluffyjaws-mascot.webp';
  img.alt = 'FluffyJaws — dapper shark mascot';
  // Intrinsic dimensions for layout stability (prevents CLS)
  img.width = 220;
  img.height = 220;
  // Not meaningful content — the wordmark is the accessible brand name
  img.setAttribute('aria-hidden', 'true');

  panel.append(img);
  return panel;
}

/**
 * Attaches a passive scroll listener to the nav-wrapper that adds/removes
 * the `is-scrolled` class. CSS uses this to deepen the bar's shadow and
 * intensify the gold hairline.
 *
 * @param {Element} navWrapper The .nav-wrapper element
 */
function initScrollElevation(navWrapper) {
  const THRESHOLD = 8; // px
  const onScroll = () => {
    navWrapper.classList.toggle('is-scrolled', window.scrollY > THRESHOLD);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  // Sync immediately (handles mid-page refresh / anchor navigation)
  onScroll();
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand?.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    const buttonContainer = brandLink.closest('.button-container');
    if (buttonContainer) buttonContainer.className = '';
  }

  // Inject the full-bleed mascot panel as the first child of .nav-brand,
  // before the default-content-wrapper that holds the wordmark text.
  if (navBrand) {
    navBrand.prepend(buildBrandPanel());
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', (event) => {
        const submenu = navSection.querySelector(':scope > ul');
        if (submenu?.contains(event.target)) return;
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) navTools.prepend(buildNavSearch());

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Scroll elevation: deepen shadow + brighten gold hairline on scroll
  initScrollElevation(navWrapper);
}
