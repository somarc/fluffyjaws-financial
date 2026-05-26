function parsePrice(value) {
  const number = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function formatPrice(value) {
  if (value >= 1000) return `$${Math.round(value).toLocaleString('en-US')}`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(4)}`;
}

function appendText(parent, tagName, text) {
  const element = document.createElement(tagName);
  element.textContent = text;
  parent.append(element);
  return element;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      label: cells[0]?.textContent.trim() || '',
      price: parsePrice(cells[1]?.textContent.trim() || '0'),
      note: cells[2]?.textContent.trim() || '',
    };
  }).filter((row) => row.label && row.price > 0);

  if (!rows.length) return;

  const first = rows[0].price;
  const max = Math.max(...rows.map((row) => row.price));
  const chart = document.createElement('div');
  chart.className = 'price-chart-plot';

  rows.forEach((row) => {
    const bar = document.createElement('div');
    bar.className = 'price-chart-row';
    const appreciation = row.price / first;

    const label = document.createElement('div');
    label.className = 'price-chart-label';
    appendText(label, 'strong', row.label);
    appendText(label, 'span', row.note);

    const track = document.createElement('div');
    track.className = 'price-chart-track';
    track.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('span');
    fill.style.setProperty('--bar-size', `${Math.max(3, (row.price / max) * 100).toFixed(2)}%`);
    track.append(fill);

    const value = document.createElement('div');
    value.className = 'price-chart-value';
    appendText(value, 'strong', formatPrice(row.price));
    appendText(value, 'span', `${appreciation.toLocaleString('en-US', { maximumFractionDigits: 1 })}x`);

    bar.append(label, track, value);
    chart.append(bar);
  });

  const summary = document.createElement('p');
  summary.className = 'price-chart-disclaimer';
  summary.textContent = 'Fictional benchmark data. FluffyCoins do not exist, trade, appreciate, or represent financial value.';

  block.replaceChildren(chart, summary);
}
