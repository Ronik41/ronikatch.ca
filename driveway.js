import { mountWhoopDisplay } from './whoop-display.mjs';
import { chapters } from './experience.mjs';
import { journey, experiences, adjacentExperience, experienceLabel } from './journey.mjs';
import { screenMatrix, sceneLayout, cabinForeground } from './scene-geometry.mjs';

const $ = selector => document.querySelector(selector);
const app = $('#app');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 700px), (max-width: 950px) and (max-height: 500px)');
const mobileStops = ['cybercab', 'cybertruck', 'ford', 'whoop', 'electrium', 'exceed'];
let mobileCarIndex = 0;
let activeExperience = null;
let activeChapter = null;
let activeProp = null;
let previousFocus = null;
let entryToken = 0;
let finishEntry = null;

const photoButton = (src, caption, hero = false) => `<button class="photo-open ${hero ? 'hero-photo' : ''}" data-photo="${src}" data-caption="${caption}" aria-label="View full photo: ${caption}"><img src="${src}" alt="${caption}" loading="lazy"><span>View full photo ↗</span></button>`;
const metricsFor = c => c.metrics.length ? `<div class="metric-grid">${c.metrics.map(([value, label]) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>` : '';
const storiesFor = c => c.work.map(([title, body]) => `<article class="story-block"><h3>${title}</h3><p>${body}</p></article>`).join('');
const hasWorkPhoto = c => ['electrium', 'exceed'].includes(c.id);
function vehicleGraphic(id) {
  const shapes = {
    cybertruck: 'M20 87 L28 61 L104 29 L152 29 L213 65 L244 74 L246 96 L20 96 Z',
    cybercab: 'M20 87 Q24 68 59 63 L93 38 Q103 31 128 33 L164 37 L205 64 Q237 68 244 87 L244 96 L20 96 Z',
    ford: 'M20 87 L27 65 L59 59 L84 30 L169 30 Q181 31 190 47 L207 62 L239 69 L245 96 L20 96 Z',
  };
  return `<svg class="vehicle-graphic" viewBox="0 0 270 130" fill="none" aria-hidden="true"><path d="M8 114H260" stroke="currentColor" opacity=".15"/><path d="${shapes[id] || shapes.cybercab}" fill="currentColor" fill-opacity=".07" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M66 61H189M112 38V60" stroke="currentColor" stroke-width="2" opacity=".45"/><circle cx="65" cy="96" r="17" fill="#edf1f4" stroke="currentColor" stroke-width="3"/><circle cx="204" cy="96" r="17" fill="#edf1f4" stroke="currentColor" stroke-width="3"/><circle cx="65" cy="96" r="7" stroke="currentColor" opacity=".5"/><circle cx="204" cy="96" r="7" stroke="currentColor" opacity=".5"/></svg>`;
}

function updateMobileGarage(index = mobileCarIndex) {
  mobileCarIndex = Math.max(0, Math.min(mobileStops.length - 1, index));
  const c = experiences[mobileStops[mobileCarIndex]];
  $('#mobile-vehicle-name').innerHTML = `<strong>${experienceLabel(c)}</strong><span>${c.location}</span>`;
  $('#mobile-swipe-hint').textContent = `Swipe to look around · ${mobileCarIndex + 1} of ${mobileStops.length}`;
  $('#mobile-previous-car').disabled = mobileCarIndex === 0;
  $('#mobile-next-car').disabled = mobileCarIndex === mobileStops.length - 1;
  $('#start-journey').innerHTML = mobile.matches ? `Explore ${experienceLabel(c)} <span aria-hidden="true">→</span>` : 'Explore my work <span aria-hidden="true">→</span>';
  app.dataset.mobileCar = c.id;
  app.dataset.mobileObject = String(!chapters[c.id]);
  layoutScene();
}

function overview(c) {
  return `<div class="role-meta"><span>${c.dates}</span><span>·</span><span>${c.location}</span></div>
    <div class="work-intro ${hasWorkPhoto(c) ? 'has-work-photo' : ''}"><div><h3>${c.title}</h3><p>${c.description}</p>${metricsFor(c)}</div>${hasWorkPhoto(c) ? photoButton(c.image, c.caption, true) : ''}</div>
    <div class="overview-stories"><p class="section-label">Selected contributions</p>${storiesFor(c)}</div>
    ${chapters[c.id] ? `<div class="optional-extras"><button data-cabin>← Return to the ${c.vehicle}</button></div>` : ''}`;
}

