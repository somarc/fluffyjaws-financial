function numberCell(value) {
  return Number.parseFloat(value || '0');
}

function bitsForProbability(probability) {
  if (probability <= 0) return 0;
  return -Math.log2(probability);
}

function weightedBits(rows) {
  return rows.reduce((sum, row) => sum + (row.probability * row.bits), 0);
}

function makeMeter(label, value, max) {
  const item = document.createElement('div');
  item.className = 'entropy-lab-meter';

  const text = document.createElement('span');
  text.textContent = label;

  const track = document.createElement('div');
  const fill = document.createElement('i');
  fill.style.width = `${Math.min(100, (value / max) * 100)}%`;
  track.append(fill);

  const score = document.createElement('strong');
  score.textContent = `${value.toFixed(2)} bits`;

  item.append(text, track, score);
  return item;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')]
    .map((row) => {
      const cells = [...row.children];
      const label = cells[0]?.textContent.trim() || 'Signal';
      const probability = numberCell(cells[1]?.textContent);
      const bits = bitsForProbability(probability);
      return { label, probability, bits };
    })
    .filter((row) => row.probability > 0);

  const maxBits = Math.max(1, ...rows.map((row) => row.bits));
  const average = weightedBits(rows);

  block.textContent = '';

  const shell = document.createElement('div');
  shell.className = 'entropy-lab-shell';

  const intro = document.createElement('div');
  intro.className = 'entropy-lab-intro';
  intro.innerHTML = `
    <p class="entropy-lab-kicker">Signal budget</p>
    <h2>Surprise is what the message costs.</h2>
    <p>Common messages compress into short codes. Rare messages need more bits because they rule out more possible worlds.</p>
  `;

  const formula = document.createElement('div');
  formula.className = 'entropy-lab-formula';
  formula.innerHTML = '<span>-log<sub>2</sub>(p)</span><strong>= bits of surprise</strong>';

  const meters = document.createElement('div');
  meters.className = 'entropy-lab-meters';
  rows.forEach((row) => meters.append(makeMeter(row.label, row.bits, maxBits)));

  const footer = document.createElement('p');
  footer.className = 'entropy-lab-average';
  footer.textContent = `Expected message length: ${average.toFixed(2)} bits when these signals repeat at their stated probabilities.`;

  shell.append(intro, formula, meters, footer);
  block.append(shell);
}
