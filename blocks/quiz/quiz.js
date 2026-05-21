export default function decorate(block) {
  const questions = [...block.children].map((row, index) => {
    const [promptCell, ...optionCells] = [...row.children];
    const question = document.createElement('fieldset');
    question.className = 'quiz-question';
    const legend = document.createElement('legend');
    legend.textContent = promptCell.textContent.trim();
    question.append(legend);
    optionCells.forEach((cell, optionIndex) => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="radio" name="q${index}" value="${optionIndex + 1}"><span>${cell.textContent.trim()}</span>`;
      question.append(label);
    });
    return question;
  });

  const result = document.createElement('div');
  result.className = 'quiz-result';
  result.setAttribute('aria-live', 'polite');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button primary';
  button.textContent = 'Score profile';
  button.addEventListener('click', () => {
    const score = [...block.querySelectorAll('input:checked')].reduce((sum, input) => sum + Number(input.value), 0);
    let tier = 'Moonshot Mythologist';
    if (score <= 4) tier = 'Careful Allocator';
    else if (score <= 7) tier = 'Balanced Builder';
    result.textContent = `${tier}: a fictional profile for deciding which demo content to inspect next.`;
  });
  block.replaceChildren(...questions, button, result);
}
