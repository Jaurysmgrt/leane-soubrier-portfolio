document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;
const isRepeatVisit = (function () {
  try { return sessionStorage.getItem('ls-visited') === '1'; } catch (e) { return false; }
})();
try { sessionStorage.setItem('ls-visited', '1'); } catch (e) {}

/* content images fade in as they finish loading, instead of popping in
   the instant the network delivers them */
try {
  document.querySelectorAll('main img').forEach(img => {
    if (img.closest('#heroMedia')) return;
    img.classList.add('fade-img');
    const markLoaded = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth > 0) markLoaded();
    else {
      img.addEventListener('load', markLoaded);
      img.addEventListener('error', markLoaded);
      setTimeout(markLoaded, 4000); // never leave an image invisible
    }
  });
} catch (e) {}

/* hero safety net — this is the first thing anyone sees, so it gets its
   own short, tight backstop instead of waiting on the global one below */
function revealHero(){
  document.querySelectorAll('.hero-name .line span').forEach(el => {
    el.style.opacity = '';
    el.style.transform = '';
  });
  ['.hero-role', '.hero-cta', '.hero-scroll'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) { el.style.opacity = ''; el.style.transform = ''; }
  });
}
window.addEventListener('load', () => setTimeout(revealHero, 2600));

/* global safety net — nothing on this page is allowed to stay invisible */
function revealEverything(){
  document.querySelectorAll('.reveal-armed').forEach(el => {
    el.classList.remove('reveal-armed');
    el.style.opacity = '';
    el.style.transform = '';
  });
  revealHero();
  document.querySelectorAll('.word-mask .word').forEach(el => { el.style.transform = ''; });
  document.querySelector('.site-header')?.classList.add('ready');
  document.getElementById('preloader')?.remove();
  document.body.style.overflow = '';
}
window.addEventListener('load', () => setTimeout(revealEverything, 5500));

/* preloader — skipped on repeat visits within the session, and for
   users who asked for reduced motion, so returning visitors aren't
   forced through the intro every time */
if (reduceMotion || isRepeatVisit) {
  document.getElementById('preloader')?.remove();
  document.querySelector('.site-header')?.classList.add('ready');
} else {
  try {
    document.body.style.overflow = 'hidden';
    const introTl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        document.getElementById('preloader')?.remove();
      }
    });
    introTl
      .to('.preloader-name', { opacity: 1, duration: 1, ease: 'sine.inOut' })
      .to('.preloader-line', { width: '56px', duration: .8, ease: 'sine.inOut' }, '-=.4')
      .to('.preloader-role', { opacity: 1, duration: .7, ease: 'sine.inOut' }, '-=.5')
      .to('.site-header', { opacity: 1, duration: .7, ease: 'sine.inOut' }, '-=.3')
      .to('.preloader-inner', { opacity: 0, duration: .6, ease: 'sine.inOut' }, '+=.55')
      .to('#preloader', { autoAlpha: 0, duration: .6, ease: 'sine.inOut' }, '-=.3');
  } catch (e) { revealEverything(); }
}

/* custom cursor — only takes over the pointer once it's actually running */
if (isFinePointer) {
  try {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const label = document.getElementById('cursorLabel');
    document.body.classList.add('cursor-ready');
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function loop(){
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      label.style.left = rx + 'px'; label.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
      if (el.closest('.creation-item')) return;
      el.addEventListener('mouseenter', () => ring.classList.add('big'));
      el.addEventListener('mouseleave', () => ring.classList.remove('big'));
    });
    document.querySelectorAll('.creation-item').forEach(el => {
      el.addEventListener('mouseenter', () => label.classList.add('show'));
      el.addEventListener('mouseleave', () => label.classList.remove('show'));
    });
    document.querySelectorAll('.site-header, .section-contact, .section-creations').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('on-dark'));
      el.addEventListener('mouseleave', () => ring.classList.remove('on-dark'));
    });
  } catch (e) {}
}

/* progress bar */
try {
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
} catch (e) {}

/* header stays fixed and visible at all times — no hide-on-scroll */

/* hero slideshow */
try {
  const heroImgs = document.querySelectorAll('#heroMedia img');
  if (heroImgs.length > 1) {
    let heroIdx = 0;
    setInterval(() => {
      heroImgs[heroIdx].classList.remove('active');
      heroIdx = (heroIdx + 1) % heroImgs.length;
      heroImgs[heroIdx].classList.add('active');
    }, 5500);
  }
} catch (e) {}

/* hero — subtle cursor-driven depth, desktop only */
if (isFinePointer && !reduceMotion) {
  try {
    const heroMedia = document.getElementById('heroMedia');
    const hero = document.getElementById('hero');
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      gsap.to(heroMedia, { x: px * -18, y: py * -12, duration: 1, ease: 'power2.out' });
    });
    hero.addEventListener('mouseleave', () => {
      gsap.to(heroMedia, { x: 0, y: 0, duration: 1, ease: 'power3.out' });
    });
  } catch (e) {}
}