function renderWork(c) {
  $('#screen-content').innerHTML = overview(c);
  $('#screen-content').scrollTop = 0;
}

function renderJourneyControls(c) {
  const index = journey.findIndex(item => item.id === c.id);
  $('#vehicle-panel').innerHTML = `${chapters[c.id] ? `<div class="vehicle-summary">${vehicleGraphic(c.id)}<span>${c.vehicle}</span></div>` : ''}<p class="rail-label">DESTINATIONS</p>${journey.map(item => `<button data-experience="${item.id}" ${item.id === c.id ? 'aria-current="step"' : ''}><strong>${item.company}</strong><small>${item.year}</small></button>`).join('')}<div class="rail-links"><a class="rail-resume" href="assets/resume/Roni_Katcharovski_Resume_Software_2027.pdf" target="_blank" rel="noreferrer">Résumé ↗</a><a class="rail-contact" href="mailto:rkatchar@uwaterloo.ca">Contact ↗</a></div>`;
  const previous = adjacentExperience(c.id, -1);
  const next = adjacentExperience(c.id, 1);
  $('#previous-experience').textContent = mobile.matches ? '←' : previous ? `← ${experienceLabel(previous)}` : '← Driveway';
  $('#previous-experience').setAttribute('aria-label', previous ? `Previous: ${experienceLabel(previous)}` : 'Back to driveway');
  $('#next-experience').textContent = next ? `Next: ${experienceLabel(next)} →` : 'Get in touch →';
  $('#journey-progress').textContent = `${index + 1} of ${journey.length}`;
  $('#next-car').textContent = next ? `Next: ${experienceLabel(next)} →` : 'Back to driveway';
  $('#mobile-role-select').innerHTML = journey.map(item => `<option value="${item.id}" ${item.id === c.id ? 'selected' : ''}>${experienceLabel(item)}</option>`).join('');
  $('#screen-back').textContent = mobile.matches ? '← Driveway' : 'Back to driveway';
}

function setReading(reading) {
  document.body.classList.toggle('reading-work', reading);
  for (const selector of ['.site-header', '.journey-intro', '#car-hotspots', '#cabin-ui', '#mobile-garage', '#mobile-all-work']) $(selector).inert = reading;
}

function wakeScreen() {
  if (!activeExperience) return;
  $('#infotainment').hidden = false;
  $('#infotainment').classList.add('focused');
  $('#screen-wake').hidden = true;
  app.dataset.screen = 'on';
  // Reset after revealing the panel: hidden scrollers can retain their old offset.
  $('#screen-content').scrollTop = 0;
  setReading(true);
  history.replaceState({ ...history.state, read: true }, '', location.href);
  $('#screen-title').focus({ preventScroll: true });
  $('#announcer').textContent = `${experienceLabel(experiences[activeExperience])}. ${$('#journey-progress').textContent}.`;
}

function closeScreen() {
  $('#infotainment').hidden = true;
  $('#infotainment').classList.remove('focused');
  app.dataset.screen = 'off';
  $('#screen-wake').hidden = false;
  setReading(false);
}

function updateHash(key, read = true) {
  const target = key ? `#${key}` : location.pathname + location.search;
  if (key ? location.hash !== target : !!location.hash) history.pushState({ read }, '', target);
  else history.replaceState({ read }, '', location.href);
}

