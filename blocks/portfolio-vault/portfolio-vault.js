const ASSETS = [
  {
    key: 'bonds',
    label: 'FluffyJaws Bonds',
    allocation: 42,
    risk: 18,
    return: 4.8,
    liquidity: 62,
    color: '#28a46a',
    note: 'Stable ladder, lower volatility, steady fictional yield.',
  },
  {
    key: 'etfs',
    label: 'FluffyJaws ETFs',
    allocation: 38,
    risk: 45,
    return: 7.2,
    liquidity: 78,
    color: '#2f80ed',
    note: 'Diversified basket with moderate risk and high liquidity.',
  },
  {
    key: 'coins',
    label: 'FluffyCoins',
    allocation: 20,
    risk: 86,
    return: 12.5,
    liquidity: 39,
    color: '#f06b4f',
    note: 'High-volatility fiction with dramatic upside and downside.',
  },
];

const SCENES = {
  builder: {
    title: 'Portfolio Builder',
    copy: 'Allocation towers grow inside the vault as users tune their fictional mix.',
  },
  globe: {
    title: 'Market Scatter',
    copy: 'Asset points orbit by risk, return, and liquidity for quick comparison.',
  },
  growth: {
    title: 'Growth Visualizer',
    copy: 'Projected value becomes a rising path instead of a flat calculator result.',
  },
  risk: {
    title: 'Risk Outcome',
    copy: 'Conservative and aggressive profiles shift camera motion, color, and volatility.',
  },
};

const THREE_MODULE_URL = 'https://unpkg.com/three@0.165.0/build/three.module.js';

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function normalizeAllocations(state, changedKey) {
  const changed = state.assets.find((asset) => asset.key === changedKey);
  const others = state.assets.filter((asset) => asset.key !== changedKey);
  const remaining = Math.max(0, 100 - changed.allocation);
  const otherTotal = others.reduce((sum, asset) => sum + asset.allocation, 0) || 1;
  others.forEach((asset) => {
    asset.allocation = Math.round((asset.allocation / otherTotal) * remaining);
  });
  const total = state.assets.reduce((sum, asset) => sum + asset.allocation, 0);
  if (total !== 100) others[0].allocation += 100 - total;
}

function weightedMetric(state, key) {
  return state.assets.reduce((sum, asset) => sum + ((asset.allocation / 100) * asset[key]), 0);
}

function renderSummary(block, state) {
  const risk = weightedMetric(state, 'risk');
  const returns = weightedMetric(state, 'return');
  const liquidity = weightedMetric(state, 'liquidity');
  block.querySelector('[data-summary-risk]').textContent = `${Math.round(risk)}/100`;
  block.querySelector('[data-summary-return]').textContent = `${returns.toFixed(1)}%`;
  block.querySelector('[data-summary-liquidity]').textContent = `${Math.round(liquidity)}/100`;
  block.querySelector('[data-scene-title]').textContent = SCENES[state.mode].title;
  block.querySelector('[data-scene-copy]').textContent = SCENES[state.mode].copy;
}

function decorateFallback(block, state, onUpdate) {
  const shell = makeElement('div', 'portfolio-vault-shell');
  const stage = makeElement('div', 'portfolio-vault-stage');
  const canvas = makeElement('canvas', 'portfolio-vault-canvas');
  const fallback = makeElement('div', 'portfolio-vault-fallback');
  fallback.setAttribute('aria-hidden', 'true');

  state.assets.forEach((asset) => {
    const pillar = makeElement('span', `portfolio-vault-pillar ${asset.key}`);
    pillar.style.setProperty('--height', `${asset.allocation}%`);
    pillar.style.setProperty('--asset-color', asset.color);
    fallback.append(pillar);
  });

  const controls = makeElement('div', 'portfolio-vault-controls');
  const modeGroup = makeElement('div', 'portfolio-vault-modes');
  Object.entries(SCENES).forEach(([key, scene]) => {
    const button = makeElement('button', '', scene.title);
    button.type = 'button';
    button.dataset.mode = key;
    button.setAttribute('aria-pressed', key === state.mode ? 'true' : 'false');
    button.addEventListener('click', () => {
      state.mode = key;
      modeGroup.querySelectorAll('button').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      renderSummary(block, state);
      onUpdate();
    });
    modeGroup.append(button);
  });

  const allocationGroup = makeElement('div', 'portfolio-vault-allocations');
  state.assets.forEach((asset) => {
    const label = makeElement('label', '');
    label.innerHTML = `<span>${asset.label}</span><input type="range" min="0" max="100" step="1" value="${asset.allocation}"><output>${asset.allocation}%</output>`;
    const input = label.querySelector('input');
    input.addEventListener('input', () => {
      asset.allocation = Number(input.value);
      normalizeAllocations(state, asset.key);
      state.assets.forEach((nextAsset, index) => {
        const nextLabel = allocationGroup.children[index];
        nextLabel.querySelector('input').value = nextAsset.allocation;
        nextLabel.querySelector('output').textContent = `${nextAsset.allocation}%`;
      });
      fallback.querySelectorAll('.portfolio-vault-pillar').forEach((pillar, index) => {
        pillar.style.setProperty('--height', `${state.assets[index].allocation}%`);
      });
      renderSummary(block, state);
      onUpdate();
    });
    allocationGroup.append(label);
  });

  const panel = makeElement('aside', 'portfolio-vault-panel');
  panel.innerHTML = `
    <p class="eyebrow">Three.js lab</p>
    <h2 data-scene-title></h2>
    <p data-scene-copy></p>
    <dl>
      <div><dt>Weighted risk</dt><dd data-summary-risk></dd></div>
      <div><dt>Projected return</dt><dd data-summary-return></dd></div>
      <div><dt>Liquidity</dt><dd data-summary-liquidity></dd></div>
    </dl>
  `;

  controls.append(modeGroup, allocationGroup);
  stage.append(canvas, fallback);
  shell.append(stage, panel, controls);
  block.replaceChildren(shell);
  renderSummary(block, state);

  return { canvas };
}