/* mobile nav */
try {
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    burger.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
} catch (e) {}

/* active nav link + dot nav */
try {
  const navLinks = document.querySelectorAll('[data-nav]');
  const dotLinks = document.querySelectorAll('.dot-nav a');
  const trackedSections = document.querySelectorAll('main section[id], .hero[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`[data-nav][href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
        dotLinks.forEach(d => d.classList.remove('active'));
        const dot = document.querySelector(`.dot-nav a[data-dot="${entry.target.id}"]`);
        if (dot) dot.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  trackedSections.forEach(s => navObserver.observe(s));
} catch (e) {}

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}
if (window.gsap && window.Flip) {
  gsap.registerPlugin(Flip);
}

/* split hero name into chars */
try {
  document.querySelectorAll('.hero-name .line').forEach(line => {
    const text = line.textContent;
    line.innerHTML = text.split('').map(c => `<span>${c}</span>`).join('');
  });
  gsap.set('.hero-name .line span', { yPercent: 120, opacity: 0 });
  gsap.to('.hero-name .line span', {
    yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out',
    stagger: .035, delay: 1.4
  });
  gsap.set('.hero-role, .hero-cta', { opacity: 0, y: 16 });
  gsap.to('.hero-role, .hero-cta', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .12, delay: 1.7
  });
  gsap.set('.hero-scroll', { opacity: 0 });
  gsap.to('.hero-scroll', { opacity: 1, duration: 1, delay: 2.2 });
} catch (e) {}

/* generic reveal — pure opacity, tied to scroll position (no slide) */
try {
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    if (el.closest('.hero')) return;
    el.classList.add('reveal-armed');
    el.style.transform = 'none';
    gsap.to(el, {
      opacity: 1, duration: .1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 68%', scrub: .4 }
    });
  });
} catch (e) {}

/* section titles — split into words that rise up out of a masked line */
try {
  document.querySelectorAll('[data-reveal-chars]').forEach(title => {
    const text = title.textContent.trim();
    title.innerHTML = text.split(' ').map(w =>
      `<span class="word-mask"><span class="word">${w}</span></span>`
    ).join(' ');
    const words = title.querySelectorAll('.word');
    if (reduceMotion) return;
    gsap.set(words, { yPercent: 115 });
    ScrollTrigger.create({
      trigger: title, start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(words, { yPercent: 0, duration: .9, ease: 'power4.out', stagger: .05 });
        // real-timer backstop: never leave a title clipped mid-reveal
        setTimeout(() => words.forEach(w => { w.style.transform = ''; }), 1600);
      }
    });
  });
} catch (e) {}

/* parallax drift */
try {
  gsap.to('.portrait-frame img', {
    yPercent: -10, ease: 'none',
    scrollTrigger: { trigger: '.apropos-visual', start: 'top bottom', end: 'bottom top', scrub: true }
  });
} catch (e) {}

/* hero — gains depth as it scrolls away: slow zoom, sinks into shadow */
try {
  gsap.to('#heroMedia', {
    scale: 1.18, opacity: .35, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
} catch (e) {}

/* values grid — scroll-scrubbed sequential reveal */
try {
  const cards = gsap.utils.toArray('.value-card');
  if (cards.length) {
    cards.forEach(c => { c.classList.add('reveal-armed'); c.style.transform = 'scale(.82)'; });
    ScrollTrigger.create({
      trigger: '.values-grid', start: 'top 78%', end: 'top 15%', scrub: .6,
      onUpdate: self => {
        const p = self.progress;
        cards.forEach((c, i) => {
          const cp = Math.min(1, Math.max(0, (p - i * .14) / .4));
          c.style.opacity = cp;
          c.style.transform = `scale(${.82 + cp * .18})`;
        });
      }
    });
  }
} catch (e) {}

/* services tilt */
try {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      gsap.to(card, { rotateY: px * 6, rotateX: -py * 6, duration: .4, ease: 'power2.out', transformPerspective: 800 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: .6, ease: 'power3.out' });
    });
  });
} catch (e) {}


/* palette copy */
try {
  const toast = document.getElementById('toast');
  document.querySelectorAll('.swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      const hex = sw.dataset.copy;
      navigator.clipboard?.writeText(hex).catch(() => {});
      toast.textContent = `${sw.dataset.name} — ${hex} copié ✓`;
      toast.classList.add('show');
      clearTimeout(sw._t);
      sw._t = setTimeout(() => toast.classList.remove('show'), 1800);
    });
  });
} catch (e) {}

