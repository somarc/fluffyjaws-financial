export default function decorate(block) {
  const table = document.createElement('table');
  [...block.children].forEach((row, index) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const el = document.createElement(index === 0 ? 'th' : 'td');
      el.innerHTML = cell.innerHTML;
      tr.append(el);
    });
    table.append(tr);
  });
  block.replaceChildren(table);
}
