// Original inline SVG glyphs. No logos, no external artwork, no network requests.
function wrap(body, cls, label) {
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"${label ? ` role="img" aria-label="${label}"` : ''}>${body}</svg>`;
}

export function trophyIcon(grade = 'bronze') {
  const gem = grade === 'platinum'
    ? '<path d="M12 1.4l1.5 2.2 2.6-.4-.3 2.6 1.8 1.9-2.5.9L14.6 10 12 8.7 9.4 10l-.5-1.4-2.5-.9 1.8-1.9-.3-2.6 2.6.4L12 1.4Z" fill="currentColor" opacity=".9"/>'
    : '';
  const body = `${gem}
    <path d="M7 5h10v3.4a5 5 0 0 1-10 0V5Z" fill="currentColor" opacity=".92"/>
    <path d="M7 6.2H4.6v1.6A3 3 0 0 0 7.3 11M17 6.2h2.4v1.6a3 3 0 0 1-2.7 3.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M12 13.4V17M8.6 19h6.8l1.2 2H7.4l1.2-2Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  return wrap(body, `trophy trophy-${grade}`);
}

const CATEGORY_PATHS = {
  story: '<path d="M4 5.5h6a2.5 2.5 0 0 1 2 2V20a2.5 2.5 0 0 0-2-2H4V5.5Zm16 0h-6a2.5 2.5 0 0 0-2 2V20a2.5 2.5 0 0 1 2-2h6V5.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  side: '<circle cx="7" cy="7" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 19c.4-3 2-4.6 4-4.6s3.6 1.6 4 4.6M14 19c.2-2.2 1.3-3.4 3-3.4s2.8 1.2 3 3.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  collectible: '<path d="m12 2 8 6-8 14L4 8l8-6Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 8h16M12 2l-3 6 3 14 3-14-3-6Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>',
  activity: '<path d="M13 2 5 13h5l-1 9 9-12h-5l1-8Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  crime: '<path d="M4 9h16l-1.2 11H5.2L4 9Zm4 0V7a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.5 14h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  money: '<path d="M12 4v16M15.5 7.2c-.8-1.1-2-1.6-3.5-1.6-2 0-3.4 1-3.4 2.5 0 3.6 7 1.5 7 5 0 1.6-1.5 2.7-3.6 2.7-1.6 0-3-.6-3.8-1.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  secret: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9.4 9.2a2.8 2.8 0 1 1 4.6 2.2c-1 .8-1.6 1.3-1.6 2.6M12 17.4h.01" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  completion: '<path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9L12 2.6Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
};

export function categoryIcon(category = 'story') {
  return wrap(CATEGORY_PATHS[category] || CATEGORY_PATHS.story, `category category-${category}`);
}

export function flagIcon(kind) {
  if (kind === 'missable') {
    return wrap('<path d="M12 3 2.5 20h19L12 3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 9v5M12 17h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>', 'flag flag-missable');
  }
  if (kind === 'hidden') {
    return wrap('<path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 20 20 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>', 'flag flag-hidden');
  }
  return wrap('<path d="M9.5 14.5 14.5 9.5M8 12l-1.7 1.7a3.2 3.2 0 0 0 4.5 4.5L12.5 16M16 12l1.7-1.7a3.2 3.2 0 0 0-4.5-4.5L11.5 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>', 'flag flag-source');
}

export function searchIcon() {
  return wrap('<circle cx="10.8" cy="10.8" r="6.3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m15.5 15.5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>', 'ico-search');
}