/* creation filters — remaining items glide into their new spot (GSAP Flip)
   instead of just fading, so the grid feels like it physically reflows */
try {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const creationItems = document.querySelectorAll('.creation-item');
  const hasFlip = window.gsap && window.Flip;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;

      if (hasFlip && !reduceMotion) {
        const state = Flip.getState(creationItems);
        creationItems.forEach(item => {
          const cats = (item.dataset.cat || '').split(' ');
          const show = f === 'all' || cats.includes(f);
          item.classList.toggle('is-hidden', !show);
        });
        Flip.from(state, {
          duration: .6, ease: 'power3.out', stagger: .035, absolute: true,
          onEnter: els => gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, ease: 'power2.out' }),
          onLeave: els => gsap.to(els, { opacity: 0, y: 16, duration: .3, ease: 'power2.in' })
        });
      } else {
        creationItems.forEach(item => {
          const cats = (item.dataset.cat || '').split(' ');
          const show = f === 'all' || cats.includes(f);
          item.classList.toggle('is-hidden', !show);
        });
      }
    });
  });
} catch (e) {}

/* project detail pages — clicking a tile expands its cover photo straight
   into the hero of the detail page (GSAP Flip), instead of just opening
   a panel on top of everything */
try {
  const items = Array.from(document.querySelectorAll('.creation-item'));
  const page = document.getElementById('projectPage');
  const elHero = document.getElementById('projectHeroImg');
  const elIndex = document.getElementById('projectIndex');
  const elTitle = document.getElementById('projectTitle');
  const elDesc = document.getElementById('projectDesc');
  const elGallery = document.getElementById('projectGallery');
  const elCount = document.getElementById('projectCount');
  const hasFlip = window.gsap && window.Flip;
  let currentProject = 0;

  function renderProject(i, skipTextAnim) {
    const item = items[i];
    if (!item) return;
    currentProject = i;
    const idx = item.querySelector('.creation-index')?.textContent.trim() || '';
    const title = item.querySelector('h3')?.textContent.trim() || '';
    const desc = item.querySelector('.full-desc')?.textContent.trim() || '';
    const imgs = item.querySelectorAll('.creation-thumb img, .extra-gallery img');
    const cover = item.querySelector('.tile-cover');

    elHero.src = cover ? (cover.currentSrc || cover.src) : (imgs[0] ? (imgs[0].currentSrc || imgs[0].src) : '');
    elHero.alt = title;
    elIndex.textContent = idx;
    elTitle.textContent = title;
    elDesc.textContent = desc;
    elGallery.innerHTML = '';
    imgs.forEach(img => {
      const clone = document.createElement('img');
      clone.src = img.currentSrc || img.src;
      clone.alt = img.alt || title;
      if (img.classList.contains('wm-src')) clone.className = 'wm-src';
      elGallery.appendChild(clone);
    });
    elCount.textContent = `${i + 1} / ${items.length}`;
    page.scrollTop = 0;

    if (!skipTextAnim) {
      gsap.fromTo([elIndex, elTitle, elDesc], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6, stagger: .08, ease: 'power3.out' });
      gsap.fromTo(elGallery.children, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .7, stagger: .07, ease: 'power3.out', delay: .1 });
    }
  }

  function openProject(i, sourceTile) {
    const tileImg = sourceTile && sourceTile.querySelector('.tile-cover');
    if (hasFlip && tileImg && !reduceMotion) {
      const state = Flip.getState(tileImg);
      renderProject(i, true);
      page.classList.add('open');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        Flip.from(state, {
          targets: elHero, duration: .9, ease: 'power3.inOut', absolute: true,
          onComplete: () => {
            gsap.fromTo([elIndex, elTitle, elDesc], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, stagger: .08, ease: 'power3.out' });
            gsap.fromTo(elGallery.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, stagger: .06, ease: 'power3.out' });
          }
        });
      });
    } else {
      renderProject(i);
      page.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeProject() {
    page.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.swatch')) return;
      openProject(i, item);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(i, item); }
    });
  });

  document.getElementById('projectClose')?.addEventListener('click', closeProject);
  document.getElementById('projectPrev')?.addEventListener('click', () => renderProject((currentProject - 1 + items.length) % items.length));
  document.getElementById('projectNext')?.addEventListener('click', () => renderProject((currentProject + 1) % items.length));
  window.addEventListener('keydown', (e) => {
    if (!page.classList.contains('open')) return;
    if (e.key === 'Escape') closeProject();
    if (e.key === 'ArrowRight') renderProject((currentProject + 1) % items.length);
    if (e.key === 'ArrowLeft') renderProject((currentProject - 1 + items.length) % items.length);
  });
} catch (e) {}

/* contact popover — the hero's "Me contacter" button opens a small card
   with every contact channel, instead of jumping straight into a mail client */
