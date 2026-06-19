import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let homepageMotionInitialized = false;

gsap.registerPlugin(ScrollTrigger);

function revealOnView(selector: string, options?: gsap.TweenVars) {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (nodes.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        gsap.fromTo(entry.target, {
          autoAlpha: 0,
          y: 28,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          ...options,
        });

        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.18,
    },
  );

  nodes.forEach((node) => observer.observe(node));
}

function initHeroMotion() {
  const hero = document.querySelector('.hero-copy');
  const heroBg = document.querySelector('.hero-bg');
  if (!hero || !heroBg) return;

  gsap.fromTo(
    heroBg,
    { autoAlpha: 0, scale: 1.04 },
    { autoAlpha: 0.92, scale: 1, duration: 1.25, ease: 'power2.out' },
  );

  const items = ['.hero .eyebrow', '.hero h1 span', '.hero-text', '.hero .actions', '.hero-stats'];
  gsap.fromTo(
    items,
    { autoAlpha: 0, y: 26 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.85,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.2,
    },
  );
}

function initParallax() {
  const heroImage = document.querySelector<HTMLElement>('.hero-bg');
  if (!heroImage) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * 0.08, 42);
      heroImage.style.transform = `translateY(${offset}px)`;
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

function initNavDropdowns() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.nav-item'));
  if (items.length === 0) return;

  const closeAll = () => {
    items.forEach((item) => {
      item.classList.remove('open');
      const trigger = item.querySelector<HTMLButtonElement>('.nav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  items.forEach((item) => {
    const trigger = item.querySelector<HTMLButtonElement>('.nav-trigger');
    const menu = item.querySelector<HTMLElement>('.subnav');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const shouldOpen = !item.classList.contains('open');
      closeAll();
      if (!shouldOpen) return;
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    });

    menu.addEventListener('click', () => {
      closeAll();
    });
  });

  document.addEventListener('click', (event) => {
    const target = event.target as Node | null;
    if (target && items.some((item) => item.contains(target))) return;
    closeAll();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
}

function initWayCards() {
  const cards = gsap.utils.toArray<HTMLElement>('.division');
  if (cards.length === 0) return;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
    cards.forEach((card, i) => {
      gsap.set(card, { zIndex: i + 1 });
    });

    cards.slice(1).forEach((card) => {
      gsap.fromTo(
        card,
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        },
      );
    });
  });
}

function initFragmentationScroll() {
  const section      = document.querySelector<HTMLElement>('.fragmentation-section');
  const fragInner    = document.querySelector<HTMLElement>('.fragmentation-inner');
  const fragContent  = document.querySelector<HTMLElement>('.fragmentation-content');
  const headingStage = document.querySelector<HTMLElement>('.fragmentation-heading-stage');
  const heading      = document.querySelector<HTMLElement>('.fragmentation-heading');
  const words        = gsap.utils.toArray<HTMLElement>('.fragmentation-heading .word');
  const copy         = document.querySelector<HTMLElement>('.fragmentation-copy');
  const cards        = gsap.utils.toArray<HTMLElement>('.fragmentation-card');
  const cardsWrap    = document.querySelector<HTMLElement>('.fragmentation-cards');

  if (
    !section || !fragInner || !fragContent || !headingStage ||
    !heading  || !copy     || !cardsWrap  ||
    words.length === 0 || cards.length === 0
  ) return;

  const mm = gsap.matchMedia();

  mm.add('(min-width: 960px) and (prefers-reduced-motion: no-preference)', () => {
    // Shift fragmentation-inner upward so the cards group is centered in the viewport.
    const getScrollUp = () => {
      const cardsFromInner = fragContent.offsetTop + cardsWrap.offsetTop;
      const targetTop = (window.innerHeight - cardsWrap.offsetHeight) / 2;
      return targetTop - fragInner.offsetTop - cardsFromInner;
    };

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 5.5)}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline
      // Phase 1: heading words blur/fade in
      .fromTo(
        words,
        { y: 80, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.14, duration: 1.15, ease: 'power3.out' },
      )
      // Phase 2: heading nudges up slightly — stays fully visible
      .to(headingStage, { y: -40, duration: 0.7, ease: 'power2.inOut' }, '+=0.42')
      // Phase 3: two-column copy fades in below heading
      .fromTo(
        copy,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
        '-=0.3',
      )
      // Phase 4: inner scrolls up — heading + copy exit top, cards enter viewport
      .to(fragInner, { y: getScrollUp, duration: 1.2, ease: 'power2.inOut' }, '+=0.5')
      // Phase 5: cards fly in one by one from the right
      .fromTo(
        cards,
        { x: '120vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, stagger: 0.32, ease: 'power3.out' },
        '-=0.3',
      );

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  });
}

export function initHomepageMotion() {
  if (homepageMotionInitialized || typeof window === 'undefined') return;
  homepageMotionInitialized = true;

  const run = () => {
    initNavDropdowns();
    initFragmentationScroll();
    initWayCards();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    initHeroMotion();
    initParallax();
    revealOnView('.metric');
    revealOnView('.process-graphic');
    revealOnView('.growth-framework');
    revealOnView('.industries .chips span', { duration: 0.7 });
    revealOnView('.compare-card');
    revealOnView('.ts-wrap', { duration: 0.75 });
    revealOnView('.testimonial-row');
    revealOnView('.cta-content');
    revealOnView('.footer-grid > *', { duration: 0.72 });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}
