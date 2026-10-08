/* BLUEPRINT 3D PORTFOLIO
 * No build tools necessary. Edit portfolio-data.js to personalize.
 * Three.js is loaded on demand. An animated mathematical 3D wireframe
 * takes over if the CDN or WebGL is unavailable.
 */
(() => {
  'use strict';
  const profile = window.PORTFOLIO_DATA || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const setText = (selector, value) => { const element = $(selector); if (element && value !== undefined && value !== null) element.textContent = String(value); };
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const safeUrl = input => {
    if (!input || typeof input !== 'string') return '';
    try {
      const url = new URL(input.trim(), document.baseURI);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch (_) { return ''; }
  };
  const projects = Array.isArray(profile.projects) ? profile.projects : [];

  // ---- Populate the website from ONE easy-to-edit content file ----
  const name = String(profile.name || 'Your Name');
  const initials = String(profile.initials || name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase());
  document.title = `${name} — Creative Developer`;
  setText('#brand-name', '');
  const brand = $('#brand-name');
  brand.appendChild(document.createTextNode(name.replace(/\s+/g, '').toUpperCase()));
  const brandExt = document.createElement('span'); brandExt.textContent = '.DEV'; brand.appendChild(brandExt);
  setText('#hero-first-name', name);
  setText('#availability', profile.availability || 'OPEN TO COLLABORATION');
  setText('#hero-description', profile.heroDescription);
  setText('#project-count', String(projects.length).padStart(2, '0'));
  setText('#filter-all-count', String(projects.length).padStart(2, '0'));
  setText('#about-paragraph-one', profile.aboutOne);
  setText('#about-paragraph-two', profile.aboutTwo);
  setText('#profile-name', name);
  setText('#profile-role', profile.role || 'Web Developer');
  setText('#profile-location', profile.location || 'Earth');
  setText('#profile-initials', initials);
  setText('#contact-email', profile.email || 'yourname@example.com');
  setText('#footer-name', name.toUpperCase());
  $('.footer-suffix').textContent = '/ ' + new Date().getFullYear();
  const picture = safeUrl(profile.photo);
  if (picture) { const avatar = $('#profile-avatar'); avatar.style.backgroundImage = `url("${picture.replace(/"/g, '%22')}")`; avatar.classList.add('has-photo'); }
  const resume = safeUrl(profile.resumeUrl);
  if (resume) { const link = $('#resume-link'); link.href = resume; link.classList.remove('is-hidden'); }
  const socialContainer = $('#social-links');
  const socials = (Array.isArray(profile.socials) ? profile.socials : []).filter(item => safeUrl(item.url));
  if (socials.length) socialContainer.innerHTML = socials.map(item => `<a href="${escapeHtml(safeUrl(item.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)} <span aria-hidden="true">↗</span></a>`).join('');
  else socialContainer.innerHTML = '<span class="social-placeholder">Add your GitHub, LinkedIn, or other social links in <strong>portfolio-data.js</strong>.</span>';

  // ---- Project visualization templates (no external screenshots needed) ----
  const mockBrowserTop = '<div class="mock-browser-top"><i></i><i></i><i></i><span class="mock-url"></span></div>';
  function projectPreview(type, label, image, title) {
    const start = `<div class="project-preview preview-${['dashboard', 'travel', 'finance', 'security'].includes(type) ? type : 'dashboard'}" aria-hidden="true"><span class="preview-grid-tag">${escapeHtml(label || 'FEATURED PROJECT')}</span><span class="preview-decor"></span>`;
    const screenshot = safeUrl(image);
    if (screenshot) return start + `<img class="project-screenshot" src="${escapeHtml(screenshot)}" alt="Screenshot of ${escapeHtml(title || 'project')}" loading="lazy">` + '</div>';
    const previews = {
      dashboard: `<div class="mock-browser">${mockBrowserTop}<div class="mock-dash-body"><div class="mock-side"><i></i><i></i><i></i><i></i><i></i></div><div class="mock-main"><div class="mock-main-title"></div><div class="mock-kpis"><div class="mock-kpi"><strong>128</strong><i></i></div><div class="mock-kpi"><strong>84%</strong><i></i></div><div class="mock-kpi"><strong>24</strong><i></i></div></div><div class="mock-bars"><span style="--h:43%"></span><span style="--h:68%"></span><span style="--h:52%"></span><span style="--h:89%"></span><span style="--h:65%"></span><span style="--h:100%"></span><span style="--h:77%"></span></div></div></div></div>`,
      travel: `<div class="travel-scene"><div class="travel-sun"></div><div class="travel-mountain mountain-back"></div><div class="travel-mountain"></div><div class="travel-water"></div><span class="travel-airplane">✈</span></div><div class="travel-card"><small>DISCOVER YOUR NEXT STOP</small><strong>Explore the world.</strong><span>✦ &nbsp; Every destination has a story</span></div>`,
      finance: `<div class="finance-window"><div class="finance-heading">TOTAL SPENDING</div><div class="finance-total">$2,480 <small>↗ 12.5%</small></div><svg class="finance-chart" viewBox="0 0 310 90" preserveAspectRatio="none"><path class="chart-area" d="M0 80 L0 62 L37 68 L71 41 L101 54 L145 24 L179 44 L210 17 L242 25 L274 10 L310 16 L310 80 Z"/><polyline points="0,62 37,68 71,41 101,54 145,24 179,44 210,17 242,25 274,10 310,16"/></svg><div class="finance-bottom"><span></span><span></span><span></span></div></div>`,
      security: `<div class="security-window"><div class="lock-ring">♙</div><strong>Secure your space</strong><p>Sign in to continue</p><div class="security-field"></div><div class="security-field"></div><div class="security-signin">SIGN IN →</div><div class="security-check">✓ ACCESS VERIFIED</div></div>`
    };
    return start + (previews[type] || previews.dashboard) + '</div>';
  }

  // ---- Render projects and working category filters ----
  const grid = $('#projects-grid');
  const filters = $('#project-filters');
  const categories = ['All', ...new Set(projects.map(item => item.category).filter(Boolean))];
  let activeFilter = 'All';
  filters.innerHTML = categories.map(category => {
    const count = category === 'All' ? projects.length : projects.filter(project => project.category === category).length;
    return `<button type="button" class="filter-btn ${category === 'All' ? 'active' : ''}" data-filter="${escapeHtml(category)}" aria-pressed="${category === 'All' ? 'true' : 'false'}">${escapeHtml(category === 'All' ? 'All projects' : category)} <span>${String(count).padStart(2, '0')}</span></button>`;
  }).join('');
  function renderProjects() {
    const filtered = projects.map((project, index) => ({ ...project, originalIndex: index })).filter(project => activeFilter === 'All' || project.category === activeFilter);
    grid.innerHTML = filtered.map(project => `
      <article class="project-card">
        ${projectPreview(project.preview, project.label, project.image, project.title)}
        <div class="project-body"><div class="project-topline"><span class="project-number">PROJECT / ${escapeHtml(project.number || String(project.originalIndex + 1).padStart(2, '0'))}</span><span class="project-category">${escapeHtml(project.category || 'Project')}</span></div>
        <h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p>
        <div class="project-tags">${(project.tags || []).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
        <div class="project-card-bottom"><button class="project-open" type="button" data-index="${project.originalIndex}" aria-label="View details for ${escapeHtml(project.title)}">View details <span aria-hidden="true">↗</span></button>
        ${safeUrl(project.githubUrl) ? `<a class="project-link" href="${escapeHtml(safeUrl(project.githubUrl))}" target="_blank" rel="noopener noreferrer">SOURCE CODE ↗</a>` : '<span class="project-footer-meta">EXPLORE PROJECT →</span>'}</div></div>
      </article>`).join('');
    if (!filtered.length) grid.innerHTML = '<p>No projects in this category yet. Add some in portfolio-data.js!</p>';
    $$('.project-open', grid).forEach(button => button.addEventListener('click', () => showProject(Number(button.dataset.index))));
  }
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    activeFilter = button.dataset.filter;
    $$('.filter-btn', filters).forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    renderProjects();
  });
  renderProjects();

  const skillsGrid = $('#skills-grid');
  skillsGrid.innerHTML = (Array.isArray(profile.skills) ? profile.skills : []).map(skill => `<article class="skill-card reveal"><div class="skill-top"><span class="skill-icon" aria-hidden="true">${escapeHtml(skill.icon || '✳')}</span><span class="skill-number">/ ${escapeHtml(skill.number || '01')}</span></div><div class="skill-label">${escapeHtml(skill.name || 'SKILLS')}</div><h3>${escapeHtml(skill.heading || '')}</h3><p>${escapeHtml(skill.description || '')}</p><div class="skill-tags">${(skill.technologies || []).map(tech => `<span>${escapeHtml(tech)}</span>`).join('')}</div></article>`).join('');

  // ---- Accessible project details dialog ----
  const modal = $('#project-modal');
  let previousFocus = null;
  function showProject(index) {
    const item = projects[index];
    if (!item) return;
    previousFocus = document.activeElement;
    setText('#modal-category', (item.category || 'PROJECT') + ' / ' + (item.number || String(index + 1).padStart(2, '0')));
    setText('#modal-title', item.title);
    setText('#modal-description', item.description);
    $('#modal-tags').innerHTML = (item.tags || []).map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
    $('#modal-highlights').innerHTML = (item.highlights || []).map(highlight => `<li>${escapeHtml(highlight)}</li>`).join('');
    const actions = [];
    if (safeUrl(item.liveUrl)) actions.push(`<a href="${escapeHtml(safeUrl(item.liveUrl))}" target="_blank" rel="noopener noreferrer">Visit live project ↗</a>`);
    if (safeUrl(item.githubUrl)) actions.push(`<a href="${escapeHtml(safeUrl(item.githubUrl))}" target="_blank" rel="noopener noreferrer">View source code ↗</a>`);
    $('#modal-actions').innerHTML = actions.join('') || '<span class="modal-no-links">Add a demo or repository link in portfolio-data.js to display it here.</span>';
    modal.hidden = false;
    document.body.classList.add('modal-open');
    $('#modal-close').focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }
  $('#modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeMenu(); }
    if (e.key !== 'Tab' || modal.hidden) return;
    const focusable = $$('button:not([disabled]), a[href]', modal).filter(el => el.offsetParent !== null);
    if (!focusable.length) return;
    if (e.shiftKey && document.activeElement === focusable[0]) { e.preventDefault(); focusable[focusable.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === focusable[focusable.length - 1]) { e.preventDefault(); focusable[0].focus(); }
  });

  // ---- Mobile menu, scroll state and reveal animations ----
  const menuToggle = $('#menu-toggle');
  const navLinks = $('#nav-links');
  const closeMenu = () => { navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); };
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  $$('.nav-link', navLinks).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!event.target.closest('.nav-shell')) closeMenu(); });
  const scrollProgress = $('#scroll-progress');
  function onScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = `${scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0}%`;
    $('.site-header').classList.toggle('scrolled', window.scrollY > 25);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.10, rootMargin: '0px 0px -18px 0px' });
    $$('.reveal').forEach((el, index) => { el.style.transitionDelay = `${Math.min(index % 3, 2) * 65}ms`; revealObserver.observe(el); });
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-35% 0px -48% 0px' });
    $$('main section[id]').forEach(section => sectionObserver.observe(section));
  } else $$('.reveal').forEach(el => el.classList.add('visible'));

  // ---- Functional email form + copy address ----
  const email = String(profile.email || 'yourname@example.com');
  let toastTimer;
  function toast(message) {
    const element = $('#toast');
    element.textContent = message; element.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('show'), 3000);
  }
  $('#copy-email').addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(email);
      else {
        const field = document.createElement('textarea'); field.value = email; field.style.position = 'fixed'; field.style.opacity = '0'; document.body.appendChild(field); field.select();
        const copied = document.execCommand('copy'); field.remove(); if (!copied) throw new Error('Copy unavailable');
      }
      toast('Email address copied!');
    } catch (_) { toast('Copy unavailable — select the email to copy it.'); }
  });
  $('#contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const note = $('#form-notice');
    if (/example\.com$/i.test(email.trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = 'Add your real email in portfolio-data.js before using this form.';
      note.className = 'form-notice error';
      toast('Set your email in portfolio-data.js first');
      return;
    }
    const sender = $('#contact-name').value.trim();
    const address = $('#contact-sender').value.trim();
    const message = $('#contact-message').value.trim();
    if (!sender || !address || !message) return;
    const subject = encodeURIComponent(`Portfolio inquiry from ${sender}`);
    const body = encodeURIComponent(`Hi ${name},\n\n${message}\n\nFrom: ${sender}\nReply-to: ${address}`);
    const href = `mailto:${email}?subject=${subject}&body=${body}`;
    note.textContent = 'Opening your email app with your message ready to send.';
    note.className = 'form-notice success';
    window.location.href = href;
  });

  // ---- Interactive 3D wireframe fallback, drawn locally with JS ----
  const stage = $('#hero-visual');
  const fallbackCanvas = $('#fallback-canvas');
  const threeCanvas = $('#three-canvas');
  const ctx = fallbackCanvas.getContext('2d');
  const mouse = { x: 0, y: 0, down: false };
  let threeStarted = false;
  let viewWidth = 560, viewHeight = 560;
  let frame = 0;
  let sceneVisible = true;
  const stars = Array.from({ length: 74 }, (_, i) => ({ x: ((i * 173 + 37) % 997) / 997, y: ((i * 431 + 113) % 991) / 991, r: i % 9 === 0 ? 1.8 : .65, alpha: .25 + ((i * 71) % 69) / 100 }));
  function resizeFallback() {
    const box = stage.getBoundingClientRect();
    viewWidth = Math.max(box.width, 1); viewHeight = Math.max(box.height, 1);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    fallbackCanvas.width = Math.round(viewWidth * ratio); fallbackCanvas.height = Math.round(viewHeight * ratio);
    if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (reducedMotion && !threeStarted) drawFallback();
  }
  function rotate3D(p, ax, ay, az) {
    let [x, y, z] = p;
    const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax), cz = Math.cos(az), sz = Math.sin(az);
    const xx = x * cy + z * sy, zz = -x * sy + z * cy;
    const yy = y * cx - zz * sx, z2 = y * sx + zz * cx;
    return [xx * cz - yy * sz, xx * sz + yy * cz, z2];
  }
  function drawFallback() {
    if (!ctx) return;
    const w = viewWidth, h = viewHeight, cx = w * .5, cy = h * .48;
    ctx.clearRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * .46);
    glow.addColorStop(0, 'rgba(28,117,219,.23)'); glow.addColorStop(.36, 'rgba(16,69,143,.18)'); glow.addColorStop(1, 'rgba(5,20,43,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
    for (const dot of stars) { ctx.beginPath(); ctx.arc(w * dot.x, h * dot.y, dot.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(134,210,255,${dot.alpha * .48})`; ctx.fill(); }
    const t = reducedMotion ? .55 : frame * .0044;
    const angleX = .51 + Math.sin(t * .53) * .28 + mouse.y * .26;
    const angleY = t * .42 + mouse.x * .36;
    const angleZ = -.24 + Math.sin(t * .25) * .15;
    const scale = Math.min(w, h) * 1.20;
    const project = point => { const [x, y, z] = rotate3D(point, angleX, angleY, angleZ); const factor = scale / (6.9 - z * .6); return [cx + x * factor, cy + y * factor, z]; };
    function line3D(points, color, lineWidth = 1, close = false) {
      ctx.beginPath(); points.forEach((p, i) => { const [x, y] = project(p); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); if (close) ctx.closePath(); ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke();
    }
    // A rotating toroidal surface, rendered from true 3D coordinates.
    const segments = 58, steps = 17, R = 1.60, r = .49;
    const torusPoint = (a, b) => [(R + r * Math.cos(b)) * Math.cos(a), (R + r * Math.cos(b)) * Math.sin(a), r * Math.sin(b)];
    ctx.save(); ctx.shadowColor = 'rgba(59,175,252,.45)'; ctx.shadowBlur = 8;
    for (let j = 0; j < steps; j++) {
      const b = j / steps * Math.PI * 2;
      const points = Array.from({ length: segments + 1 }, (_, i) => torusPoint(i / segments * Math.PI * 2, b));
      line3D(points, `rgba(83,185,248,${j % 3 === 0 ? .46 : .22})`, j % 3 === 0 ? 1.1 : .65);
    }
    for (let i = 0; i < segments; i += 2) {
      const a = i / segments * Math.PI * 2;
      const points = Array.from({ length: steps * 2 + 1 }, (_, j) => torusPoint(a, j / (steps * 2) * Math.PI * 2));
      line3D(points, `rgba(88,181,253,${i % 6 === 0 ? .38 : .20})`, .75);
    }
    ctx.restore();
    // Several orbital bands with different 3D planes.
    for (let band = 0; band < 3; band++) {
      const radius = 2.15 + band * .18;
      const points = [];
      for (let i = 0; i <= 170; i++) {
        const a = i / 170 * Math.PI * 2; const p = [Math.cos(a) * radius, Math.sin(a) * radius, 0];
        if (band === 1) { p[1] *= .36; p[2] = Math.sin(a) * radius * .92; }
        if (band === 2) { p[0] *= .42; p[2] = Math.cos(a) * radius * .91; }
        points.push(p);
      }
      line3D(points, `rgba(89,187,255,${band === 0 ? .39 : .22})`, band === 0 ? 1.2 : .8);
    }
    for (let i = 0; i < 25; i++) {
      const a = i * 2.39996 + t * .12;
      const p = [Math.cos(a) * (1.9 + i % 4 * .08), Math.sin(a) * (1.9 + i % 4 * .08), Math.sin(i * 1.7) * .45];
      const [x, y, z] = project(p);
      ctx.beginPath(); ctx.arc(x, y, z > 0 ? 1.8 : 1, 0, Math.PI * 2); ctx.fillStyle = `rgba(167,227,255,${z > 0 ? .95 : .44})`; ctx.fill();
    }
    const center = ctx.createRadialGradient(cx, cy, 0, cx, cy, 29);
    center.addColorStop(0, 'rgba(186,236,255,.94)'); center.addColorStop(.16, 'rgba(84,188,255,.72)'); center.addColorStop(1, 'rgba(51,159,244,0)');
    ctx.beginPath(); ctx.arc(cx, cy, 29, 0, Math.PI * 2); ctx.fillStyle = center; ctx.fill();
  }
  stage.addEventListener('pointermove', e => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 2 - 1;
    const y = (e.clientY - rect.top) / rect.height * 2 - 1;
    mouse.x = Math.max(-1, Math.min(1, x)); mouse.y = Math.max(-1, Math.min(1, y));
    if (reducedMotion && !threeStarted) drawFallback();
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { mouse.x = mouse.y = 0; });
  window.addEventListener('resize', resizeFallback, { passive: true });
  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver(entries => { sceneVisible = entries[0]?.isIntersecting ?? true; }, { threshold: 0 });
    visibilityObserver.observe(stage);
  }
  resizeFallback();
  function fallbackLoop() {
    if (threeStarted) return;
    if (!document.hidden && sceneVisible) { if (!reducedMotion) frame++; drawFallback(); }
    if (!reducedMotion) requestAnimationFrame(fallbackLoop);
  }
  fallbackLoop();

  // ---- Upgrade the sculpture to Three.js automatically when available ----
  // Loading is nonblocking and optional so the page also functions offline.
  function startThree() {
    if (!window.THREE || threeStarted || reducedMotion) return;
    let renderer;
    try {
      const THREE = window.THREE;
      renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, .1, 100); camera.position.z = 9.8;
      const group = new THREE.Group(); scene.add(group);
      const blue = 0x65c9ff;
      const nucleus = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 2), new THREE.MeshPhysicalMaterial({ color: 0x2c7dc6, metalness: .35, roughness: .32, transparent: true, opacity: .23, flatShading: true, side: THREE.DoubleSide, clearcoat: 1 }));
      group.add(nucleus);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.56, 2)), new THREE.LineBasicMaterial({ color: 0x8bdcff, transparent: true, opacity: .35 })); group.add(edges);
      const inner = new THREE.Mesh(new THREE.TorusKnotGeometry(.92, .14, 170, 11, 2, 3), new THREE.MeshBasicMaterial({ color: 0x82d1ff, transparent: true, opacity: .55, wireframe: true })); group.add(inner);
      const innerCore = new THREE.Mesh(new THREE.IcosahedronGeometry(.35, 1), new THREE.MeshBasicMaterial({ color: 0x65caff, transparent: true, opacity: .5, wireframe: true })); group.add(innerCore);
      function addRing(radius, rotation, opacity, tube = .007) { const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 5, 160), new THREE.MeshBasicMaterial({ color: blue, transparent: true, opacity })); ring.rotation.set(...rotation); group.add(ring); return ring; }
      const ring1 = addRing(2.15, [.6, .35, .16], .47);
      const ring2 = addRing(2.30, [1.23, .5, -.40], .28);
      const ring3 = addRing(1.96, [.2, 1.25, .42], .23, .006);
      const positions = [];
      for (let i = 0; i < 220; i++) { const a = i * 2.39996, y = 1 - 2 * (i + .5) / 220, r = Math.sqrt(1 - y * y), rad = 2.05 + (i % 9) * .047; positions.push(Math.cos(a) * r * rad, y * rad, Math.sin(a) * r * rad); }
      const dotsGeo = new THREE.BufferGeometry(); dotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({ color: 0x99dfff, size: .027, transparent: true, opacity: .78, sizeAttenuation: true })); group.add(dots);
      const glow = new THREE.PointLight(0x74caff, 3.0, 12); glow.position.set(2, 3, 4); scene.add(glow);
      scene.add(new THREE.AmbientLight(0x568abc, 2.0));
      function resizeThree() { const rect = stage.getBoundingClientRect(); const w = Math.max(1, rect.width), h = Math.max(1, rect.height); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
      resizeThree(); window.addEventListener('resize', resizeThree, { passive: true });
      threeStarted = true; threeCanvas.classList.add('active'); fallbackCanvas.classList.add('hidden');
      let elapsed = 0;
      function threeLoop() {
        if (!threeStarted) return;
        if (!document.hidden && sceneVisible) {
          elapsed += .008;
          group.rotation.y += (elapsed * .05 + mouse.x * .16 - group.rotation.y) * .025;
          group.rotation.x += (.27 + Math.sin(elapsed * .53) * .10 + mouse.y * .17 - group.rotation.x) * .025;
          group.rotation.z += .0018;
          inner.rotation.x += .0035; inner.rotation.y += .005;
          ring1.rotation.z += .001; ring2.rotation.x -= .0008; ring3.rotation.y += .0007;
          camera.position.x += (mouse.x * .26 - camera.position.x) * .025;
          camera.position.y += (-mouse.y * .20 - camera.position.y) * .025;
          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);
        }
        requestAnimationFrame(threeLoop);
      }
      threeLoop();
    } catch (error) {
      if (renderer) try { renderer.dispose(); } catch (_) {/* no WebGL */ }
      console.info('Three.js is unavailable; keeping the animated JavaScript 3D fallback.', error);
    }
  }
  function requestThree() {
    if (reducedMotion || !navigator.onLine) return;
    const sources = [
      'https://cdn.jsdelivr.net/npm/three@0.148.0/build/three.min.js',
      'https://unpkg.com/three@0.148.0/build/three.min.js'
    ];
    function attempt(index) {
      if (index >= sources.length) return;
      const tag = document.createElement('script'); tag.async = true; tag.src = sources[index]; tag.crossOrigin = 'anonymous';
      tag.onload = () => { if (window.THREE) startThree(); else attempt(index + 1); };
      tag.onerror = () => attempt(index + 1);
      document.head.appendChild(tag);
    }
    attempt(0);
  }
  requestThree();
})();
