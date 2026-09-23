import { chapters, whoop, drivewayExperiences, experienceOrder } from './experience.mjs';
import { mountGame, gameNames } from './mini-games.mjs';
import { screenMatrix, sceneLayout } from './scene-geometry.mjs';
const app = document.querySelector('#app');
const $ = (s) => document.querySelector(s);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let activeChapter = null;
let activePage = 'home';
let disposeGame = ()=>{};
let entryToken = 0;
let finishEntry = null;
let previousFocus = null;
let screenTimer = 0;


const photoButton=(src,caption,hero=false)=>`<button class="photo-open ${hero?'hero-photo':''}" data-photo="${src}" data-caption="${caption}" aria-label="View full photo: ${caption}"><img src="${src}" alt="${caption}" loading="lazy"><span>View full photo</span></button>`;
const photos = (items) => `<div class="photo-grid">${items.map(([src,caption])=>`<figure>${photoButton(src,caption)}<figcaption>${caption}</figcaption></figure>`).join('')}</div>`;
const appIcon=(name)=>{
 const shapes={game:'<rect x="3" y="7" width="22" height="16" rx="6"/><path d="M7 14h6m-3-3v6m8-3h.1m3 3h.1"/>',overview:'<rect x="5" y="4" width="18" height="20" rx="3"/><path d="M10 10h8M10 14h8M10 18h5"/>',projects:'<path d="m9 8-6 6 6 6m10-12 6 6-6 6m-3-15-4 18"/>',impact:'<path d="M5 23V14m9 9V5m9 18V10"/>',photos:'<rect x="3" y="4" width="22" height="20" rx="4"/><circle cx="10" cy="10" r="2"/><path d="m4 21 6-6 5 4 5-8 5 6"/>',whoop:'<path d="m3 7 5 15 6-12 6 12 5-15"/>',contact:'<rect x="3" y="6" width="22" height="17" rx="3"/><path d="m4 8 10 8 10-8"/>',home:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="17" y="4" width="7" height="7" rx="2"/><rect x="4" y="17" width="7" height="7" rx="2"/><rect x="17" y="17" width="7" height="7" rx="2"/>'};
 return `<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name]||shapes.overview}</svg>`;
};
function launcher(c){return `<div class="launcher-heading"><p>${c.vehicle} · ${c.year}</p><h3>Make yourself at home.</h3></div><div class="app-grid">${[['overview','Overview'],['contact','Contact'],['game',gameNames[activeChapter]]].map(([key,label])=>`<button class="launch-app" data-launch="${key}"><span class="app-icon icon-${key}">${appIcon(key)}</span><span>${label}</span></button>`).join('')}</div><p class="launcher-caption">${c.dates} · ${c.location}</p>`}
function contentFor(c,page){
 if(page==='home')return launcher(c);
 if(page==='contact')return `<div class="contact-app"><span class="contact-avatar">RK</span><h3>Roni Katcharovski</h3><p>Computer Engineering · University of Waterloo<br>Expected graduation: April 2028</p><div class="contact-actions"><a href="mailto:rkatchar@uwaterloo.ca">Email Roni<span>rkatchar@uwaterloo.ca</span></a><a href="https://linkedin.com/in/roni-katcharovski" target="_blank" rel="noreferrer">LinkedIn<span>Let’s connect</span></a><a href="https://github.com/Ronik41" target="_blank" rel="noreferrer">GitHub<span>Explore my code</span></a><a href="assets/resume/Roni_Katcharovski_Resume_Software_2027.pdf" target="_blank" rel="noreferrer">Résumé<span>Software · 2027</span></a></div></div>`;
 if(page==='game')return '<div id="mini-game" class="mini-game"></div>';
 return `<div class="role-meta"><span>${c.dates}</span><span>·</span><span>${c.location}</span></div>${photoButton(c.image,c.caption,true)}<h3>${c.title}</h3><p>${c.description}</p><div class="overview-stories">${c.metrics.length?`<div class="metric-grid">${c.metrics.map(([value,label])=>`<div class="metric"><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>`:''}${c.work.map(([title,body])=>`<article class="story-block"><h3>${title}</h3><p>${body}</p></article>`).join('')}</div>`;
}
function setPage(page,focus=false){
 if(!['home','overview','contact','game'].includes(page))return;
 disposeGame();disposeGame=()=>{};activePage=page;$('#infotainment').dataset.page=page;
 $('#screen-content').innerHTML=contentFor(chapters[activeChapter],page);$('#screen-content').scrollTop=0;
 $('#screen-app-name').textContent=page==='home'?'Apps':page==='game'?gameNames[activeChapter]:page==='contact'?'Contact':'Overview';
 if(page==='game')disposeGame=mountGame($('#mini-game'),activeChapter);
 if(focus)(page==='game'?$('#mini-game .game-board'):$('#screen-content')).focus({preventScroll:true});
}
function populateCabin(key){
 const c=chapters[key];activeChapter=key;app.dataset.car=key;app.dataset.screen='off';
 $('#vehicle-label').textContent=`${c.vehicle} / ${c.year}`;
 $('#screen-brand').textContent=key==='ford'?'RONI’S PORTFOLIO · CONNECTED':'PARKED · RONI’S PORTFOLIO';
 $('#infotainment').dataset.system=key==='ford'?'carplay':'tesla';
 $('#vehicle-panel').innerHTML=key==='ford'?`<span class="dock-clock clock"></span><button data-screen-home aria-label="Back to apps">${appIcon('home')}</button><span class="connected-label">CONNECTED</span>`:`<div class="park-status"><strong>P</strong><span>PORTFOLIO MODE</span></div><div class="vehicle-identity"><span>${c.vehicle}</span><strong>${c.year}</strong><p>${c.company}</p></div><div class="destination-card"><span>THIS CHAPTER</span><strong>${c.location}</strong><p>${c.dates}</p></div>`;
 updateClock();
 $('#screen-kicker').textContent=c.role;
 $('#screen-title').textContent=`${c.company} / ${c.year}`;
 $('#cabin-image').src=`assets/scenes/${key}-stylized.webp`;
 $('#cabin-image').alt=`Stylized first-person view inside the ${c.vehicle}, with a WHOOP on the right wrist.`;
 setPage('home');layoutScene();
 $('#infotainment').hidden=true;$('#infotainment').classList.remove('focused');
 $('#screen-wake').hidden=false;$('#screen-wake').setAttribute('aria-label',`Turn on ${c.company} ${c.year} infotainment`);
}
function updateHash(key){const target=key?`#${key}`:location.pathname+location.search;if(key?location.hash!==target:!!location.hash)history.pushState({},'',target)}
async function enterCar(key,{route=true,instant=false}={}){
 if(!chapters[key])return false;
 const token=++entryToken;if(document.activeElement?.matches('[data-enter]'))previousFocus=document.activeElement;
 if(route)updateHash(key);
 const image=new Image();image.src=`assets/scenes/${key}-stylized.webp`;
 const ready=image.decode().catch(()=>{});
 $('#info-dialog').close();$('#phone-dialog').close();closeScreen(false);
 document.querySelectorAll('[data-enter]').forEach(b=>b.disabled=true);
 $('#exit-car').disabled=true;$('#next-car').disabled=true;
 const c=chapters[key];app.style.setProperty('--entry-x',key==='ford'?'20%':key==='cybertruck'?'50%':'80%');
 $('#transition-label').textContent=`${c.vehicle} / ${c.year}`;
 let finished=false;
 const finish=()=>{if(token!==entryToken||finished)return false;finished=true;finishEntry=null;populateCabin(key);app.dataset.view='cabin';$('#cabin-ui').hidden=false;$('#driveway-bottom').inert=true;$('#car-hotspots').inert=true;app.classList.remove('entering');$('#transition').classList.remove('visible');$('#skip-animation').tabIndex=-1;$('#exit-car').disabled=false;$('#next-car').disabled=false;document.querySelectorAll('[data-enter]').forEach(b=>b.disabled=false);$('#screen-wake').focus({preventScroll:true});$('#announcer').textContent=`Inside the ${c.vehicle}. The screen is off. Activate it to explore ${c.company} ${c.year}.`;return true;};
 finishEntry=finish;
 if(instant||reducedMotion.matches){await ready;return finish()}
 app.classList.add('entering');
 await new Promise(r=>setTimeout(r,400));if(token!==entryToken||finished)return finished;
 $('#transition').classList.add('visible');$('#skip-animation').tabIndex=0;
 await Promise.all([ready,new Promise(r=>setTimeout(r,650))]);if(token!==entryToken||finished)return finished;
 return finish();
}
function exitCar({route=true}={}){
 entryToken++;finishEntry=null;closeScreen(false);activeChapter=null;app.dataset.view='driveway';app.classList.remove('entering');$('#transition').classList.remove('visible');$('#skip-animation').tabIndex=-1;$('#cabin-ui').hidden=true;$('#driveway-bottom').inert=false;$('#car-hotspots').inert=false;$('#phone-dialog').close();document.querySelectorAll('[data-enter]').forEach(b=>b.disabled=false);if(route)updateHash(null);if(previousFocus?.isConnected&&previousFocus.matches('[data-enter]'))previousFocus.focus({preventScroll:true});else $('.vehicle-region').focus({preventScroll:true});$('#announcer').textContent='Back in the driveway.';
}
function wakeScreen(){
 if(!activeChapter||app.dataset.screen!=='off')return;
 if(activePage==='game')setPage('game');
 clearTimeout(screenTimer);app.dataset.screen='waking';$('#infotainment').hidden=false;$('#screen-wake').hidden=true;
 $('#cabin-ui').inert=true;$('.site-header').inert=true;
 // Start from the physical display before moving to its comfortable reading size.
 void $('#infotainment').offsetWidth;
 requestAnimationFrame(()=>{if(app.dataset.screen!=='waking')return;$('#infotainment').classList.add('focused');app.dataset.screen='on';$('#announcer').textContent=chapters[activeChapter].company+' portfolio screen open.';$('#screen-title').focus({preventScroll:true})});
}
function closeScreen(animate=true){
 disposeGame();disposeGame=()=>{};
 clearTimeout(screenTimer);const wasOn=app.dataset.screen!=='off';app.dataset.screen='off';$('#infotainment').classList.remove('focused');$('#cabin-ui').inert=false;$('.site-header').inert=false;$('#screen-wake').hidden=false;
 if(animate&&wasOn&&!reducedMotion.matches)screenTimer=setTimeout(()=>{$('#infotainment').hidden=true},500);else $('#infotainment').hidden=true;
 if(animate&&wasOn)$('#screen-wake').focus({preventScroll:true});
}
function routeFromHash(){const key=location.hash.slice(1);if(chapters[key]){if(key!==activeChapter)enterCar(key,{route:false,instant:true})}else if(key==='whoop'){if(!activeChapter)enterCar('ford',{route:false,instant:true}).then(ok=>{if(ok)openPhone()});else openPhone()}else if(activeChapter||finishEntry)exitCar({route:false})}

function openPhone(){
 $('#phone-content').innerHTML=`<div class="recovery-ring"><strong>2025</strong><span>THE WHOOP CHAPTER</span></div><div class="phone-metrics"><div class="phone-metric"><strong>$100K+</strong><span>Build costs saved per product line</span></div><div class="phone-metric"><strong>HIL / SIL</strong><span>Hardware & software in the loop</span></div></div>${whoop.work.map(([title,body])=>`<article class="phone-story"><h3>${title}</h3><p>${body}</p></article>`).join('')}<div class="phone-photos"><figure>${photoButton('images/whoop ceo.jpg','With WHOOP CEO Will Ahmed.')}<figcaption>With Will Ahmed in Boston.</figcaption></figure><figure>${photoButton('images/whoop HQ.jpg','WHOOP headquarters in Boston.')}</figure></div>`;
 $('.phone-body').scrollTop=0;if(!$('#phone-dialog').open)$('#phone-dialog').showModal();
}

function openInfo(type){
 const target=$('#info-content');
 if(type==='about')target.innerHTML=`<p class="eyebrow">THE PERSON BEHIND THE WHEEL</p><h2 id="info-title">Hi, I’m Roni.</h2><div class="about-layout"><div><p>I’m a Computer Engineering student at the University of Waterloo. I build things where software meets the real world.</p><p>From embedded systems at Ford to manufacturing test software at WHOOP and Tesla, I like understanding how things work—and making them work better.</p></div><img class="about-photo" src="images/about-me.jpg" alt="Roni by the Toronto waterfront"></div><section class="personal-goals" aria-labelledby="goals-title"><h3 id="goals-title">Personal goals</h3><ul><li><strong>Ironman</strong><span>Ambitious. Still training for a marathon.</span></li><li><strong>Sub-20-minute 5K</strong><span>Currently at 22 minutes.</span></li><li><strong>Chess title</strong><span>Rated 1750…</span></li><li><strong>Climb V8</strong><span>Have climbed several V6s.</span></li><li><strong>Bench 225</strong><span>Stuck at 185 for 3 reps.</span></li><li><strong>Dunk a basketball</strong><span>Can currently reach the rim.</span></li></ul></section><div class="info-links"><a href="https://linkedin.com/in/roni-katcharovski" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:rkatchar@uwaterloo.ca">Email me</a></div>`;
 else if(drivewayExperiences[type]){const c=drivewayExperiences[type];target.innerHTML=`<button class="back-experiences" data-open="experience">All experience</button><p class="eyebrow">${c.company}</p><h2 id="info-title">${c.title}</h2><p class="experience-role">${c.role}<br>${c.dates} · ${c.location}</p><div class="early-experience-layout"><div><p>${c.description}</p>${c.work.map(([title,body])=>`<article class="early-story"><h3>${title}</h3><p>${body}</p></article>`).join('')}</div><figure>${photoButton(c.image,c.caption)}<figcaption>${c.caption}</figcaption></figure></div>`;}
 else if(type==='experience')target.innerHTML=`<p class="eyebrow">A FEW STOPS ALONG THE WAY</p><h2 id="info-title">The journey so far.</h2>${experienceOrder.map(([key,year,name,role,dates])=>`<button class="experience-row" data-experience="${key}"><span>${year}</span><span><strong>${name}</strong><small>${role}</small><small>${dates}</small></span><span aria-hidden="true">↗</span></button>`).join('')}`;
 else target.innerHTML=`<p class="eyebrow">UPDATED RÉSUMÉ</p><h2 id="info-title">Roni Katcharovski</h2><p>Software engineering experience at Tesla, WHOOP, and Ford. Computer Engineering at the University of Waterloo, graduating April 2028.</p><div class="info-links"><a href="assets/resume/Roni_Katcharovski_Resume_Software_2027.pdf" target="_blank" rel="noreferrer">Open résumé PDF</a><a href="assets/resume/Roni_Katcharovski_Resume_Software_2027.pdf" download>Download PDF</a></div>`;
 target.insertAdjacentHTML('beforeend','<p class="brand-note">Personal portfolio. Company and product names identify my experience; this site is not endorsed by Ford, Lincoln, Tesla, or WHOOP.</p>');
 if(!$('#info-dialog').open)$('#info-dialog').showModal();$('#info-dialog').scrollTop=0;$('#info-title').tabIndex=-1;$('#info-title').focus({preventScroll:true});
}
document.addEventListener('click',e=>{
 const photo=e.target.closest('[data-photo]');if(photo){$('#full-photo').src=photo.dataset.photo;$('#full-photo').alt=photo.dataset.caption;$('#photo-caption').textContent=photo.dataset.caption;$('#photo-dialog').showModal()}
 const launch=e.target.closest('[data-launch]');if(launch)setPage(launch.dataset.launch,true);
 if(e.target.closest('[data-screen-home]'))setPage('home',true);
 const enter=e.target.closest('[data-enter]');if(enter)enterCar(enter.dataset.enter);
 const info=e.target.closest('[data-open]');if(info)openInfo(info.dataset.open);
 const exp=e.target.closest('[data-experience]');if(exp){$('#info-dialog').close();if(drivewayExperiences[exp.dataset.experience])openInfo(exp.dataset.experience);else if(exp.dataset.experience==='whoop'){if(activeChapter)openPhone();else enterCar('ford').then(ok=>{if(ok)openPhone()})}else enterCar(exp.dataset.experience)}
 if(e.target.closest('#print-resume'))window.print();
});
$('#exit-car').addEventListener('click',()=>exitCar());
$('#next-car').addEventListener('click',()=>{const ids=Object.keys(chapters);enterCar(ids[(ids.indexOf(activeChapter)+1)%ids.length])});
$('.identity').addEventListener('click',e=>{e.preventDefault();exitCar()});
$('#whoop-hotspot').addEventListener('click',openPhone);
$('#skip-animation').addEventListener('click',()=>finishEntry?.());
$('#screen-wake').addEventListener('click',wakeScreen);
$('#screen-back').addEventListener('click',()=>closeScreen());
for(const dialog of document.querySelectorAll('dialog')){dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()})}
$('.phone-home').addEventListener('click',()=>$('#phone-dialog').close());
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&!document.querySelector('dialog[open]')){if(app.dataset.screen!=='off'){e.preventDefault();closeScreen()}else if(activeChapter||finishEntry)exitCar()}
 if(e.key==='Tab'&&app.dataset.screen==='on'&&!document.querySelector('dialog[open]')){
  const controls=[...$('#infotainment').querySelectorAll('button:not([disabled]):not([tabindex="-1"]),a,[tabindex="0"]')].filter(el=>el.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('#screen-title'))){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }

});
let frame=0;app.addEventListener('pointermove',e=>{if(reducedMotion.matches||activeChapter||matchMedia('(pointer: coarse)').matches)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{app.style.setProperty('--px',`${(e.clientX/innerWidth-.5)*-8}px`);app.style.setProperty('--py',`${(e.clientY/innerHeight-.5)*-5}px`)})});
app.addEventListener('pointerleave',()=>{app.style.setProperty('--px','0px');app.style.setProperty('--py','0px')});
$('#driveway-image').addEventListener('error',()=>app.classList.add('scene-load-failed'));
window.addEventListener('popstate',routeFromHash);
window.addEventListener('hashchange',()=>{const key=location.hash.slice(1);if(key!==activeChapter)routeFromHash()});
new ResizeObserver(layoutScene).observe(app);
$('#driveway-image').addEventListener('load',layoutScene);
$('#cabin-image').addEventListener('load',layoutScene);
function updateClock(){const time=new Date().toLocaleTimeString('en-CA',{hour:'numeric',minute:'2-digit',hour12:false});document.querySelectorAll('.clock').forEach(el=>el.textContent=time)}updateClock();setInterval(updateClock,60000);
routeFromHash();
// Only the initial scene is urgent. Warm the first cabin after the page has loaded.
window.addEventListener('load',()=>{const preload=()=>{const im=new Image();im.src='assets/scenes/ford-stylized.webp'};if('requestIdleCallback'in window)requestIdleCallback(preload);else setTimeout(preload,800)});

