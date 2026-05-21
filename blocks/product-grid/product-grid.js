export default function decorate(block) {
  const cards = [...block.children].map((row) => {
    const cells = [...row.children];
    const card = document.createElement('article');
    card.className = 'product-grid-card';
    const media = cells[0]?.querySelector('picture, img');
    if (media) {
      const figure = document.createElement('div');
      figure.className = 'product-grid-media';
      figure.append(media);
      card.append(figure);
    }
    const body = document.createElement('div');
    body.className = 'product-grid-body';
    cells.slice(media ? 1 : 0).forEach((cell) => {
      while (cell.firstChild) body.append(cell.firstChild);
    });
    card.append(body);
    return card;
  });
  block.replaceChildren(...cards);
}
