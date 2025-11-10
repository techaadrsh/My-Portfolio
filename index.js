/* -------------------------
   Animated portfolio JS
   - Theme toggle (persist)
   - Typing effect
   - Scroll reveal & section animation
   - Skill bars counter
   - Modal viewer for projects
   - Mobile menu toggle
   - Parallax hero title
   - Floating particles
   - Small UI polish (nav link click animation)
   ------------------------- */


   

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

/* ---------------- Theme Toggle ---------------- */
const root = document.documentElement;
const themeToggleBtn = $('#theme-toggle');
const themeIcon = $('#theme-icon');
function applyTheme(theme) {
  if (theme === 'light') {
    root.classList.add('light');
    themeIcon.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  } else {
    root.classList.remove('light');
    themeIcon.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  }
}
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isLight = root.classList.contains('light');
    applyTheme(isLight ? 'dark' : 'light');
  });
}







/* ✅ FINAL FIX FOR MOBILE MENU  */
const menuBtn2 = document.getElementById("menu-btn");
const mobileNav2 = document.getElementById("mobile-nav");
const closeBtn2 = document.getElementById("close-btn");

/* Open menu */
menuBtn2.addEventListener("click", () => {
  mobileNav2.classList.add("active");
});

/* Close menu */
closeBtn2.addEventListener("click", () => {
  mobileNav2.classList.remove("active");
});

/* Click outside to close */
document.addEventListener("click", (e) => {
  if (!mobileNav2.contains(e.target) && !menuBtn2.contains(e.target)) {
    mobileNav2.classList.remove("active");
  }
});







/* ---------------- Mobile Menu ---------------- */
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const mobileNav = document.getElementById("mobile-nav");

menuBtn.addEventListener("click", () => {
  mobileNav.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  mobileNav.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
    mobileNav.classList.remove("active");
  }
});

// const menuBtn = $('#menu-btn');
// const mobileNav = $('#mobile-nav');
// if (menuBtn && mobileNav) {
//   menuBtn.addEventListener('click', () => {
//     const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
//     menuBtn.setAttribute('aria-expanded', String(!expanded));
//     mobileNav.setAttribute('aria-hidden', String(expanded));
//   });
//   // close when mobile link clicked
//   $$('.mobile-link').forEach(link => link.addEventListener('click', () => {
//     menuBtn.setAttribute('aria-expanded', 'false');
//     mobileNav.setAttribute('aria-hidden', 'true');
//   }));
// }





/* ---------------- Typing effect ---------------- */
const typedEl = $('#typed');
const typingWords = ['Web Developer', 'Front-End Developer', 'Problem Solver', 'Creative'];

let twIndex = 0, chIndex = 0, deleting = false;
function typeLoop() {
  if (!typedEl) return;
  const word = typingWords[twIndex];
  if (!deleting) {
    chIndex++;
    typedEl.textContent = word.slice(0, chIndex);
    if (chIndex === word.length) {
      deleting = true;
      setTimeout(typeLoop, 900);
      return;
    }
  } else {
    chIndex--;
    typedEl.textContent = word.slice(0, chIndex);
    if (chIndex === 0) {
      deleting = false;
      twIndex = (twIndex + 1) % typingWords.length;
      setTimeout(typeLoop, 300);
      return;
    }
  }
  setTimeout(typeLoop, deleting ? 50 : 100);
}
typeLoop();

/* ---------------- Scroll reveal & section animation ---------------- */
const revealEls = $$('.reveal');
const sections = $$('.section');
const projectCards = $$('.project-card');

function onScrollReveal() {
  const vh = window.innerHeight;
  revealEls.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh - 80) el.classList.add('visible');
  });

  sections.forEach(section => {
    const r = section.getBoundingClientRect();
    if (r.top < vh - 120) {
      section.classList.add('visible');
      // reveal child project cards with small stagger
      if (section.id === 'projects') {
        projectCards.forEach((card, i) => setTimeout(() => card.classList.add('visible'), i * 90));
      }
    }
  });

  document.querySelectorAll('.site-nav a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      // remove from all
      document.querySelectorAll('.site-nav a').forEach(x=>x.classList.remove('active'));
      // set on clicked
      e.currentTarget.classList.add('active');
      // allow regular anchor behavior (you can preventDefault if using SPA)
    });
  });

  // parallax: hero title slight translate on scroll
  const heroTitle = $('.hero-title');
  if (heroTitle) {
    const hero = $('#home');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const offset = Math.max(-40, Math.min(40, -rect.top * 0.08));
      heroTitle.style.transform = `translateY(${offset}px)`;
    }
  }
}
window.addEventListener('scroll', onScrollReveal, {passive:true});
window.addEventListener('load', onScrollReveal);

