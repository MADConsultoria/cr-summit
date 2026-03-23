const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const year = document.querySelector('#year');
const countdownRoot = document.querySelector('#countdown');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (countdownRoot) {
  const elDays = document.querySelector('#cd-days');
  const elHours = document.querySelector('#cd-hours');
  const elMinutes = document.querySelector('#cd-minutes');
  const elSeconds = document.querySelector('#cd-seconds');
  const countdownLabel = countdownRoot.querySelector('.countdown-label');

  // 08/04/2026 23:59:59 (America/Sao_Paulo, UTC-03:00)
  const targetDate = new Date('2026-04-08T23:59:59-03:00');

  const pad = (n) => String(n).padStart(2, '0');

  const renderCountdown = () => {
    const now = new Date();
    const distance = targetDate.getTime() - now.getTime();

    if (distance <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      if (countdownLabel) {
        countdownLabel.textContent = 'Prazo promocional encerrado';
      }
      return false;
    }

    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
    return true;
  };

  if (renderCountdown()) {
    const timer = setInterval(() => {
      if (!renderCountdown()) {
        clearInterval(timer);
      }
    }, 1000);
  }
}

const heroSection = document.querySelector('.hero');
const heroArtImage = document.querySelector('.hero-art img');

if (heroSection && heroArtImage) {
  let ticking = false;

  const updateHeroArtParallax = () => {
    const rect = heroSection.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;

    if (rect.bottom > 0 && rect.top < viewportH && window.innerWidth > 980) {
      const progress = Math.min(Math.max((-rect.top) / 420, 0), 1);
      const translateY = progress * 28;
      heroArtImage.style.transform = `translateY(${translateY.toFixed(1)}px)`;
    } else {
      heroArtImage.style.transform = 'translateY(0)';
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeroArtParallax);
      ticking = true;
    }
  };

  updateHeroArtParallax();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}
