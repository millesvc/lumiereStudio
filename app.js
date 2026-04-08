/* ============================================================
   LUMIÈRE STUDIO · app.js
   Premium beauty studio · Villa Alemana, Chile
   ============================================================ */

'use strict';

/* -------------------------------------------------------
   NAV: sticky + burger menu + smooth close
------------------------------------------------------- */
(function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');

  // Sticky
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Burger toggle
  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    // Animate bars
    const bars = burger.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });

  // Close menu on link click
  menu.querySelectorAll('.nav__mobile-link, .btn').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      const bars = burger.querySelectorAll('span');
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });
})();

/* -------------------------------------------------------
   SMOOTH SCROLL for anchor links
------------------------------------------------------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* -------------------------------------------------------
   REVEAL ON SCROLL (Intersection Observer)
------------------------------------------------------- */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger children in the same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.is-visible)')
          );
          const delay = siblings.indexOf(entry.target) * 80;
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, Math.max(0, delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* -------------------------------------------------------
   STRIP MARQUEE: duplicate content for seamless loop
------------------------------------------------------- */
(function initStrip() {
  const strip = document.querySelector('.strip__inner');
  if (!strip) return;
  // Duplicate children for seamless animation
  const items = strip.innerHTML;
  strip.innerHTML = items + items;
})();

/* -------------------------------------------------------
   GALLERY: lightbox-style click feedback
------------------------------------------------------- */
(function initGallery() {
  const items = document.querySelectorAll('.gallery__item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      item.style.transform = 'scale(0.97)';
      setTimeout(() => { item.style.transform = ''; }, 200);
    });
  });
})();

/* -------------------------------------------------------
   HERO: subtle parallax on bg images (desktop only)
------------------------------------------------------- */
(function initParallax() {
  if (window.innerWidth < 768) return;
  const heroImgs = document.querySelectorAll('.hero__bg-img');
  if (!heroImgs.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        heroImgs.forEach(img => {
          img.style.transform = `translateY(${y * 0.25}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* -------------------------------------------------------
   PLACEHOLDER IMAGES: replace missing images with
   elegant gradient placeholders on error
------------------------------------------------------- */
(function initImageFallback() {
  const palettes = {
    nails:       ['#E8D5C4', '#C9A98C'],
    lashes:      ['#D4849A', '#E8B4C0'],
    service:     ['#F2EBE0', '#D9C9B5'],
    gallery:     ['#1A1614', '#2E2925'],
    testimonial: ['#F5EDE4', '#E8D5C4'],
  };

  const getCategory = (src) => {
    if (src.includes('testimonial')) return 'testimonial';
    if (src.includes('gallery'))     return 'gallery';
    if (src.includes('service'))     return 'service';
    if (src.includes('lashes'))      return 'lashes';
    return 'nails';
  };

  const labels = {
    'hero-nails':          '💅 Nail Art',
    'hero-lashes':         '✨ Pestañas',
    'service-nails':       '💅 Uñas',
    'service-lifting':     '🌙 Lifting',
    'service-extensions':  '✨ Extensiones',
    'service-brows':       '🖊 Cejas',
    'gallery-1': 'Nail Art', 'gallery-2': 'Extensiones',
    'gallery-3': 'Lifting',  'gallery-4': 'Acrílicas',
    'gallery-5': 'Volumen',  'gallery-6': 'Cejas',
    'testimonial-1': 'V', 'testimonial-2': 'C', 'testimonial-3': 'I',
  };

  document.querySelectorAll('img').forEach(img => {
    const src  = img.getAttribute('src') || '';
    const key  = src.replace('images/', '').replace('.jpg', '');
    const cat  = getCategory(src);
    const pal  = palettes[cat];
    const label = labels[key] || '';

    const isAvatar = img.classList.contains('testimonial__avatar');

    img.addEventListener('error', function () {
      // Build canvas placeholder
      const canvas = document.createElement('canvas');
      const w = isAvatar ? 80  : 800;
      const h = isAvatar ? 80  : 600;
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      // Gradient background
      const grd = ctx.createLinearGradient(0, 0, w, h);
      grd.addColorStop(0, pal[0]);
      grd.addColorStop(1, pal[1]);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      if (label) {
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        const fontSize = isAvatar ? 22 : 28;
        ctx.font = `${fontSize}px Georgia, serif`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, w / 2, h / 2);
      }

      this.src = canvas.toDataURL();
    }, { once: true });

    // Force trigger if already cached as broken
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });
})();

/* -------------------------------------------------------
   COUNTER ANIMATION for hero stats
------------------------------------------------------- */
(function initCounters() {
  const stats = document.querySelectorAll('.hero__stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw.replace(/\D/g, ''), 10);
      if (!num) return;

      const suffix = raw.replace(/[\d]/g, '');
      let start = 0;
      const duration = 1200;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * num) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
})();

/* -------------------------------------------------------
   ACTIVE NAV LINK on scroll
------------------------------------------------------- */
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();

/* -------------------------------------------------------
   SERVICE CARD: price row hover highlight
------------------------------------------------------- */
(function initServiceHover() {
  document.querySelectorAll('.service-card__list li').forEach(li => {
    li.addEventListener('mouseenter', () => {
      li.style.paddingLeft = '.4rem';
      li.style.transition  = 'padding .2s ease';
    });
    li.addEventListener('mouseleave', () => {
      li.style.paddingLeft = '';
    });
  });
})();