function layoutScene(){
 const box=app.getBoundingClientRect();
 const image=$('#driveway-image');const aspect=(image.naturalWidth||1672)/(image.naturalHeight||941);
 const mobile=box.width<=700;
 const width=mobile?box.width:Math.max(box.width,box.height*aspect),height=width/aspect;
 const world=$('#world');world.style.width=width+'px';world.style.height=height+'px';world.style.left=(box.width-width)/2+'px';world.style.top=(mobile?box.height*.30:(box.height-height)/2)+'px';
 if(!activeChapter)return;
 const {size,corners,wrist}=sceneLayout[activeChapter];
 // Mobile fits the complete cabin above the bottom controls instead of cropping its screen away.
 const cabinScale=mobile?box.width/size[0]:Math.max(box.width/size[0],box.height/size[1]);
 const cw=size[0]*cabinScale,ch=size[1]*cabinScale,cx=(box.width-cw)/2,cy=mobile?box.height*.30:(box.height-ch)/2;
 app.style.setProperty('--cabin-width',cw+'px');app.style.setProperty('--cabin-height',ch+'px');app.style.setProperty('--cabin-left',cx+'px');app.style.setProperty('--cabin-top',cy+'px');
 const map=([x,y])=>[cx+x*cw,cy+y*ch];const mapped=corners.map(map);
 const sw=Math.max(320,Math.hypot(mapped[1][0]-mapped[0][0],mapped[1][1]-mapped[0][1]));
 const sh=Math.max(260,Math.hypot(mapped[3][0]-mapped[0][0],mapped[3][1]-mapped[0][1]));
 app.style.setProperty('--screen-width',sw+'px');app.style.setProperty('--screen-height',sh+'px');
 app.style.setProperty('--screen-transform',`matrix3d(${screenMatrix(sw,sh,mapped).join(',')})`);
 const [wx,wy]=map(wrist);app.style.setProperty('--wrist-x',wx+'px');app.style.setProperty('--wrist-y',wy+'px');
 const focusWidth=box.width*(mobile?.94:.88),focusHeight=box.height*(mobile?.86:.84),fx=(box.width-focusWidth)/2,fy=(box.height-focusHeight)/2;
 app.style.setProperty('--focus-left',fx+'px');app.style.setProperty('--focus-top',fy+'px');
 app.style.setProperty('--focus-width',focusWidth+'px');app.style.setProperty('--focus-height',focusHeight+'px');
 const center=[(mapped[0][0]+mapped[2][0])/2,(mapped[0][1]+mapped[2][1])/2];
 app.style.setProperty('--camera-origin',`${center[0]}px ${center[1]}px`);
}
layoutScene();