// Keep animation ownership explicit so Escape, history, resize, and Skip can
// cancel a journey without a delayed callback reopening the previous vehicle.
const travelAnimations = new Set();
const sceneOrigins = { ford: '21% 64%', cybertruck: '49% 64%', cybercab: '79% 65%', whoop: '52.5% 86%', electrium: '35% 85%', exceed: '70% 84%' };
const propNames = { whoop: 'WHOOP display', electrium: 'electric skateboard', exceed: 'robot' };
function sceneCamera(key, scale) {
  const [x, y] = sceneOrigins[key].split(' ').map(value => parseFloat(value) / 100);
  const world = $('#world');
  // Pan the chosen car to the center even when the cover image is cropped.
  const dx = app.clientWidth / 2 - (world.offsetLeft + world.offsetWidth * x);
  const dy = app.clientHeight * .58 - (world.offsetTop + world.offsetHeight * y);
  return `translate(${dx}px, ${dy}px) scale(${scale})`;
}
function cancelTravel() {
  for (const animation of travelAnimations) animation.cancel();
  travelAnimations.clear();
  app.classList.remove('traveling', 'entering');
  delete app.dataset.travelPhase;
  app.removeAttribute('aria-busy');
  $('#infotainment').inert = false;
  $('#transition').classList.remove('visible');
  $('#transition').setAttribute('aria-hidden', 'true');
  $('#skip-animation').tabIndex = -1;
}
function travelPhase(phase, label) {
  app.dataset.travelPhase = phase;
  $('#transition-label').textContent = label;
}
function beginTravel(label) {
  app.classList.add('traveling');
  app.setAttribute('aria-busy', 'true');
  $('#infotainment').inert = true;
  setReading(true);
  $('#transition-label').textContent = label;
  $('#transition').classList.add('visible');
  $('#transition').setAttribute('aria-hidden', 'false');
  $('#skip-animation').tabIndex = 0;
  $('#skip-animation').focus({ preventScroll: true });
}
async function animateTravel(element, keyframes, duration, token) {
  if (token !== entryToken) return;
  const animation = element.animate(keyframes, {
    duration: mobile.matches ? duration * .65 : duration, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards',
  });
  travelAnimations.add(animation);
  await animation.finished.catch(() => {});
  animation.cancel();
  travelAnimations.delete(animation);
}
async function lowerScreen(token) {
  if (!$('#infotainment').hidden) {
    travelPhase('screen', 'Leaving this experience');
    await animateTravel($('#infotainment'), [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(.96)' },
    ], 170, token);
  }
}
async function leaveVehicle(token) {
  if (activeProp) {
    travelPhase('leaving', `Leaving the ${propNames[activeProp]}`);
    await animateTravel($('#world'), [
      { transform: $('#world').style.transform },
      { transform: 'scale(1)' },
    ], 650, token);
    if (token !== entryToken) return;
    activeProp = null;
    $('#world').style.transform = '';
    return;
  }
  if (app.dataset.view !== 'cabin' || !activeChapter) return;
  travelPhase('leaving', `Leaving the ${chapters[activeChapter].vehicle}`);
  $('#world').style.transformOrigin = sceneOrigins[activeChapter];
  app.dataset.view = 'driveway';
  $('#cabin-ui').hidden = true;
  await Promise.all([
    animateTravel($('#cabin-scene'), [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(.93)' },
    ], 480, token),
    animateTravel($('#world'), [
      { opacity: .15, transform: sceneCamera(activeChapter, 1.85) },
      { opacity: 1, transform: 'scale(1)' },
    ], 650, token),
  ]);
}
function renderCabinDisplay(c) {
  $('#cabin-display').innerHTML = `<div class="display-vehicle"><div class="display-park"><strong>P</strong><span>PARKED</span></div>${vehicleGraphic(c.id)}<p>${c.vehicle}</p></div><div class="display-work"><p class="display-meta">${experienceLabel(c)}</p><h3>${c.title}</h3><p class="display-role">${c.role}</p><span class="display-action">Explore the work <span>↗</span></span></div>`;
}

function prepareCabin(key) {
  activeChapter = chapters[key] ? key : null;
  activeProp = activeChapter ? null : key;
  $('#world').style.transform = '';
  app.dataset.view = activeChapter ? 'cabin' : 'driveway';
  app.dataset.car = activeChapter || '';
  $('#cabin-ui').hidden = !activeChapter;
  if (activeChapter) {
    const c = chapters[key];
    renderCabinDisplay(experiences[key]);
    $('#cabin-image').src = `assets/scenes/${key}-stylized.webp`;
    const foreground = $('#cabin-foreground');
    const contour = cabinForeground[key];
    foreground.hidden = !contour;
    if (contour) {
      foreground.src = $('#cabin-image').src;
      const [width, height] = sceneLayout[key].size;
      foreground.style.clipPath = `polygon(${contour.map(([x, y]) => `${x / width * 100}% ${y / height * 100}%`).join(',')})`;
    }
    $('#cabin-image').alt = `Inside the ${c.vehicle}.`;
    $('#vehicle-label').textContent = `${c.vehicle} / ${c.year}`;
    $('#screen-wake').setAttribute('aria-label', `Read ${experienceLabel(c)} experience`);
    $('#cabin-hint').textContent = mobile.matches
      ? 'Tap the screen to explore this experience.'
      : 'Tap the screen for this chapter. Tap the wristband for WHOOP.';
  }
  layoutScene();
}

