document.getElementById('year').textContent = new Date().getFullYear();

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
  .to('#drawTip', { opacity: 1, duration: .3 })
  .to(dressPaths, {
    strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut', stagger: .06
  }, 0)
  .to('#drawTip', {
    duration: 1.7, ease: 'power1.inOut',
    keyframes: {
      '0%': { attr: { cx: 150, cy: 46 } },
      '20%': { attr: { cx: 120, cy: 96 } },
      '40%': { attr: { cx: 180, cy: 96 } },
      '55%': { attr: { cx: 132, cy: 162 } },
      '70%': { attr: { cx: 90, cy: 340 } },
      '85%': { attr: { cx: 210, cy: 340 } },
      '100%': { attr: { cx: 150, cy: 358 } }
    }
  }, 0)
  .to('#drawTip', { opacity: 0, duration: .3 }, '-=.3')
  .to('.preloader-name', { opacity: 1, duration: .6, ease: 'power2.out' }, '-=.5')
  .to('.preloader-tag', { opacity: 1, duration: .6 }, '-=.35')
  .to('.preloader-inner', { opacity: 0, scale: .96, duration: .6, ease: 'power2.in' }, '+=.5')
  .to('#preloader', { autoAlpha: 0, duration: .5 }, '-=.3');

/* custom cursor */
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
document.querySelectorAll('.section-valeurs, .section-creations, .site-header').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('on-dark'));
  el.addEventListener('mouseleave', () => ring.classList.remove('on-dark'));
});

/* progress bar */
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
}, { passive: true });

/* header hide on scroll down */
let lastY = 0;
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > lastY && y > 200) header.classList.add('hide');
  else header.classList.remove('hide');
  lastY = y;
}, { passive: true });

/* mobile nav */
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
burger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  burger.classList.toggle('open');
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

/* active nav link */
const navLinks = document.querySelectorAll('[data-nav]');
const sections = document.querySelectorAll('main section[id]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`[data-nav][href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(s => navObserver.observe(s));

gsap.registerPlugin(ScrollTrigger);

/* split hero name into chars */
document.querySelectorAll('.hero-name .line').forEach(line => {
  const text = line.textContent;
  line.innerHTML = text.split('').map(c => `<span>${c}</span>`).join('');
});
gsap.set('.hero-name .line span', { yPercent: 120, opacity: 0 });
gsap.to('.hero-name .line span', {
  yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out',
  stagger: .035, delay: 3.1
});
gsap.to('.hero-eyebrow, .hero-role, .hero-tags', {
  opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .15, delay: 3.4
});
gsap.set('.hero-scroll, .rotating-badge', { opacity: 0 });
gsap.to('.hero-scroll', { opacity: 1, duration: 1, delay: 4.0 });
gsap.to('.rotating-badge', { opacity: 1, duration: 1, delay: 4.0 });

/* generic reveal-up */
gsap.utils.toArray('[data-reveal]').forEach(el => {
  if (el.closest('.hero')) return;
  gsap.to(el, {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

/* char reveal for section titles */
document.querySelectorAll('[data-reveal-chars]').forEach(title => {
  const words = title.textContent.split(' ');
  title.innerHTML = words.map(w => `<span class="word" style="display:inline-block;overflow:hidden;"><span class="char" style="display:inline-block;">${w}</span></span>`).join(' ');
  gsap.set(title.querySelectorAll('.char'), { yPercent: 110 });
  gsap.to(title.querySelectorAll('.char'), {
    yPercent: 0, duration: 1, ease: 'power4.out', stagger: .08,
    scrollTrigger: { trigger: title, start: 'top 85%' }
  });
});

/* apropos parallax */
gsap.to('.portrait-frame img', {
  yPercent: -12, ease: 'none',
  scrollTrigger: { trigger: '.apropos-visual', start: 'top bottom', end: 'bottom top', scrub: true }
});

/* values line draw */
ScrollTrigger.create({
  trigger: '.values-line', start: 'top 75%',
  onEnter: () => {
    gsap.fromTo('.values-svg line', { attr: { x2: 0 } }, { attr: { x2: 1000 }, duration: 1.4, ease: 'power3.inOut' });
    gsap.to('.value-pill', { opacity: 1, y: 0, scale: 1, duration: .8, stagger: .12, ease: 'back.out(1.6)', delay: .3 });
  },
  once: true
});

/* services tilt */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5;
    const py = (e.clientY - r.top) / r.height - .5;
    gsap.to(card, { rotateY: px * 8, rotateX: -py * 8, duration: .4, ease: 'power2.out', transformPerspective: 800 });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: .6, ease: 'power3.out' });
  });
});

/* creations follow-cursor image */
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

/* palette copy */
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

/* creation filters */
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

/* floating contact button */
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

/* magnetic buttons */
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

/* stitched thread line under section numbers */
document.querySelectorAll('.section-num').forEach(num => {
  ScrollTrigger.create({
    trigger: num, start: 'top 85%',
    onEnter: () => num.classList.add('stitched'),
    once: true
  });
});

/* fabric-curtain image reveals */
gsap.utils.toArray('.portrait-frame, .creation-thumb').forEach(box => {
  gsap.fromTo(box, { clipPath: 'inset(0 0 100% 0)' }, {
    clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.inOut',
    scrollTrigger: { trigger: box, start: 'top 92%' }
  });
});

/* section background color transition (light/dark) between valeurs, creations */
document.querySelectorAll('.hero, .section-apropos, .section-services, .section-contact').forEach(s => {
  ScrollTrigger.create({
    trigger: s, start: 'top 60%', end: 'bottom 40%',
    onEnter: () => document.body.style.background = 'var(--paper)',
    onEnterBack: () => document.body.style.background = 'var(--paper)'
  });
});
