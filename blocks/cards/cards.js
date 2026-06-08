import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // if a card body contains only a standalone link paragraph, use it as the card href
  ul.querySelectorAll('li').forEach((li) => {
    const body = li.querySelector('.cards-card-body');
    if (!body) return;
    const linkPara = [...body.querySelectorAll('p')].find(
      (p) => p.children.length === 1 && p.firstElementChild.tagName === 'A'
        && p.textContent.trim() === p.firstElementChild.textContent.trim(),
    );
    if (!linkPara) return;
    const { href } = linkPara.querySelector('a');
    linkPara.remove();
    const a = document.createElement('a');
    a.href = href;
    a.className = 'cards-card-link';
    while (li.firstChild) a.append(li.firstChild);
    li.append(a);
  });

  block.replaceChildren(ul);
}
