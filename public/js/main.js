/**
 * Livheart Website – Main JavaScript
 * Vanilla JS, no frameworks. Modular structure.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================================
     1. MOBILE NAVIGATION TOGGLE
     ========================================================== */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu   = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('active');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    });

    // Close when clicking outside the menu
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('active') &&
          !menu.contains(e.target) &&
          !toggle.contains(e.target)) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  /* ==========================================================
     2. HERO SLIDER (index.html)
     ========================================================== */
  function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides   = slider.querySelectorAll('.slide');
    const dotsWrap = slider.querySelector('.slider-dots');
    if (slides.length === 0) return;

    let current  = 0;
    let interval = null;
    const DELAY  = 5000; // auto-advance interval (ms)

    // Build dot indicators
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', function () { goTo(i); });
        dotsWrap.appendChild(dot);
      });
    }

    var dots = dotsWrap ? dotsWrap.querySelectorAll('.slider-dot') : [];

    function goTo(index) {
      slides[current].classList.remove('active');
      if (dots.length) dots[current].classList.remove('active');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      if (dots.length) dots[current].classList.add('active');
    }

    function next() {
      goTo(current + 1);
    }

    function startAutoPlay() {
      if (interval) return;
      interval = setInterval(next, DELAY);
    }

    function stopAutoPlay() {
      clearInterval(interval);
      interval = null;
    }

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Initialise first slide
    slides[0].classList.add('active');
    startAutoPlay();
  }

  /* ==========================================================
     3. SCROLL ANIMATIONS (IntersectionObserver)
     ========================================================== */
  function initScrollAnimations() {
    var items = document.querySelectorAll('.animate-on-scroll');
    if (items.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;

        // Stagger delay for grid children
        var parent = el.parentElement;
        if (parent) {
          var siblings = parent.querySelectorAll('.animate-on-scroll');
          var idx = Array.prototype.indexOf.call(siblings, el);
          if (idx > 0) {
            el.style.transitionDelay = (idx * 0.1) + 's';
          }
        }

        el.classList.add('animated');
        observer.unobserve(el);
      });
    }, { threshold: 0.15 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ==========================================================
     4. HEADER SCROLL EFFECT
     ========================================================== */
  function initHeaderScroll() {
    var header = document.querySelector('header');
    if (!header) return;

    var THRESHOLD = 50;

    function onScroll() {
      if (window.scrollY > THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial state
  }

  /* ==========================================================
     5. PRODUCT CATEGORY FILTER (products.html / shop.html)
     ========================================================== */
  function initCategoryFilter() {
    var categories = document.querySelectorAll('.category-item[data-category]');
    var products   = document.querySelectorAll('.product-card[data-category]');
    if (categories.length === 0 || products.length === 0) return;

    categories.forEach(function (cat) {
      cat.addEventListener('click', function (e) {
        e.preventDefault();
        var selected = cat.getAttribute('data-category');

        // Update active state
        categories.forEach(function (c) { c.classList.remove('active'); });
        cat.classList.add('active');

        // Filter products
        products.forEach(function (card) {
          var match = (selected === 'all') ||
                      (card.getAttribute('data-category') === selected);

          if (match) {
            card.style.display = '';
            // Trigger reflow then animate in
            requestAnimationFrame(function () {
              card.classList.add('visible');
              card.classList.remove('hidden');
            });
          } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
            // Hide after transition completes
            var onEnd = function () {
              if (card.classList.contains('hidden')) {
                card.style.display = 'none';
              }
              card.removeEventListener('transitionend', onEnd);
            };
            card.addEventListener('transitionend', onEnd);
          }
        });
      });
    });

    // Show all on load
    products.forEach(function (card) {
      card.classList.add('visible');
    });
  }

  /* ==========================================================
     6. NEWS "LOAD MORE" (news.html)
     ========================================================== */
  function initLoadMore() {
    var btn   = document.querySelector('.load-more-btn');
    var cards = document.querySelectorAll('.news-grid .news-card');
    if (!btn || cards.length === 0) return;

    var BATCH   = 6;
    var visible = 0;

    function showBatch() {
      var end = Math.min(visible + BATCH, cards.length);
      for (var i = visible; i < end; i++) {
        cards[i].style.display = '';
        cards[i].classList.add('visible');
      }
      visible = end;

      if (visible >= cards.length) {
        btn.style.display = 'none';
      }
    }

    // Hide everything first, then show first batch
    cards.forEach(function (c) { c.style.display = 'none'; });
    showBatch();

    btn.addEventListener('click', showBatch);
  }

  /* ==========================================================
     7. FEEDBACK FORM HANDLING (feedback.html)
     ========================================================== */
  function initFeedbackForm() {
    var form = document.getElementById('feedback-form');
    if (!form) return;

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ---- Toast notification helper ----
    function showToast(message, type) {
      // type: 'success' | 'error'
      var existing = document.querySelector('.toast');
      if (existing) existing.remove();

      var toast = document.createElement('div');
      toast.className = 'toast toast-' + type;
      toast.textContent = message;

      // Basic inline styles so it works even without CSS
      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '14px 28px',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '15px',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'opacity 0.3s, transform 0.3s',
        backgroundColor: type === 'success' ? '#4caf50' : '#e53935'
      });

      document.body.appendChild(toast);

      // Animate in
      requestAnimationFrame(function () {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });

      // Auto-dismiss after 4 s
      setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.addEventListener('transitionend', function () { toast.remove(); });
      }, 4000);
    }

    // ---- Validate fields ----
    function validate() {
      var name    = form.querySelector('[name="name"]');
      var email   = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');
      var errors  = [];

      if (!name || !name.value.trim())     errors.push('Name is required.');
      if (!email || !email.value.trim())    errors.push('Email is required.');
      else if (!EMAIL_RE.test(email.value.trim())) errors.push('Please enter a valid email address.');
      if (!message || !message.value.trim()) errors.push('Message is required.');

      return errors;
    }

    // ---- Submit handler ----
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var errors = validate();
      if (errors.length) {
        showToast(errors[0], 'error');
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      var origText  = submitBtn ? submitBtn.textContent : '';

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      // Gather data
      var data = {};
      new FormData(form).forEach(function (val, key) { data[key] = val; });

      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function (res) {
        if (!res.ok) throw new Error('Server responded with ' + res.status);
        return res.json();
      })
      .then(function () {
        showToast('Thank you! Your feedback has been submitted.', 'success');
        form.reset();
      })
      .catch(function () {
        showToast('Something went wrong. Please try again later.', 'error');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = origText;
        }
      });
    });
  }

  /* ==========================================================
     8. STORE LOCATOR SEARCH (store-locator.html)
     ========================================================== */
  function initStoreSearch() {
    var input = document.getElementById('store-search');
    var cards = document.querySelectorAll('.store-card');
    if (!input || cards.length === 0) return;

    input.addEventListener('input', function () {
      var query = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var name    = (card.getAttribute('data-name')    || card.textContent).toLowerCase();
        var address = (card.getAttribute('data-address') || '').toLowerCase();

        var match = !query || name.indexOf(query) !== -1 || address.indexOf(query) !== -1;
        card.style.display = match ? '' : 'none';
      });
    });
  }

  /* ==========================================================
     9. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id === '#' || id === '') return;
        var target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        // Update URL without jump
        if (history.pushState) {
          history.pushState(null, '', id);
        }
      });
    });
  }

  /* ==========================================================
     10. BACK TO TOP BUTTON
     ========================================================== */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    var SHOW_AFTER = 300;

    function toggle() {
      if (window.scrollY > SHOW_AFTER) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggle, { passive: true });
    toggle(); // initial state

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================
     11. IMAGE LAZY LOADING
     ========================================================== */
  function initLazyImages() {
    var images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        observer.unobserve(img);
      });
    }, { rootMargin: '200px 0px' }); // start loading a bit before visible

    images.forEach(function (img) { observer.observe(img); });
  }

  /* ==========================================================
     INITIALISE EVERYTHING
     ========================================================== */
  initMobileNav();
  initHeroSlider();
  initScrollAnimations();
  initHeaderScroll();
  initCategoryFilter();
  initLoadMore();
  initFeedbackForm();
  initStoreSearch();
  initSmoothScroll();
  initBackToTop();
  initLazyImages();

});
