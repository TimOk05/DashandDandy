const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const dialog = document.querySelector('[data-enquiry-dialog]');
const enquiryForm = document.querySelector('[data-enquiry-form]');
const formStatus = document.querySelector('[data-form-status]');
const instagramReady = document.querySelector('[data-instagram-ready]');

const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('.sr-only').textContent = 'Open navigation';
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.querySelector('.sr-only').textContent = isOpen ? 'Open navigation' : 'Close navigation';
  menu.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const setHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 24);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

document.querySelectorAll('[data-open-enquiry]').forEach((button) => {
  button.addEventListener('click', () => {
    closeMenu();
    formStatus.textContent = '';
    instagramReady.classList.remove('is-visible');
    dialog.showModal();
    window.setTimeout(() => dialog.querySelector('input').focus(), 50);
  });
});

document.querySelector('[data-close-enquiry]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

enquiryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;

  const data = new FormData(enquiryForm);
  const notes = data.get('notes').trim();
  const message = [
    `Hi Dash & Dandy, I'm ${data.get('owner').trim()}.`,
    `I'd like to enquire about ${data.get('service').toLowerCase()} for ${data.get('dog').trim()}, a ${data.get('breed').trim()}.`,
    notes ? `A little more information: ${notes}` : '',
    'Could you let me know about availability and pricing? Thank you!'
  ].filter(Boolean).join(' ');

  try {
    await navigator.clipboard.writeText(message);
    formStatus.textContent = 'Message copied. Open Instagram and paste it into a DM.';
  } catch {
    formStatus.textContent = `Copy this message: ${message}`;
  }
  instagramReady.classList.add('is-visible');
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
