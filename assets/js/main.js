/* =============================================
   ST PETER COLLEGE — MAIN JAVASCRIPT
   ============================================= */

/* ── PAGE LOADER (inject once, used everywhere) ── */
/* Hide loader once DOM + all assets are ready */
/* ── NAVIGATION LINK LOADING ─────────────────
   Shows the full-page loader whenever the user
   clicks any internal <a> button/link that
   navigates to another page.
─────────────────────────────────────────────── */
/* ── BTN LOADING HELPER ──────────────────────
   Wraps button text in .btn-text, adds spinner
   class. Returns a restore function.
─────────────────────────────────────────────── */
const topBar = document.querySelector(".top-bar");
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", function () {

    if (window.scrollY > 50) {
        topBar.classList.add("hide");
        navbar.classList.add("move-up");
    } else {
        topBar.classList.remove("hide");
        navbar.classList.remove("move-up");
    }

});
// his is the end of the top-bar info


function setBtnLoading(btn, loadingText = '') {
  if (!btn || btn.disabled) return () => {};
  const original = btn.innerHTML;
  btn.classList.add('btn-loading');
  btn.disabled = true;
  if (loadingText) {
    btn.innerHTML = `<span class="btn-text" style="visibility:hidden">${loadingText}</span>`;
  } else {
    btn.innerHTML = `<span class="btn-text" style="visibility:hidden">${original}</span>`;
  }
  return function restore() {
    btn.classList.remove('btn-loading');
    btn.disabled = false;
    btn.innerHTML = original;
  };
}

