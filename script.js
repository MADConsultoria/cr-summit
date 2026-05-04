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

  const path = (window.location.pathname || '').toLowerCase();
  const isEncontroPage = path.includes('/encontro/') || path.endsWith('/encontro') || path.includes('/encontro/index.html');

  // index: 19/05/2026 23:59:59 | encontro: 08/04/2026 23:59:59 (America/Sao_Paulo, UTC-03:00)
  const targetDate = isEncontroPage
    ? new Date('2026-04-08T23:59:59-03:00')
    : new Date('2026-05-19T23:59:59-03:00');

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

const videoCarousel = document.querySelector('.video-grid');

if (videoCarousel) {
  const mobileCarouselQuery = window.matchMedia('(max-width: 980px)');
  const videoCards = Array.from(videoCarousel.querySelectorAll('.video-card'));
  let carouselTimer;
  let activeVideoIndex = 0;

  const hasPlayingVideo = () =>
    Array.from(videoCarousel.querySelectorAll('video')).some((video) => !video.paused && !video.ended);

  const scrollToVideoCard = (index) => {
    const target = videoCards[index];

    if (target) {
      const left = target.offsetLeft - (videoCarousel.clientWidth - target.clientWidth) / 2;

      videoCarousel.scrollTo({
        left,
        behavior: 'smooth',
      });
    }
  };

  const stopVideoCarousel = () => {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
    }
  };

  const startVideoCarousel = () => {
    stopVideoCarousel();

    if (!mobileCarouselQuery.matches || videoCards.length < 2) {
      return;
    }

    carouselTimer = setInterval(() => {
      if (hasPlayingVideo()) {
        return;
      }

      activeVideoIndex = (activeVideoIndex + 1) % videoCards.length;
      scrollToVideoCard(activeVideoIndex);
    }, 4200);
  };

  videoCarousel.addEventListener(
    'scroll',
    () => {
      if (!mobileCarouselQuery.matches) {
        return;
      }

      const carouselCenter = videoCarousel.getBoundingClientRect().left + videoCarousel.clientWidth / 2;
      let closestIndex = activeVideoIndex;
      let closestDistance = Number.POSITIVE_INFINITY;

      videoCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - carouselCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      activeVideoIndex = closestIndex;
    },
    { passive: true }
  );

  videoCarousel.addEventListener('pointerdown', stopVideoCarousel);
  videoCarousel.addEventListener('pointerup', startVideoCarousel);
  videoCarousel.addEventListener('pointercancel', startVideoCarousel);
  videoCarousel.querySelectorAll('video').forEach((video) => {
    video.addEventListener('play', stopVideoCarousel);
    video.addEventListener('pause', startVideoCarousel);
    video.addEventListener('ended', startVideoCarousel);
  });
  mobileCarouselQuery.addEventListener('change', startVideoCarousel);
  startVideoCarousel();
}

const testimonialVideosWithThumbTime = document.querySelectorAll('.video-card video[data-thumb-time]');

testimonialVideosWithThumbTime.forEach((video) => {
  const source = video.querySelector('source');
  const thumbTime = Number(video.dataset.thumbTime);

  if (!source || !source.src || Number.isNaN(thumbTime)) {
    return;
  }

  const thumbVideo = document.createElement('video');
  thumbVideo.muted = true;
  thumbVideo.playsInline = true;
  thumbVideo.preload = 'auto';
  thumbVideo.src = source.src;

  const cleanup = () => {
    thumbVideo.removeAttribute('src');
    thumbVideo.load();
  };

  thumbVideo.addEventListener(
    'loadedmetadata',
    () => {
      const safeTime = Math.min(Math.max(thumbTime, 0), Math.max(thumbVideo.duration - 0.1, 0));
      thumbVideo.currentTime = safeTime;
    },
    { once: true }
  );

  thumbVideo.addEventListener(
    'seeked',
    () => {
      try {
        const canvas = document.createElement('canvas');
        const width = thumbVideo.videoWidth || 540;
        const height = thumbVideo.videoHeight || 960;

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(thumbVideo, 0, 0, width, height);
        video.poster = canvas.toDataURL('image/jpeg', 0.78);
      } catch (error) {
        console.warn('Não foi possível gerar a thumb do depoimento.', error);
      }

      cleanup();
    },
    { once: true }
  );

  thumbVideo.addEventListener('error', cleanup, { once: true });
  thumbVideo.load();
});