async function openExperience(key, { route = true, instant = false, read = true } = {}) {
  const c = experiences[key];
  if (!c) return;
  $('#info-dialog').close();
  $('#photo-dialog').close();
  if (mobile.matches && mobileStops.includes(key)) updateMobileGarage(mobileStops.indexOf(key));
  if (!document.body.classList.contains('reading-work')) previousFocus = document.activeElement;
  const sameVehicle = activeChapter === key && app.dataset.view === 'cabin';
  const token = ++entryToken;
  cancelTravel();
  if (route) updateHash(key, read);
  activeExperience = key;
  let finished = false;
  const live = () => token === entryToken && !finished;
  const finish = () => {
    if (!live()) return;
    finished = true;
    finishEntry = null;
    cancelTravel();
    closeScreen();
    prepareCabin(key);
    $('#screen-brand').innerHTML = chapters[c.id] ? `<b class=park-indicator>P</b> PARKED <span>·</span> ${c.vehicle}` : 'RONI KATCHAROVSKI · CAREER JOURNEY';
    $('#screen-title').textContent = experienceLabel(c);
    $('#screen-kicker').textContent = c.role;
    $('#infotainment').dataset.system = 'tesla';
    renderJourneyControls(c);
    renderWork(c);
    if (read || !activeChapter) wakeScreen();
    else {
      $('#screen-wake').focus({ preventScroll: true });
      $('#announcer').textContent = `Inside the ${c.vehicle}. Select the screen to explore ${experienceLabel(c)}.`;
    }
  };
  finishEntry = finish;
  if (instant || reducedMotion.matches || sameVehicle) return finish();
  const image = new Image();
  const ready = chapters[key] ? (() => {
    image.src = `assets/scenes/${key}-stylized.webp`;
    return Promise.race([image.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 800))]);
  })() : Promise.resolve();
  beginTravel(`Going to ${experienceLabel(c)}`);
  await lowerScreen(token);
  if (!live()) return;
  closeScreen();
  setReading(true);
  await leaveVehicle(token);
  if (!live()) return;
  // Hold the driveway long enough to establish where the selected car is.
  travelPhase('driveway', chapters[key] ? `Next: ${c.vehicle}` : experienceLabel(c));
  await animateTravel($('#world'), [{ transform: 'scale(1)' }, { transform: 'scale(1)' }], 180, token);
  if (!live()) return;
  await ready;
  if (!live()) return;
  if (chapters[key]) {
    travelPhase('entering', `Entering the ${c.vehicle}`);
    $('#world').style.transformOrigin = sceneOrigins[key];
    await animateTravel($('#world'), [
      { opacity: 1, transform: 'scale(1)', offset: 0 },
      { opacity: 1, transform: sceneCamera(key, 2.2), offset: .78 },
      { opacity: 0, transform: sceneCamera(key, 2.65), offset: 1 },
    ], 700, token);
    if (!live()) return;
    prepareCabin(key);
    travelPhase('cabin', `${c.vehicle} · ${c.year}`);
    await animateTravel($('#cabin-scene'), [
      { opacity: 0, transform: 'scale(1.08)' },
      { opacity: 1, transform: 'scale(1)' },
    ], 380, token);
    if (!live()) return;
  } else {
    travelPhase('approaching', `Approaching the ${propNames[key]}`);
    $('#world').style.transformOrigin = sceneOrigins[key];
    const closeup = sceneCamera(key, mobile.matches ? 1.65 : 3.1);
    await animateTravel($('#world'), [
      { transform: 'scale(1)' },
      { transform: closeup, offset: .85 },
      { transform: closeup },
    ], 1100, token);
    if (!live()) return;
  }
  finish();
}

