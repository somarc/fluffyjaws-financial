export default function decorate(block) {
  const rows = [...block.children];
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');
  const panels = document.createElement('div');
  panels.className = 'tabs-panels';

  rows.forEach((row, index) => {
    const [titleCell, contentCell] = [...row.children];
    const tab = document.createElement('button');
    const id = `tab-${index}`;
    tab.type = 'button';
    tab.id = id;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.textContent = titleCell.textContent.trim();
    const panel = document.createElement('section');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', id);
    if (index !== 0) panel.hidden = true;
    while (contentCell.firstChild) panel.append(contentCell.firstChild);
    tab.addEventListener('click', () => {
      [...tablist.children].forEach((button) => button.setAttribute('aria-selected', button === tab ? 'true' : 'false'));
      [...panels.children].forEach((item) => { item.hidden = item !== panel; });
    });
    tablist.append(tab);
    panels.append(panel);
  });

  block.replaceChildren(tablist, panels);
}
