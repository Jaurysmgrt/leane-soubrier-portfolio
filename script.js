document.getElementById('year').textContent = new Date().getFullYear();

/* global safety net — nothing on this page is allowed to stay invisible */
function revealEverything(){
  document.querySelectorAll('.reveal-armed').forEach(el => {
    el.classList.remove('reveal-armed');
    el.style.opacity = '';
    el.style.transform = '';
  });
  document.querySelectorAll('.char').forEach(el => { el.style.transform = ''; });
  document.querySelectorAll('.value-pill').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  document.getElementById('preloader')?.remove();
  document.body.style.overflow = '';
}
window.addEventListener('load', () => setTimeout(revealEverything, 4500));

try {

/* preloader — a dress draws itself, then reveals the site */
document.body.style.overflow = 'hidden';
const dressPaths = gsap.utils.toArray('#drawDress .draw-path');
dressPaths.forEach(p => {
  const len = p.getTotalLength();
  p.style.strokeDasharray = len;
  p.style.strokeDashoffset = len;
});

const introTl = gsap.timeline({
  onComplete: () => {
    document.body.style.overflow = '';
    document.getElementById('preloader')?.remove();
  }
});
introTl
  .to('#drawTip', { opacity: 1, duration: .25 })
  .to(dressPaths, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: .05 }, 0)
  .to('#drawTip', {
    duration: 1.2, ease: 'power1.inOut',
    keyframes: {
      '0%': { attr: { cx: 150, cy: 46 } },
      '25%': { attr: { cx: 120, cy: 96 } },
      '50%': { attr: { cx: 132, cy: 162 } },
      '75%': { attr: { cx: 90, cy: 340 } },
      '100%': { attr: { cx: 150, cy: 358 } }
    }
  }, 0)
  .to('#drawTip', { opacity: 0, duration: .25 }, '-=.25')
  .to('.preloader-name', { opacity: 1, duration: .5, ease: 'power2.out' }, '-=.4')
  .to('.preloader-tag', { opacity: 1, duration: .5 }, '-=.3')
  .to('.preloader-inner', { opacity: 0, scale: .97, duration: .45, ease: 'power2.in' }, '+=.35')
  .to('#preloader', { autoAlpha: 0, duration: .4 }, '-=.2');

} catch (e) { revealEverything(); }

/* custom cursor */
try {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function loop(){
    rx += (mx - rx) * .16; ry += (my - ry) * .16;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .creation-item, [data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('big'));
    el.addEventListener('mouseleave', () => ring.classList.remove('big'));
  });
  document.querySelectorAll('.site-header').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('on-dark'));
    el.addEventListener('mouseleave', () => ring.classList.remove('on-dark'));
  });
} catch (e) {}

/* progress bar */
try {
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
} catch (e) {}

/* header hide on scroll down */
try {
  let lastY = 0;
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 200) header.classList.add('hide');
    else header.classList.remove('hide');
    lastY = y;
  }, { passive: true });
} catch (e) {}

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

/* split hero name into chars */
try {
  document.querySelectorAll('.hero-name .line').forEach(line => {
    const text = line.textContent;
    line.innerHTML = text.split('').map(c => `<span>${c}</span>`).join('');
  });
  gsap.set('.hero-name .line span', { yPercent: 120, opacity: 0 });
  gsap.to('.hero-name .line span', {
    yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out',
    stagger: .035, delay: 2.2
  });
  gsap.to('.hero-eyebrow, .hero-role, .hero-tags', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .15, delay: 2.5
  });
  gsap.set('.hero-scroll, .rotating-badge', { opacity: 0 });
  gsap.to('.hero-scroll', { opacity: 1, duration: 1, delay: 3.1 });
  gsap.to('.rotating-badge', { opacity: 1, duration: 1, delay: 3.1 });
} catch (e) {}

/* generic reveal-up — visible by default, JS only arms the animation */
try {
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    if (el.closest('.hero')) return;
    el.classList.add('reveal-armed');
    gsap.to(el, {
      opacity: 1, y: 0, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });
} catch (e) {}

/* char reveal for section titles */
try {
  document.querySelectorAll('[data-reveal-chars]').forEach(title => {
    const words = title.textContent.split(' ');
    title.innerHTML = words.map(w => `<span class="word" style="display:inline-block;overflow:hidden;"><span class="char" style="display:inline-block;">${w}</span></span>`).join(' ');
    gsap.set(title.querySelectorAll('.char'), { yPercent: 110 });
    gsap.to(title.querySelectorAll('.char'), {
      yPercent: 0, duration: .9, ease: 'power4.out', stagger: .07,
      scrollTrigger: { trigger: title, start: 'top 88%' }
    });
  });
} catch (e) {}

/* apropos parallax */
try {
  gsap.to('.portrait-frame img', {
    yPercent: -10, ease: 'none',
    scrollTrigger: { trigger: '.apropos-visual', start: 'top bottom', end: 'bottom top', scrub: true }
  });
} catch (e) {}

