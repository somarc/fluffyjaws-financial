const LOTTIE_WEB_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
const DEFAULT_HERO_LOTTIE = '/media/fluffyjaws-financial-hero.lottie.json';
const HERO_LOTTIE_SPEED = 0.4;

let lottieLoader;

function loadLottieWeb() {
  if (window.lottie) return Promise.resolve(window.lottie);
  if (lottieLoader) return lottieLoader;

  lottieLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = LOTTIE_WEB_SRC;
    script.async = true;
    script.onload = () => resolve(window.lottie);
    script.onerror = reject;
    document.head.append(script);
  });

  return lottieLoader;
}

function decorateLottieHero(block, path, link) {
  const stage = document.createElement('div');
  stage.className = 'hero-lottie';
  stage.setAttribute('aria-hidden', 'true');
  if (link) {
    link.replaceWith(stage);
  } else {
    block.prepend(stage);
  }

  loadLottieWeb()
    .then((lottie) => {
      if (!lottie) return;
      const animation = lottie.loadAnimation({
        container: stage,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
          progressiveLoad: true,
        },
      });
      animation.setSpeed(HERO_LOTTIE_SPEED);
      block.classList.add('hero-lottie-ready');
    })
    .catch(() => {
      block.classList.add('hero-lottie-failed');
    });
}

export default function decorate(block) {
  const lottieLink = block.querySelector('a[href$=".json"]');
  const lottiePath = lottieLink?.href || DEFAULT_HERO_LOTTIE;
  decorateLottieHero(block, lottiePath, lottieLink);
}
