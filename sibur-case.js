(() => {


const viewer = document.querySelector('.image-viewer');
const fullImage = viewer.querySelector('img');

for (const image of document.querySelectorAll('main img')) {
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'zoom-trigger';
  trigger.setAttribute('aria-label', 'Увеличить изображение: ' + image.alt);
  trigger.setAttribute('aria-haspopup', 'dialog');
  image.before(trigger);
  trigger.append(image);
  trigger.addEventListener('click', () => {
    fullImage.src = image.currentSrc || image.src;
    fullImage.alt = image.alt;
    viewer.showModal();
  });
}

viewer.addEventListener('click', event => {
  if (event.target === viewer) viewer.close();
});

const themeButton = document.querySelector('.theme-toggle');
const themeRoot = document.documentElement;
let selectedTheme = window.portfolioTheme;
try { selectedTheme ||= localStorage.getItem('portfolio-theme'); } catch {}

function applyTheme(theme) {
  const light = theme === 'light';
  const nextThemeLabel = light ? 'Включить тёмную тему' : 'Включить светлую тему';
  themeRoot.dataset.theme = light ? 'light' : 'dark';
  themeButton.setAttribute('aria-label', nextThemeLabel);
  themeButton.title = nextThemeLabel;
}
applyTheme(selectedTheme);
themeButton.addEventListener('click', () => {
  const nextTheme = themeRoot.dataset.theme === 'light' ? 'dark' : 'light';
  window.portfolioTheme = nextTheme;
  try { localStorage.setItem('portfolio-theme', nextTheme); } catch {}
  applyTheme(nextTheme);
});
document.documentElement.addEventListener('pointerleave', () => document.body.classList.remove('has-pointer-gradient'));

const pointerMotion = matchMedia('(any-pointer: fine) and (prefers-reduced-motion: no-preference)');
window.addEventListener('pointermove', event => {
  if (!pointerMotion.matches || event.pointerType === 'touch') return;
  const style = document.body.style;
  style.setProperty('--pointer-x', event.clientX + 'px');
  style.setProperty('--pointer-y', event.clientY + 'px');
  document.body.classList.add('has-pointer-gradient');
}, {passive: true});
pointerMotion.addEventListener('change', () => document.body.classList.remove('has-pointer-gradient'));
const disclosures = [...document.querySelectorAll('.site-nav details')];
function closeMenus(except) {
  for (const item of disclosures) if (item !== except) item.open = false;
}
for (const item of disclosures) {
  item.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || !matchMedia('(any-hover: hover)').matches) return;
    closeMenus(item);
    item.open = true;
  });
  item.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && !item.contains(document.activeElement)) item.open = false;
  });
  item.addEventListener('toggle', () => { if (item.open) closeMenus(item); });
  item.addEventListener('keydown', event => {
    if (event.key === 'Escape' && item.open) {
      item.open = false;
      item.querySelector('summary').focus();
    }
  });
}
document.addEventListener('click', event => {
  if (!event.target.closest('.site-nav details')) closeMenus();
});

})();
