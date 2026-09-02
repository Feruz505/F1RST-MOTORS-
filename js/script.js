// ---------- Search toggle ----------
const searchToggle = document.getElementById('searchToggle');
const searchPanel = document.getElementById('searchPanel');
if (searchToggle && searchPanel) {
  searchToggle.addEventListener('click', () => {
    searchPanel.classList.toggle('open');
    if (searchPanel.classList.contains('open')) {
      searchPanel.querySelector('input')?.focus();
    }
  });
}

// ---------- Hero 3D parallax (mouse-driven) ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initParallax(stageEl) {
  if (!stageEl || reduceMotion) return;
  const layers = stageEl.querySelectorAll('[data-depth]');

  stageEl.addEventListener('mousemove', (e) => {
    const rect = stageEl.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    layers.forEach((el) => {
      const depth = parseFloat(el.dataset.depth) || 10;
      const x = px * depth;
      const y = py * depth;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    stageEl.style.transform = `rotateY(${px * 3}deg) rotateX(${-py * 3}deg)`;
  });

  stageEl.addEventListener('mouseleave', () => {
    layers.forEach((el) => (el.style.transform = 'translate3d(0,0,0)'));
    stageEl.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

initParallax(document.getElementById('heroStage'));
initParallax(document.getElementById('showStage'));

// ---------- Card tilt (catalog) ----------
if (!reduceMotion) {
  document.querySelectorAll('.tilt-inner').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  });
}

// ---------- Thumb strip swaps showcase car color ----------
const paintByCar = { m8: 'c-black', m4: 'c-white', '911': 'c-silver' };
document.querySelectorAll('.thumb[data-car]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.thumb').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const body = document.querySelector('#showStage .car-body');
    if (!body) return;
    body.classList.remove('c-black', 'c-white', 'c-silver', 'c-graphite');
    body.classList.add(paintByCar[btn.dataset.car] || 'c-black');
  });
});

// ---------- Catalog live search ----------
const carSearch = document.getElementById('carSearch');
if (carSearch) {
  carSearch.addEventListener('input', () => {
    const q = carSearch.value.trim().toLowerCase();
    document.querySelectorAll('.car-card').forEach((card) => {
      const name = card.dataset.name || '';
      card.classList.toggle('hidden', q.length > 0 && !name.includes(q));
    });
  });
}

// ---------- Request buttons (placeholder action) ----------
document.querySelectorAll('.car-card .btn-outline').forEach((btn) => {
  btn.addEventListener('click', () => {
    const name = btn.closest('.car-card')?.querySelector('h3')?.textContent || 'this car';
    alert(`Request sent for ${name}. We'll be in touch shortly.`);
  });
});
