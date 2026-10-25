const loader = document.getElementById('loader');
window.addEventListener('load', () => setTimeout(() => loader.classList.add('done'), 850));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.textContent = '☰';
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Gentle image parallax on larger screens only.
const heroImage = document.querySelector('.hero-image');
window.addEventListener('scroll', () => {
  if (window.innerWidth > 700 && heroImage) {
    const y = Math.min(window.scrollY * 0.08, 65);
    heroImage.style.objectPosition = `center calc(50% + ${y}px)`;
  }
}, { passive: true });


// Cinematic intro: show once per tab/session, with a skip control.
document.body.classList.add('intro-active');
const cinematicIntro = document.getElementById('cinematicIntro');
const introSkip = document.getElementById('introSkip');
const introSeen = sessionStorage.getItem('maisonIntroSeen');
function closeIntro() {
  cinematicIntro.classList.add('exit');
  document.body.classList.remove('intro-active');
  sessionStorage.setItem('maisonIntroSeen', 'yes');
}
if (introSeen) closeIntro();
introSkip.addEventListener('click', closeIntro);
if (!introSeen) window.setTimeout(closeIntro, 3200);

// Filter menu cards with a small staggered entrance.
const filterButtons = document.querySelectorAll('.filter-chip');
const menuCards = document.querySelectorAll('.menu-card[data-category]');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    menuCards.forEach((card, index) => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('filtered-out', !shouldShow);
      if (shouldShow) {
        card.animate(
          [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 380, delay: index * 70, easing: 'cubic-bezier(.2,.7,.2,1)' }
        );
      }
    });
  });
});

// Add gentle pointer movement to the hero image on desktop.
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.matchMedia('(pointer:fine)').matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    heroVisual.style.transform = `perspective(900px) rotateY(${x * 2.5}deg) rotateX(${-y * 2}deg)`;
  });
  heroVisual.addEventListener('pointerleave', () => {
    heroVisual.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
  });
}
