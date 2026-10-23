const toggle = document.querySelector('#menuToggle');
const nav = document.querySelector('#nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  toggle.textContent = open ? '×' : '☰';
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = '☰';
}));
document.querySelector('#year').textContent = new Date().getFullYear();
