export default function decorate(block) {
  const rows = [...block.children];
  const form = document.createElement('form');
  form.className = 'fj-form';
  rows.forEach((row) => {
    const [labelCell, typeCell] = [...row.children];
    const labelText = labelCell.textContent.trim();
    const type = typeCell?.textContent.trim() || 'text';
    const label = document.createElement('label');
    const id = labelText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const control = type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    control.id = id;
    control.name = id;
    if (type !== 'textarea') control.type = type;
    label.append(labelText, control);
    form.append(label);
  });
  const note = document.createElement('p');
  note.className = 'form-note';
  note.textContent = 'Demo form only. It does not submit or collect financial information.';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button primary';
  button.textContent = 'Request fictional consult';
  form.append(button, note);
  block.replaceChildren(form);
}