/* values line draw */
try {
  document.querySelectorAll('.value-pill').forEach(p => p.classList.add('reveal-armed'));
  gsap.set('.value-pill', { scale: .92 });
  ScrollTrigger.create({
    trigger: '.values-line', start: 'top 78%',
    onEnter: () => {
      gsap.fromTo('.values-svg line', { attr: { x2: 0 } }, { attr: { x2: 1000 }, duration: 1.2, ease: 'power3.inOut' });
      gsap.to('.value-pill', { opacity: 1, y: 0, scale: 1, duration: .7, stagger: .1, ease: 'back.out(1.6)', delay: .25 });
    },
    once: true
  });
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

/* creations follow-cursor image */
try {
  const follow = document.getElementById('creationFollow');
  const followImg = document.getElementById('creationFollowImg');
  let followX = 0, followY = 0, tX = 0, tY = 0;
  document.querySelectorAll('.creation-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      followImg.src = item.dataset.creationImage;
      gsap.to(follow, { opacity: 1, duration: .3 });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(follow, { opacity: 0, duration: .3 });
    });
  });
  window.addEventListener('mousemove', e => {
    tX = e.clientX + 30; tY = e.clientY - 140;
  });
  (function followLoop(){
    followX += (tX - followX) * .14;
    followY += (tY - followY) * .14;
    follow.style.transform = `translate(${followX}px, ${followY}px)`;
    requestAnimationFrame(followLoop);
  })();
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

/* creation filters */
try {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const creationItems = document.querySelectorAll('.creation-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      creationItems.forEach(item => {
        const cats = (item.dataset.cat || '').split(' ');
        const show = f === 'all' || cats.includes(f);
        if (show) {
          item.classList.remove('is-hidden');
          gsap.fromTo(item, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, ease: 'power2.out' });
        } else {
          gsap.to(item, {
            opacity: 0, y: 16, duration: .3, ease: 'power2.in',
            onComplete: () => item.classList.add('is-hidden')
          });
        }
      });
    });
  });
} catch (e) {}

/* project detail pages */
try {
  const items = Array.from(document.querySelectorAll('.creation-item'));
  const page = document.getElementById('projectPage');
  const elIndex = document.getElementById('projectIndex');
  const elTitle = document.getElementById('projectTitle');
  const elDesc = document.getElementById('projectDesc');
  const elGallery = document.getElementById('projectGallery');
  const elCount = document.getElementById('projectCount');
  let currentProject = 0;

  function renderProject(i) {
    const item = items[i];
    if (!item) return;
    currentProject = i;
    const idx = item.querySelector('.creation-index')?.textContent.trim() || '';
    const title = item.querySelector('h3')?.textContent.trim() || '';
    const desc = item.querySelector('p')?.textContent.trim() || '';
    const gallery = (item.dataset.gallery || item.dataset.creationImage || '').split(',').filter(Boolean);
    elIndex.textContent = idx;
    elTitle.textContent = title;
    elDesc.textContent = desc;
    elGallery.innerHTML = gallery.map(src => `<img src="${src}" alt="${title}" loading="lazy">`).join('');
    elCount.textContent = `${i + 1} / ${items.length}`;
    page.scrollTop = 0;
  }

  function openProject(i) {
    renderProject(i);
    page.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProject() {
    page.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.swatch')) return;
      openProject(i);
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

/* floating contact button */
try {
  const floatContact = document.getElementById('floatContact');
  ScrollTrigger.create({
    trigger: '#apropos', start: 'top center',
    onEnter: () => floatContact.classList.add('visible'),
    onLeaveBack: () => floatContact.classList.remove('visible')
  });
  ScrollTrigger.create({
    trigger: '#contact', start: 'top center',
    onEnter: () => floatContact.classList.remove('visible'),
    onLeaveBack: () => floatContact.classList.add('visible')
  });
} catch (e) {}

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
      gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' });
    });
  });
} catch (e) {}

/* stitched thread line under section numbers */
try {
  document.querySelectorAll('.section-num').forEach(num => {
    ScrollTrigger.create({
      trigger: num, start: 'top 88%',
      onEnter: () => num.classList.add('stitched'),
      once: true
    });
  });
} catch (e) {}

/* image reveals — gentle fade + scale, visible by default */
try {
  gsap.utils.toArray('.portrait-frame, .creation-thumb').forEach(box => {
    box.classList.add('reveal-armed');
    gsap.set(box, { scale: .97 });
    gsap.to(box, {
      opacity: 1, scale: 1, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: box, start: 'top 92%' }
    });
  });
} catch (e) {}

try { ScrollTrigger.refresh(); } catch (e) {}
window.addEventListener('load', () => { try { ScrollTrigger.refresh(); } catch (e) {} });