async function loadThreeScene(canvas, state) {
  const {
    AmbientLight,
    BoxGeometry,
    Color,
    DirectionalLight,
    Group,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    SphereGeometry,
    TorusGeometry,
    WebGLRenderer,
  } = await import(THREE_MODULE_URL);

  const scene = new Scene();
  scene.background = new Color('#07110f');
  const camera = new PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(4.8, 4.1, 7);
  camera.lookAt(0, 0.25, 0);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  scene.add(new AmbientLight('#cde9df', 1.35));
  const keyLight = new DirectionalLight('#ffffff', 2.4);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  const vault = new Group();
  scene.add(vault);

  const base = new Mesh(
    new TorusGeometry(2.5, 0.045, 12, 96),
    new MeshStandardMaterial({
      color: '#96e6c2',
      emissive: '#123f30',
      metalness: 0.15,
      roughness: 0.35,
    }),
  );
  base.rotation.x = Math.PI / 2;
  vault.add(base);

  const assetMeshes = state.assets.map((asset, index) => {
    const x = (index - 1) * 1.35;
    const pillar = new Mesh(
      new BoxGeometry(0.68, 1, 0.68),
      new MeshStandardMaterial({ color: asset.color, roughness: 0.42, metalness: 0.22 }),
    );
    pillar.position.x = x;
    vault.add(pillar);

    const marker = new Mesh(
      new SphereGeometry(0.17, 24, 16),
      new MeshStandardMaterial({
        color: asset.color,
        emissive: asset.color,
        emissiveIntensity: 0.22,
      }),
    );
    marker.position.set(x, 1.7, 0);
    vault.add(marker);
    return { asset, pillar, marker };
  });

  const particles = Array.from({ length: 34 }, (_, index) => {
    const particle = new Mesh(
      new SphereGeometry(0.035 + ((index % 4) * 0.008), 12, 8),
      new MeshStandardMaterial({ color: index % 3 === 0 ? '#f06b4f' : '#9ee7c7', emissive: '#173c32' }),
    );
    vault.add(particle);
    return particle;
  });

  function resize() {
    const { clientWidth, clientHeight } = canvas;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }

  function updateObjects(time = 0) {
    const modeLift = {
      builder: 0,
      globe: 0.7,
      growth: 1.1,
      risk: 0.25,
    }[state.mode];

    assetMeshes.forEach(({ asset, pillar, marker }, index) => {
      const height = 0.45 + (asset.allocation / 100) * 3.5;
      pillar.scale.y += (height - pillar.scale.y) * 0.08;
      pillar.position.y = pillar.scale.y / 2 - 1.15;
      const orbit = time * (0.0004 + (asset.risk / 180000)) + index * 2.1;
      marker.position.x = pillar.position.x + Math.cos(orbit) * modeLift;
      marker.position.y = pillar.position.y
        + pillar.scale.y
        + 0.38
        + Math.sin(orbit * 1.7) * 0.14;
      marker.position.z = Math.sin(orbit) * modeLift;
    });

    particles.forEach((particle, index) => {
      const angle = time * (0.00018 + (index % 5) * 0.000035) + index;
      const radius = 1.45 + (index % 7) * 0.18;
      particle.position.set(
        Math.cos(angle) * radius,
        -0.35 + Math.sin(angle * 1.4) * 0.42,
        Math.sin(angle) * radius,
      );
    });

    vault.rotation.y = time * (state.mode === 'risk' ? 0.00022 : 0.00014);
    vault.rotation.x = Math.sin(time * 0.00018) * 0.06;
  }

  let frame;
  function render(time) {
    resize();
    updateObjects(time);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }

  render(0);

  return {
    update: updateObjects,
    destroy() {
      cancelAnimationFrame(frame);
      renderer.dispose();
      [
        base,
        ...assetMeshes.flatMap(({ pillar, marker }) => [pillar, marker]),
        ...particles,
      ].forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    },
  };
}

export default function decorate(block) {
  const state = {
    mode: 'builder',
    assets: ASSETS.map((asset) => ({ ...asset })),
  };
  let sceneApi;
  const { canvas } = decorateFallback(block, state, () => sceneApi?.update(performance.now()));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !window.WebGLRenderingContext) return;

  const observer = new IntersectionObserver(async (entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    try {
      sceneApi = await loadThreeScene(canvas, state);
      block.classList.add('portfolio-vault-enhanced');
    } catch (error) {
      block.classList.add('portfolio-vault-static');
    }
  }, { rootMargin: '250px' });

  observer.observe(block);
}