async function exitCar({ route = true, instant = false } = {}) {
  const token = ++entryToken;
  cancelTravel();
  $('#info-dialog').close();
  $('#photo-dialog').close();
  if (route) updateHash(null);
  let finished = false;
  const live = () => token === entryToken && !finished;
  const finish = () => {
    if (!live()) return;
    finished = true;
    finishEntry = null;
    cancelTravel();
    closeScreen();
    activeExperience = null;
    activeChapter = null;
    activeProp = null;
    $('#world').style.transform = '';
    app.dataset.view = 'driveway';
    app.dataset.car = '';
    $('#cabin-ui').hidden = true;
    const focus = previousFocus?.isConnected && previousFocus.matches('button,a,[tabindex]') && previousFocus.getClientRects().length ? previousFocus : $('#start-journey');
    focus.focus({ preventScroll: true });
    $('#announcer').textContent = 'Back in the driveway.';
  };
  finishEntry = finish;
  if (instant || reducedMotion.matches) return finish();
  beginTravel('Back to the driveway');
  await lowerScreen(token);
  if (!live()) return;
  closeScreen();
  setReading(true);
  await leaveVehicle(token);
  if (!live()) return;
  finish();
}

function nextExperience() {
  const next = adjacentExperience(activeExperience, 1);
  if (next) openExperience(next.id);
  else openInfo();
}

function routeFromHash({ instant = false } = {}) {
  const key = location.hash.slice(1);
  if (experiences[key]) openExperience(key, { route: false, instant, read: history.state?.read !== false });
  else if (key === 'work' || key === 'experience-timeline') openExperience(journey[0].id, { route: false, instant }); else if (activeExperience || finishEntry) exitCar({ route: false, instant });
}

function openInfo(type = 'contact') {
  const target = $('#info-content');
  if (type === 'about') renderAbout(target);
  else if (type === 'experience-list') target.innerHTML = `<p class="eyebrow">THE JOURNEY SO FAR</p><h2 id="info-title">Choose a stop.</h2><div class="experience-chooser">${journey.map((c, i) => `<button data-experience="${c.id}"><span>${String(i + 1).padStart(2, '0')}</span><div><strong>${experienceLabel(c)}</strong><small>${c.role}<br>${c.location}</small></div><span aria-hidden="true">↗</span></button>`).join('')}</div>`;
  else target.innerHTML = `<p class="eyebrow">LET’S BUILD SOMETHING</p><h2 id="info-title">Get in touch.</h2><p>Software engineering at Tesla, WHOOP, and Ford.<br>Computer Engineering at the University of Waterloo.</p><div class="info-links"><a href="mailto:rkatchar@uwaterloo.ca">Email Roni ↗</a><a href="https://linkedin.com/in/roni-katcharovski" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="assets/resume/Roni_Katcharovski_Resume_Software_2027.pdf" target="_blank" rel="noreferrer">View résumé ↗</a></div>`;
  if (!$('#info-dialog').open) $('#info-dialog').showModal();
  $('#info-dialog').scrollTop = 0;
  $('#info-title').tabIndex = -1;
  $('#info-title').focus({ preventScroll: true });
}