/* ══════════════════════════════════════════════
   DOMCONTENTLOADED — main logic
══════════════════════════════════════════════ */
function showBtnSuccess(btn, duration = 1400) {
  if (!btn) return;
  const original = btn.innerHTML;
  btn.classList.remove('btn-loading');
  btn.classList.add('btn-success-state');
  btn.disabled = true;
  btn.innerHTML = '<i class="bi bi-check-lg"></i>';

  setTimeout(() => {
    btn.classList.remove('btn-success-state');
    btn.disabled = false;
    btn.innerHTML = original;
  }, duration);
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. WIRE ALL NAVIGATION BUTTONS/LINKS ─── */
  /* ── 2. NAVBAR SCROLL EFFECT ─────────────── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── 3. SCROLL-TO-TOP BUTTON ─────────────── */
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollTop';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 4. WHATSAPP FLOATING BUTTON ─────────── */
  const waBtn = document.createElement('a');
  waBtn.id        = 'whatsappBtn';
  waBtn.href      = 'https://wa.me/250788123456';
  waBtn.target    = '_blank';
  waBtn.rel       = 'noopener noreferrer';
  waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  waBtn.innerHTML = '<i class="bi bi-whatsapp"></i>';
  document.body.appendChild(waBtn);



  /* ── 5. DARK / LIGHT MODE TOGGLE ─────────── */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const savedTheme  = localStorage.getItem('spce-theme') || 'light';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark'
        ? 'bi bi-brightness-high-fill'
        : 'bi bi-moon-stars-fill';
    }
    localStorage.setItem('spce-theme', theme);
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── 6. NEWS FILTER TABS ─────────────────── */
  const filterBtns = document.querySelectorAll('#newsFilter .nav-link');
  const newsItems  = document.querySelectorAll('.news-item');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        newsItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
            item.style.animation = 'fadeUp .4s ease both';
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ── 7. APPLICATION FORM SUBMIT (EmailJS) ─── */
  const appForm = document.getElementById('applicationForm');
  if (appForm) {
    appForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!appForm.checkValidity()) {
        appForm.classList.add('was-validated');
        return;
      }

      const btn = document.getElementById('appSubmitBtn');
      const restore = setBtnLoading(btn, 'Submitting...');

      const params = {
        app_name:     document.getElementById('app_name')?.value     || '',
        app_email:    document.getElementById('app_email')?.value    || '',
        app_phone:    document.getElementById('app_phone')?.value    || '',
        app_dob:      document.getElementById('app_dob')?.value      || '',
        app_program:  document.getElementById('app_program')?.value  || '',
        app_school:   document.getElementById('app_school')?.value   || '',
        app_district: document.getElementById('app_district')?.value || '',
        app_mode:     document.getElementById('app_mode')?.value     || '',
        app_message:  document.getElementById('app_message')?.value  || '',
        to_email:     'keivinishimwe8@gmail.com',
      };

      /* Wrap in try/catch in case emailjs is not loaded yet
         (happens before EmailJS keys are configured) */
      try {
        emailjs.send('YOUR_SERVICE_ID', 'template_application', params)
          .then(() => {
            showToast('Application submitted! We will contact you soon.', 'success');
            appForm.reset();
            appForm.classList.remove('was-validated');
            restore();
            showBtnSuccess(btn);
          })
          .catch(err => {
            console.error('EmailJS error:', err);
            showToast('Send failed. Please try again or email us directly.', 'error');
            restore();
          });
      } catch (e) {
        showToast('EmailJS not configured yet. See EMAILJS-SETUP.md.', 'error');
        restore();
      }
    });
  }

  /* ── 8. CONTACT FORM SUBMIT (EmailJS) ───────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }

      const btn = document.getElementById('contactSubmitBtn');
      const restore = setBtnLoading(btn, 'Sending...');

      const params = {
        contact_name:    document.getElementById('contact_name')?.value    || '',
        contact_email:   document.getElementById('contact_email')?.value   || '',
        contact_phone:   document.getElementById('contact_phone')?.value   || '',
        contact_subject: document.getElementById('contact_subject')?.value || '',
        contact_message: document.getElementById('contact_message')?.value || '',
        to_email:        'keivinishimwe8@gmail.com',
      };

      try {
        emailjs.send('YOUR_SERVICE_ID', 'template_contact', params)
          .then(() => {
            showToast('Message sent! We\'ll get back to you within 24 hours.', 'success');
            contactForm.reset();
            contactForm.classList.remove('was-validated');
            restore();
            showBtnSuccess(btn);
          })
          .catch(err => {
            console.error('EmailJS error:', err);
            showToast('Send failed. Please try again or call us directly.', 'error');
            restore();
          });
      } catch (e) {
        showToast('EmailJS not configured yet. See EMAILJS-SETUP.md.', 'error');
        restore();
      }
    });
  }

  /* ── 9. NEWSLETTER SUBSCRIBE BUTTONS ─────── */
  document.querySelectorAll('.input-group').forEach(group => {
    const input  = group.querySelector('input[type="email"]');
    const button = group.querySelector('button');
    if (!input || !button) return;
    if (!button.textContent.trim().startsWith('Subscribe')) return;

    button.addEventListener('click', () => {
      const val = input.value.trim();
      if (!val || !val.includes('@')) {
        input.classList.add('is-invalid');
        input.focus();
        return;
      }
      input.classList.remove('is-invalid');

      const restore = setBtnLoading(button, 'Subscribe');
      /* Simulate async subscription (replace with real API if available) */
      setTimeout(() => {
        restore();
        showToast('You\'ve subscribed to our newsletter!', 'success');
        showBtnSuccess(button);
        input.value = '';
      }, 1200);
    });
  });

  /* ── 10. FADE-UP ON SCROLL ───────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.program-card-home, .news-card, .mission-card, .value-card, ' +
    '.team-card, .prog-detail-card, .contact-info-card, .short-course-card, ' +
    '.fee-card, .timeline-item, .about-mini-card, ' +
    '.testimonial-card, .testi-summary-item'
  ).forEach(el => observer.observe(el));

  /* ── 11. ACTIVE NAV HIGHLIGHT ────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  /* ── 12. HERO IMAGE SLIDER ───────────────── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0;
  let sliderTimer;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startSlider() {
    sliderTimer = setInterval(() => goToSlide(current + 1), 5000);
  }

  if (slides.length) {
    startSlider();
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(sliderTimer);
        goToSlide(parseInt(dot.dataset.index, 10));
        startSlider();
      });
    });
  }

  /* ── 13. HERO COUNTER ANIMATION ─────────── */
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length) {
    let counted = false;

    const runCounters = () => {
      if (counted) return;
      counted = true;
      statNumbers.forEach(el => {
        const target     = parseInt(el.dataset.target, 10);
        const suffix     = el.dataset.suffix || '';
        const duration   = 1800;
        const frameRate  = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const counter = setInterval(() => {
          frame++;
          const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
          el.textContent = Math.floor(progress * target) + suffix;
          if (frame >= totalFrames) {
            el.textContent = target + suffix;
            clearInterval(counter);
          }
        }, frameRate);
      });
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) runCounters(); });
    }, { threshold: 0.3 });

    const statsRow = document.querySelector('.hero-stats-row');
    if (statsRow) statsObserver.observe(statsRow);
  }

});

/* ═══════════════════════════════════════════════
   TOAST NOTIFICATION HELPER
═══════════════════════════════════════════════ */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const icons = {
    success: 'check-circle-fill',
    error:   'x-circle-fill',
    info:    'info-circle-fill',
  };
  const colors = {
    success: '#0b3d91',
    error:   '#dc3545',
    info:    '#0dcaf0',
  };

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `<i class="bi bi-${icons[type] || icons.success} me-2"></i>${message}`;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '90px',
    left:         '50%',
    transform:    'translateX(-50%) translateY(20px)',
    background:   colors[type] || colors.success,
    color:        '#fff',
    padding:      '14px 28px',
    borderRadius: '40px',
    fontFamily:   'Poppins, sans-serif',
    fontWeight:   '600',
    fontSize:     '.9rem',
    boxShadow:    '0 8px 32px rgba(0,0,0,.25)',
    zIndex:       '99998',
    display:      'flex',
    alignItems:   'center',
    opacity:      '0',
    transition:   'all .4s ease',
    maxWidth:     '90vw',
    whiteSpace:   'nowrap',
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}
