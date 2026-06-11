const INDEX_URL = '/query-index.json';
const SEARCH_FIELDS = ['title', 'description', 'content'];

function debounce(fn, delay = 180) {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

function getQuery() {
  return new URLSearchParams(window.location.search).get('q') || '';
}

function normalize(value) {
  return String(value || '').trim();
}

function scoreResult(item, terms) {
  const title = normalize(item.title).toLowerCase();
  const description = normalize(item.description).toLowerCase();
  const content = normalize(item.content).toLowerCase();

  return terms.reduce((score, term) => {
    if (title.includes(term)) return score + 8;
    if (description.includes(term)) return score + 4;
    if (content.includes(term)) return score + 1;
    return score;
  }, 0);
}

function matches(item, terms) {
  const searchable = SEARCH_FIELDS.map((field) => normalize(item[field]).toLowerCase()).join(' ');
  return terms.every((term) => searchable.includes(term));
}

function createResult(item) {
  const result = document.createElement('li');
  result.className = 'search-result';

  const link = document.createElement('a');
  link.href = item.path;
  link.textContent = normalize(item.title) || item.path;

  const description = document.createElement('p');
  description.textContent = normalize(item.description) || 'Explore this FluffyJaws Financial page.';

  result.append(link, description);
  return result;
}

async function loadIndex() {
  const response = await fetch(INDEX_URL);
  if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
  const index = await response.json();
  return Array.isArray(index.data) ? index.data.filter((item) => item.path && item.title) : [];
}

export default async function decorate(block) {
  block.textContent = '';

  const form = document.createElement('form');
  form.className = 'search-form';
  form.setAttribute('role', 'search');

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Search products, tools, and guides';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.value = getQuery();
  input.setAttribute('aria-label', 'Search FluffyJaws Financial');

  const count = document.createElement('p');
  count.className = 'search-count';
  count.setAttribute('aria-live', 'polite');

  const list = document.createElement('ul');
  list.className = 'search-results';

  form.append(input);
  block.append(form, count, list);

  let items = [];

  function render() {
    const query = input.value.trim();
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const results = terms.length
      ? items
        .filter((item) => matches(item, terms))
        .sort((a, b) => scoreResult(b, terms) - scoreResult(a, terms))
      : items;
    const visibleResults = results.slice(0, 12);

    list.replaceChildren(...visibleResults.map(createResult));
    if (!items.length) {
      count.textContent = 'Search index is unavailable.';
    } else if (!terms.length) {
      count.textContent = `${items.length} indexed pages`;
    } else if (!results.length) {
      count.textContent = `No results for "${query}"`;
    } else {
      count.textContent = `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`;
    }
  }

  const debouncedRender = debounce(render);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const query = input.value.trim();
    if (query) params.set('q', query);
    else params.delete('q');
    window.history.replaceState(null, '', `${window.location.pathname}${params.size ? `?${params}` : ''}`);
    render();
  });
  input.addEventListener('input', debouncedRender);

  try {
    items = await loadIndex();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
  render();
}