try {
  const contactBtn = document.getElementById('heroContactBtn');
  const pop = document.getElementById('contactPop');
  const popLinks = pop.querySelectorAll('a');

  function positionPop(){
    const r = contactBtn.getBoundingClientRect();
    const popWidth = Math.min(300, window.innerWidth - 56);
    let left = r.left;
    if (left + popWidth > window.innerWidth - 16) left = window.innerWidth - popWidth - 16;
    if (left < 16) left = 16;

    const popHeight = pop.offsetHeight || 180;
    const spaceBelow = window.innerHeight - r.bottom;
    let top, origin;
    if (spaceBelow < popHeight + 24 && r.top > popHeight + 24) {
      top = r.top - popHeight - 12;
      origin = 'bottom left';
    } else {
      top = r.bottom + 12;
      origin = 'top left';
    }
    pop.style.setProperty('--pop-left', left + 'px');
    pop.style.setProperty('--pop-top', top + 'px');
    pop.style.setProperty('--pop-origin', origin);
  }
  function openPop(){
    positionPop();
    pop.classList.add('open');
    pop.setAttribute('aria-hidden', 'false');
    contactBtn.setAttribute('aria-expanded', 'true');
    popLinks.forEach(a => a.tabIndex = 0);
  }
  function closePop(){
    pop.classList.remove('open');
    pop.setAttribute('aria-hidden', 'true');
    contactBtn.setAttribute('aria-expanded', 'false');
    popLinks.forEach(a => a.tabIndex = -1);
  }
  contactBtn.addEventListener('click', () => {
    pop.classList.contains('open') ? closePop() : openPop();
  });
  document.addEventListener('click', e => {
    if (!pop.classList.contains('open')) return;
    if (e.target === contactBtn || contactBtn.contains(e.target)) return;
    if (!pop.contains(e.target)) closePop();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && pop.classList.contains('open')) { closePop(); contactBtn.focus(); }
  });
  window.addEventListener('resize', () => { if (pop.classList.contains('open')) positionPop(); });
} catch (e) {}

/* contact form — no backend on a static site, so it opens the visitor's
   own mail app with everything prefilled, straight to Léane's inbox */
try {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) return;
    const subject = encodeURIComponent(`Contact via le portfolio — ${name}`);
    const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`);
    window.location.href = `mailto:lsoubrier.contact@gmail.com?subject=${subject}&body=${body}`;
  });
} catch (e) {}

/* contact section — ambient light that follows the cursor, desktop only */
if (isFinePointer && !reduceMotion) {
  try {
    const contactSection = document.getElementById('contact');
    contactSection.addEventListener('mousemove', e => {
      const r = contactSection.getBoundingClientRect();
      contactSection.style.setProperty('--gx', (e.clientX - r.left) + 'px');
      contactSection.style.setProperty('--gy', (e.clientY - r.top) + 'px');
      contactSection.classList.add('glow-on');
    });
    contactSection.addEventListener('mouseleave', () => contactSection.classList.remove('glow-on'));
  } catch (e) {}
}

/* magnetic buttons */
try {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * .3, y: y * .3, duration: .4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'power3.out' });
    });
  });
} catch (e) {}

/* image reveals — opacity + scale tied to scroll position, no slide */
try {
  gsap.utils.toArray('.portrait-frame, .creation-thumb').forEach(box => {
    box.classList.add('reveal-armed');
    box.style.transform = 'scale(1.08)';
    gsap.to(box, {
      opacity: 1, scale: 1, duration: .1, ease: 'none',
      scrollTrigger: { trigger: box, start: 'top 98%', end: 'top 60%', scrub: .5 }
    });
  });
} catch (e) {}

/* footer marquee — drifts on its own, surges forward when you scroll,
   the way a heavy object picks up momentum rather than just looping on rails */
try {
  const track = document.querySelector('.footer-marquee .marquee-track');
  if (track) {
    if (reduceMotion) {
      track.style.transform = 'translateX(0)';
    } else {
      let x = 0;
      let velocity = 0;
      let lastY = window.scrollY;
      let loopWidth = track.scrollWidth / 2;
      window.addEventListener('resize', () => { loopWidth = track.scrollWidth / 2; });
      window.addEventListener('scroll', () => {
        velocity += (window.scrollY - lastY) * 0.6;
        lastY = window.scrollY;
      }, { passive: true });
      (function tick(){
        velocity *= 0.92;
        x -= 1.3 + Math.min(Math.abs(velocity), 14) * 0.2;
        if (loopWidth > 0 && x <= -loopWidth) x += loopWidth;
        track.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(tick);
      })();
    }
  }
} catch (e) {}

try { ScrollTrigger.refresh(); } catch (e) {}
window.addEventListener('load', () => { try { ScrollTrigger.refresh(); } catch (e) {} });
