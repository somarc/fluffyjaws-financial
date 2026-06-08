export default function decorate(block) {
  const rows = [...block.children];
  const header = rows.shift();
  const title = header?.children[0]?.textContent?.trim();
  const intro = header?.children[1]?.textContent?.trim();

  const shell = document.createElement('div');
  shell.className = 'liquidity-rails-shell';

  if (title || intro) {
    const mast = document.createElement('div');
    mast.className = 'liquidity-rails-mast';
    if (title) {
      const heading = document.createElement('h2');
      heading.textContent = title;
      mast.append(heading);
    }
    if (intro) {
      const copy = document.createElement('p');
      copy.textContent = intro;
      mast.append(copy);
    }
    shell.append(mast);
  }

  const track = document.createElement('div');
  track.className = 'liquidity-rails-track';

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const card = document.createElement('article');
    card.className = 'liquidity-rail';
    card.style.setProperty('--rail-index', String(index + 1).padStart(2, '0'));

    const label = cells[0]?.textContent?.trim();
    if (label) {
      const badge = document.createElement('p');
      badge.className = 'liquidity-rail-label';
      badge.textContent = label;
      card.append(badge);
    }

    cells.slice(1).forEach((cell) => {
      while (cell.firstChild) card.append(cell.firstChild);
    });

    track.append(card);
  });

  shell.append(track);
  block.replaceChildren(shell);
}
