export default function decorate(block) {
  const list = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    [...row.children].forEach((cell) => {
      while (cell.firstChild) li.append(cell.firstChild);
    });
    list.append(li);
  });
  block.replaceChildren(list);
}