document.addEventListener('click', e => {
  const photo = e.target.closest('[data-photo]');
  if (photo) {
    $('#full-photo').src = photo.dataset.photo;
    $('#full-photo').alt = photo.dataset.caption;
    $('#photo-caption').textContent = photo.dataset.caption;
    $('#photo-dialog').showModal();
    return;
  }
  const experience = e.target.closest('[data-experience], [data-enter]');
  if (experience) { openExperience(experience.dataset.experience || experience.dataset.enter, { read: !experience.hasAttribute('data-enter') }); return; }
  const info = e.target.closest('[data-open]');
  if (info) {
    if (experiences[info.dataset.open]) openExperience(info.dataset.open);
    else if (info.dataset.open === 'experience') { if (mobile.matches) openInfo('experience-list'); else openExperience(journey[0].id); }
    else openInfo(info.dataset.open);
  }
  if (e.target.closest('[data-cabin]')) { closeScreen(); history.replaceState({ read: false }, '', location.href); $('#screen-wake').focus({ preventScroll: true }); }
});
let swipeStart = null;
let suppressSceneClickUntil = 0;
app.addEventListener('pointerdown', e => {
  if (!mobile.matches || app.dataset.view !== 'driveway' || app.dataset.screen === 'on' || app.classList.contains('traveling')) return;
  if (e.target.closest('.site-header,.journey-intro,.mobile-garage,.mobile-all-work')) return;
  swipeStart = { x: e.clientX, y: e.clientY };
});
app.addEventListener('pointerup', e => {
  if (!swipeStart) return;
  const dx = e.clientX - swipeStart.x, dy = e.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
    suppressSceneClickUntil = performance.now() + 400;
    updateMobileGarage(mobileCarIndex + (dx < 0 ? 1 : -1));
  }
});
app.addEventListener('pointercancel', () => { swipeStart = null; });
app.addEventListener('click', e => {
  if (performance.now() < suppressSceneClickUntil && e.target.closest('#car-hotspots')) {
    e.preventDefault(); e.stopImmediatePropagation();
  }
}, true);
$('#start-journey').addEventListener('click', () => openExperience(mobile.matches ? mobileStops[mobileCarIndex] : journey[0].id));
$('#mobile-previous-car').addEventListener('click', () => updateMobileGarage(mobileCarIndex - 1));
$('#mobile-next-car').addEventListener('click', () => updateMobileGarage(mobileCarIndex + 1));
$('#mobile-role-select').addEventListener('change', e => openExperience(e.target.value));
$('#mobile-cabin-read').addEventListener('click', wakeScreen);
$('#screen-back').addEventListener('click', () => exitCar());
$('#exit-car').addEventListener('click', () => exitCar());
$('#previous-experience').addEventListener('click', () => {
  const previous = adjacentExperience(activeExperience, -1);
  if (previous) openExperience(previous.id);
  else exitCar();
});
$('#next-experience').addEventListener('click', nextExperience);
$('#next-car').addEventListener('click', () => {
  const next = adjacentExperience(activeExperience, 1);
  if (next) openExperience(next.id);
  else exitCar();
});
$('.identity').addEventListener('click', e => { e.preventDefault(); exitCar(); window.scrollTo({ top: 0 }); });
$('#whoop-hotspot').addEventListener('click', () => openExperience('whoop'));
$('#screen-wake').addEventListener('click', wakeScreen);
$('#skip-animation').addEventListener('click', () => finishEntry?.());
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
}
document.addEventListener('keydown', e => {
  if (document.querySelector('dialog[open]')) return;
  if (e.key === 'Escape' && (activeExperience || finishEntry)) { e.preventDefault(); exitCar(); }
  if (e.key === 'Tab' && app.classList.contains('traveling')) { e.preventDefault(); $('#skip-animation').focus(); return; }
  if (e.key === 'Tab' && app.dataset.screen === 'on') {
    const controls = [...$('#infotainment').querySelectorAll('button:not([disabled]),a,select,[tabindex="0"]')].filter(el => el.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (e.shiftKey && (document.activeElement === first || document.activeElement === $('#screen-title'))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
window.addEventListener('hashchange', () => routeFromHash());
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finishEntry?.(); });
mobile.addEventListener('change', () => {
  if (activeExperience) openExperience(activeExperience, { route: false, instant: true, read: app.dataset.screen === 'on' });
  updateMobileGarage();
});
$('#driveway-image').addEventListener('error', () => app.classList.add('scene-load-failed'));
$('#driveway-image').addEventListener('load', layoutScene);
$('#cabin-image').addEventListener('load', layoutScene);
new ResizeObserver(layoutScene).observe(app);
function updateClock() {
  const time = new Date().toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', hour12: false });
  document.querySelectorAll('.clock').forEach(el => el.textContent = time);
}
updateClock();
setInterval(updateClock, 60000);

function layoutScene() {
  const box = app.getBoundingClientRect();
  const image = $('#driveway-image');
  const aspect = (image.naturalWidth || 1672) / (image.naturalHeight || 941);
  const phoneLandscape = mobile.matches && box.width > box.height;
  const objectSelected = !chapters[mobileStops[mobileCarIndex]];
  const width = mobile.matches ? box.width * (objectSelected ? (phoneLandscape ? 2 : 4) : (phoneLandscape ? 1.3 : 2.5)) : Math.max(box.width, box.height * aspect);
  const height = width / aspect;
  const world = $('#world');
  world.style.width = `${width}px`;
  world.style.height = `${height}px`;
  const selected = sceneOrigins[mobileStops[mobileCarIndex]].split(' ').map(value => parseFloat(value) / 100);
  world.style.left = `${mobile.matches ? box.width * (phoneLandscape ? .74 : .5) - width * selected[0] : (box.width - width) / 2}px`;
  const mobileCarY = phoneLandscape ? box.height * .32 : box.height <= 700 ? box.height * .49 : box.height * .54;
  world.style.top = `${mobile.matches ? mobileCarY - height * selected[1] : (box.height - height) / 2}px`;
  if (activeProp && !app.classList.contains('traveling')) {
    world.style.transformOrigin = sceneOrigins[activeProp];
    world.style.transform = sceneCamera(activeProp, mobile.matches ? 1.65 : 3.1);
  }
  if (!activeChapter) return;
  const { size, corners, wrist } = sceneLayout[activeChapter];
  const centerX = (corners[0][0] + corners[2][0]) / 2;
  const centerY = (corners[0][1] + corners[2][1]) / 2;
  const scale = mobile.matches ? box.width * .88 / ((corners[1][0] - corners[0][0]) * size[0]) : Math.max(box.width / size[0], box.height / size[1]);
  const cw = size[0] * scale, ch = size[1] * scale;
  const cx = mobile.matches ? box.width * .5 - centerX * cw : (box.width - cw) / 2;
  const cy = mobile.matches ? box.height * .49 - centerY * ch : (box.height - ch) / 2;
  for (const [key, value] of Object.entries({ width: cw, height: ch, left: cx, top: cy })) app.style.setProperty(`--cabin-${key}`, `${value}px`);
  const map = ([x, y]) => [cx + x * cw, cy + y * ch];
  const mapped = corners.map(map);
  const sw = Math.max(320, Math.hypot(mapped[1][0] - mapped[0][0], mapped[1][1] - mapped[0][1]));
  const sh = Math.max(260, Math.hypot(mapped[3][0] - mapped[0][0], mapped[3][1] - mapped[0][1]));
  app.style.setProperty('--screen-width', `${sw}px`);
  app.style.setProperty('--screen-height', `${sh}px`);
  app.style.setProperty('--screen-transform', `matrix3d(${screenMatrix(sw, sh, mapped).join(',')})`);
  // Render a legible virtual display, then project it into the photographed screen.
  const displayWidth = 900;
  const displayHeight = displayWidth * Math.hypot(mapped[3][0] - mapped[0][0], mapped[3][1] - mapped[0][1]) / Math.hypot(mapped[1][0] - mapped[0][0], mapped[1][1] - mapped[0][1]);
  app.style.setProperty('--display-height', `${displayHeight}px`);
  app.style.setProperty('--display-transform', `matrix3d(${screenMatrix(displayWidth, displayHeight, mapped).join(',')})`);
  const [wx, wy] = map(wrist);
  app.style.setProperty('--wrist-x', `${wx}px`);
  app.style.setProperty('--wrist-y', `${wy}px`);
  app.style.setProperty('--focus-height', `${box.height * .92}px`);
}
updateMobileGarage();
routeFromHash({ instant: true });
mountWhoopDisplay($('#whoop-band-model'), app);

function renderAbout(target) {
 target.innerHTML=`<p class="eyebrow">THE PERSON BEHIND THE WHEEL</p><h2 id="info-title">Hi, I’m Roni.</h2><div class="about-layout"><div><p>I’m a Computer Engineering student at the University of Waterloo. I build things where software meets the real world.</p><p>From embedded systems at Ford to manufacturing test software at WHOOP and Tesla, I like understanding how things work—and making them work better.</p></div><img class="about-photo" src="images/about-me.jpg" alt="Roni by the Toronto waterfront"></div><section class="personal-goals" aria-labelledby="goals-title"><h3 id="goals-title">Personal goals</h3><ul><li><strong>Ironman</strong><span>Ambitious. Still training for a marathon.</span></li><li><strong>Sub-20-minute 5K</strong><span>Currently at 22 minutes.</span></li><li><strong>Chess title</strong><span>Rated 1750…</span></li><li><strong>Climb V8</strong><span>Have climbed several V6s.</span></li><li><strong>Bench 225</strong><span>Stuck at 185 for 3 reps.</span></li><li><strong>Dunk a basketball</strong><span>Can currently reach the rim.</span></li></ul></section><div class="info-links"><a href="https://linkedin.com/in/roni-katcharovski" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:rkatchar@uwaterloo.ca">Email me</a></div>`;

}
