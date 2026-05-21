function currency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function formatFieldValue(key, value) {
  if (key === 'rate') return `${value}%`;
  if (key === 'years') return `${value} years`;
  return currency(value);
}

export default function decorate(block) {
  const labels = [...block.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);
  const defaults = {
    principal: 5000, monthly: 250, years: 10, rate: 5,
  };
  block.textContent = '';

  const fields = [
    ['principal', 'Starting amount', 500, 100000, 500],
    ['monthly', 'Monthly contribution', 0, 5000, 50],
    ['years', 'Years', 1, 40, 1],
    ['rate', 'Illustrative annual return %', 0, 15, 0.25],
  ];

  const form = document.createElement('form');
  form.className = 'calculator-form';
  const values = { ...defaults };
  fields.forEach(([key, label, min, max, step]) => {
    const field = document.createElement('label');
    field.innerHTML = `<span>${label}</span><input name="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${values[key]}"><output></output>`;
    form.append(field);
  });

  const result = document.createElement('div');
  result.className = 'calculator-result';
  result.setAttribute('aria-live', 'polite');

  function render() {
    fields.forEach(([key]) => {
      const input = form.elements[key];
      values[key] = Number(input.value);
      input.nextElementSibling.textContent = formatFieldValue(key, values[key]);
    });
    const months = values.years * 12;
    const monthlyRate = values.rate / 100 / 12;
    let total = values.principal;
    for (let i = 0; i < months; i += 1) total = (total + values.monthly) * (1 + monthlyRate);
    result.innerHTML = `<strong>${currency(total)}</strong><span>fictional projected balance</span><small>${labels[0] || 'For demo purposes only. Not financial advice.'}</small>`;
  }

  form.addEventListener('input', render);
  block.append(form, result);
  render();
}
