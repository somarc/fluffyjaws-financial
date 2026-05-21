export default function decorate(block) {
  const items = [...block.querySelectorAll('li')].map((li) => li.cloneNode(true));
  block.textContent = '';
  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Search fictional products and guides';
  input.setAttribute('aria-label', input.placeholder);
  const list = document.createElement('ul');
  list.className = 'search-results';
  block.append(input, list);

  function render() {
    const query = input.value.trim().toLowerCase();
    const matches = items.filter((li) => !query || li.textContent.toLowerCase().includes(query));
    list.replaceChildren(...matches.map((li) => li.cloneNode(true)));
  }

  input.addEventListener('input', render);
  render();
}
