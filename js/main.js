/**
 * Main JavaScript for Lucas Krayacich's portfolio
 * Handles navigation, scroll animations, and interactions
 */

(function() {
  'use strict';

  // ===== Mobile Navigation Toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const nav = document.querySelector('.nav');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        history.pushState(null, null, href);
      }
    });
  });

  // ===== Navigation Scroll Effects =====
  let lastScroll = 0;

  const handleNavScroll = () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for background change
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', throttle(handleNavScroll, 100));
  handleNavScroll();

  // ===== Scroll-triggered Animations =====
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    // Apply animation classes
    const animationConfig = [
      { selector: '.about-main', class: 'fade-in-left' },
      { selector: '.about-visual', class: 'fade-in-right' },
      { selector: '.project-card', class: 'fade-in', stagger: true },
      { selector: '.timeline-item', class: 'fade-in', stagger: true },
      { selector: '.resume-block', class: 'scale-in', stagger: true },
      { selector: '.featured-article', class: 'fade-in', stagger: true },
      { selector: '.contact-link', class: 'fade-in', stagger: true },
      { selector: '.stat-item', class: 'fade-in', stagger: true }
    ];

    animationConfig.forEach(config => {
      const elements = document.querySelectorAll(config.selector);
      elements.forEach((el, index) => {
        el.classList.add(config.class);
        if (config.stagger) {
          el.classList.add(`stagger-${Math.min(index + 1, 5)}`);
        }
      });
    });

    // Intersection Observer for animations
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animationObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
      animationObserver.observe(el);
    });
  }

  // ===== Active Navigation Link Highlighting =====
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', throttle(highlightNavOnScroll, 100));

  // ===== Counter Animation for Stats =====
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  };

  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
  }

  // ===== Parallax Effect for Hero =====
  const heroContent = document.querySelector('.hero-content');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (heroContent && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroHeight = document.querySelector('.hero').offsetHeight;

      if (scrolled < heroHeight) {
        const opacity = 1 - (scrolled / (heroHeight * 0.6));
        const translateY = scrolled * 0.3;

        heroContent.style.opacity = Math.max(0, opacity);
        heroContent.style.transform = `translateY(${translateY}px)`;

        if (scrollIndicator) {
          scrollIndicator.style.opacity = Math.max(0, 1 - (scrolled / 200));
        }
      }
    });
  }

  // ===== Card Tilt Effect =====
  const tiltCards = document.querySelectorAll('.project-card');

  if (!prefersReducedMotion) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ===== Magnetic Effect for Buttons =====
  const magneticButtons = document.querySelectorAll('.btn-primary');

  if (!prefersReducedMotion) {
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-3px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ===== Text Reveal Animation for Hero =====
  const heroTitle = document.querySelector('.hero-title');
  const heroGreeting = document.querySelector('.hero-greeting');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroCTA = document.querySelector('.hero-cta');

  if (!prefersReducedMotion) {
    // Initial states
    [heroGreeting, heroTitle, heroSubtitle, heroCTA].forEach((el, i) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`;
      }
    });

    // Trigger animation after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        [heroGreeting, heroTitle, heroSubtitle, heroCTA].forEach(el => {
          if (el) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }
        });
      }, 100);
    });
  }

  // ===== Skill Tags Hover Wave =====
  const skillsLists = document.querySelectorAll('.skills-list');

  skillsLists.forEach(list => {
    const tags = list.querySelectorAll('.skill-tag');
    tags.forEach((tag, index) => {
      tag.addEventListener('mouseenter', () => {
        // Animate neighboring tags
        tags.forEach((t, i) => {
          const distance = Math.abs(i - index);
          if (distance > 0 && distance <= 2) {
            const scale = 1 - (distance * 0.05);
            t.style.transform = `scale(${scale}) translateY(-${(2 - distance)}px)`;
          }
        });
      });

      tag.addEventListener('mouseleave', () => {
        tags.forEach(t => {
          t.style.transform = '';
        });
      });
    });
  });

  // ===== Photo Gallery Drag Scroll =====
  const photoGallery = document.getElementById('photo-gallery');

  if (photoGallery) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let wasAnimating = true;

    photoGallery.addEventListener('mousedown', (e) => {
      isDown = true;
      wasAnimating = photoGallery.style.animationPlayState !== 'paused';
      photoGallery.style.animationPlayState = 'paused';
      photoGallery.style.cursor = 'grabbing';
      startX = e.pageX - photoGallery.offsetLeft;
      scrollLeft = photoGallery.parentElement.scrollLeft;
    });

    photoGallery.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        photoGallery.style.cursor = 'grab';
      }
    });

    photoGallery.addEventListener('mouseup', () => {
      isDown = false;
      photoGallery.style.cursor = 'grab';
    });

    photoGallery.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - photoGallery.offsetLeft;
      const walk = (x - startX) * 2;
      photoGallery.parentElement.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX;

    photoGallery.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      photoGallery.style.animationPlayState = 'paused';
    }, { passive: true });

    photoGallery.addEventListener('touchmove', (e) => {
      if (!touchStartX) return;
      const touchX = e.touches[0].clientX;
      const diff = touchStartX - touchX;
      photoGallery.parentElement.scrollLeft += diff;
      touchStartX = touchX;
    }, { passive: true });

    photoGallery.addEventListener('touchend', () => {
      touchStartX = null;
    });
  }

  // ===== Current Year in Footer =====
  const yearSpan = document.querySelector('.footer p');
  if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.innerHTML = yearSpan.innerHTML.replace('2024', currentYear);
  }

  // ===== Utility Functions =====
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

})();
