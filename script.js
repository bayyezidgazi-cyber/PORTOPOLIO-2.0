const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const themeToggle = $('#themeToggle');
const menuToggle = $('#menuToggle');
const nav = $('#nav');

// Tema gelap/terang
themeToggle.addEventListener('click', () => {
  const light = document.body.classList.toggle('light');
  themeToggle.textContent = light ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', light ? 'Aktifkan tema gelap' : 'Aktifkan tema terang');
});

// Navigasi mobile
menuToggle.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuToggle.textContent = opened ? '✕' : '☰';
  menuToggle.setAttribute('aria-expanded', String(opened));
});
$$('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.textContent = '☰';
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Tandai menu sesuai bagian yang sedang dilihat
const sections = $$('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.nav a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

// Efek muncul saat scroll
const revealItems = $$('.reveal, .section-tag, .section-title-row, .about-card, .mini-stat, .skill, .project-card, .contact-panel');
revealItems.forEach(item => item.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Filter kategori proyek
$$('.filter').forEach(button => button.addEventListener('click', () => {
  $$('.filter').forEach(item => item.classList.toggle('active', item === button));
  const category = button.dataset.filter;
  $$('.project-card').forEach(card => {
    card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category);
  });
}));

// Dialog detail proyek
const dialog = $('#projectDialog');
$$('.project-open').forEach(button => button.addEventListener('click', () => {
  $('#dialogTitle').textContent = button.dataset.project;
  dialog.showModal();
}));
$('#closeDialog').addEventListener('click', () => dialog.close());
$('#dialogOk').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

// Form demo: siapkan email di aplikasi email pengguna
$('#contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();
  const subject = encodeURIComponent(`Pesan dari ${name} - Portfolio Hanafi`);
  const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`);
  $('#formFeedback').textContent = 'Aplikasi email akan dibuka. Periksa kembali pesan sebelum mengirim.';
  window.location.href = `mailto:hanafi@example.com?subject=${subject}&body=${body}`;
});

$('.topbar').classList.add('scrolled');
window.addEventListener('scroll', () => $('.topbar').classList.toggle('scrolled', window.scrollY > 10), { passive: true });
$('#year').textContent = new Date().getFullYear();
