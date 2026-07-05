const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');
const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

let lastScrollY = window.scrollY;
let headerVisible = true;
let hideAfterNavClick = false;
let manualScroll = false;
let manualScrollTimeout = 0;

const markManualScroll = () => {
  manualScroll = true;
  clearTimeout(manualScrollTimeout);
  manualScrollTimeout = window.setTimeout(() => {
    manualScroll = false;
  }, 150);
};

const updateHeaderVisibility = () => {
  if (!header) return;

  const currentScrollY = window.scrollY;
  const delta = currentScrollY - lastScrollY;

  if (currentScrollY <= 0) {
    headerVisible = true;
    hideAfterNavClick = false;
  } else if (hideAfterNavClick) {
    if (manualScroll && delta < -10) {
      headerVisible = true;
      hideAfterNavClick = false;
    } else {
      headerVisible = false;
    }
  } else if (delta > 10) {
    headerVisible = false;
  } else if (delta < -10 && manualScroll) {
    headerVisible = true;
  }

  header.classList.toggle('visible', headerVisible);
  lastScrollY = currentScrollY;
};

window.addEventListener('scroll', updateHeaderVisibility, { passive: true });
window.addEventListener('wheel', markManualScroll, { passive: true });
window.addEventListener('touchmove', markManualScroll, { passive: true });
updateHeaderVisibility();

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (siteNav) {
  siteNav.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      headerVisible = false;
      hideAfterNavClick = true;
      header?.classList.remove('visible');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
