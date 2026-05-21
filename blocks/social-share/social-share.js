export default function decorate(block) {
  const title = encodeURIComponent(document.title || 'FluffyJaws Financial');
  const url = encodeURIComponent(window.location.href);
  block.textContent = '';
  [
    ['LinkedIn', `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`],
    ['X', `https://twitter.com/intent/tweet?url=${url}&text=${title}`],
    ['Email', `mailto:?subject=${title}&body=${url}`],
  ].forEach(([label, href]) => {
    const link = document.createElement('a');
    link.className = 'button secondary';
    link.href = href;
    link.textContent = label;
    block.append(link);
  });
}