/* ---------------- Skill bars ---------------- */
const skillBars = $$('.bar');
const skillPercents = $$('.skill-percent');
let skillsAnimated = false;
function animateSkills() {
  if (skillsAnimated) return;
  const skillsSection = $('#skills');
  if (!skillsSection) return;
  const rect = skillsSection.getBoundingClientRect();
  if (rect.top > window.innerHeight - 100) return;

  skillBars.forEach((bar, idx) => {
    const target = Number(bar.dataset.target) || 0;
    const fill = bar.querySelector('.fill');
    requestAnimationFrame(() => fill.style.width = target + '%');

    const percentEl = skillPercents[idx];
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        percentEl.textContent = target + '%';
        clearInterval(timer);
      } else {
        percentEl.textContent = current + '%';
      }
    }, 16);
  });

  skillsAnimated = true;
}
window.addEventListener('scroll', animateSkills, {passive:true});
window.addEventListener('load', animateSkills);

/* ---------------- Project modal ---------------- */
const modal = $('#modal');
const modalContent = $('#modal-content');
const modalClose = modal ? modal.querySelector('.modal-close') : null;

function openModal(projectId) {
  if (!modal || !modalContent) return;
  modal.setAttribute('aria-hidden', 'false');
  modalContent.innerHTML = '';
  const img = document.createElement('img');
  img.src = `assets/project${projectId}.jpg`;
  img.alt = `Project ${projectId} screenshot`;
  img.style.maxWidth = '100%';
  img.style.borderRadius = '8px';
  modalContent.appendChild(img);
  modalContent.focus();
}

function closeModal() {
  if (!modal || !modalContent) return;
  modal.setAttribute('aria-hidden', 'true');
  modalContent.innerHTML = '';
}

$$('.modal-open').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.project;
    openModal(id);
  });
});
if (modal) {
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') closeModal(); });
if (modalClose) modalClose.addEventListener('click', closeModal);

/* ---------------- Contact (demo) ---------------- */
const form = $('#contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = true;
    btn.textContent = 'Sending...';
    setTimeout(() => {
      btn.textContent = 'Sent ✓';
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Send';
      }, 1600);
    }, 1000);
  });
}

/* ---------------- Small UI touches ---------------- */
// set current year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// show keyboard focus outlines only when user tabs
(function keyboardOutlineToggle(){
  function handleFirstTab(e){
    if (e.key === 'Tab') document.body.classList.add('show-focus');
    window.removeEventListener('keydown', handleFirstTab);
  }
  window.addEventListener('keydown', handleFirstTab);
})();

// nav link click animation (pulse brand)
$$('.site-nav a, .mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    const brand = document.querySelector('.brand');
    if (!brand) return;
    brand.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
  });
});

/* ---------------- Floating particles ---------------- */
function spawnParticles(count = 24) {
  const container = $('#particles');
  if (!container) return;
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = 4 + Math.random() * 8;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = Math.random() * vw + 'px';
    p.style.top = Math.random() * vh + 'px';
    p.style.opacity = (0.05 + Math.random() * 0.22).toString();
    p.style.animationDuration = (8 + Math.random() * 14) + 's';
    p.style.animationDelay = (-Math.random() * 8) + 's';
    container.appendChild(p);
    // remove after animation cycle to keep DOM light
    setTimeout(() => {
      if (p && p.parentNode) p.parentNode.removeChild(p);
    }, 22000);
  }
}
// spawn periodically but light
spawnParticles(26);
setInterval(() => spawnParticles(12), 9000);

/* ---------------- Initial small delay reveal call ---------------- */
setTimeout(() => onScrollReveal(), 250);
