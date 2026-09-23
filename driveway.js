import { screenMatrix, sceneLayout } from './scene-geometry.mjs';
const app = document.querySelector('#app');
const $ = (s) => document.querySelector(s);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const chapters = {
 ford: { year:'2024', company:'Ford', vehicle:'Lincoln Nautilus', role:'Manufacturing Software', dates:'May — August 2024', location:'Waterloo, ON', image:'images/ford.jpeg', caption:'An early chapter at Ford.', title:'Making reliability a habit.', description:'On Ford’s Manufacturing Software team, I worked on embedded-systems validation, unit testing, and real-time telemetry control code. A first-hand lesson in building software that needs to work beyond the screen.', skills:['C++','Google Mock','Unit testing','Hardware-in-the-loop'], work:[['Testing the hard-to-test','Reverse-engineered a large codebase and delivered over 500 unit tests across vehicle models. Used Google Mock to simulate kernel system calls, asynchronous drivers, and external dependencies.'],['Software meets hardware','Refactored real-time telemetry control code with test-driven development. Validated production software with Radmoon, ValueCAN, and debug boards.']],metrics:[['500+','unit tests delivered'],['98%','line coverage'],['100%','functional test coverage']],photos:[['images/ford.jpeg','Outside the Ford office.']] },
 cybertruck: { year:'2025',company:'Tesla',vehicle:'Cybertruck',role:'Manufacturing Test & Engineering Software',dates:'Fall 2025',location:'Sparks, Nevada',image:'images/tesla-reno.jpeg',caption:'The people behind the engineering.',title:'Engineering at factory scale.',description:'At Tesla, I worked in Manufacturing Test and Engineering Software, building software around in-house test equipment and product validation. The work connects code, hardware, and the people who bring a product to life.',skills:['Python','Go','LabVIEW','Test equipment'],work:[['Software around real systems','Manufacturing test software connects to hardware devices, coordinates validation, and makes results useful to engineering teams. My work centered on in-house test equipment and product validation.'],['Learning across disciplines','Working alongside hardware and manufacturing engineers brought a practical perspective to software: clear interfaces, reliable behavior, and tools that make sense on the factory floor.']],metrics:[],photos:[['images/tesla-reno.jpeg','With the Tesla team in Reno.'],['images/tesla-california.jpeg','A snapshot from California.']] },
 cybercab: {year:'2026',company:'Tesla',vehicle:'Cybercab',role:'The next chapter',dates:'2026',location:'A story in progress',image:'images/tesla-california.jpeg',caption:'The journey continues.',title:'The road ahead.',description:'A new year, a new chapter. This space is reserved for my 2026 Tesla experience. The detailed projects and outcomes will be added when they’re ready to share.',skills:['Curiosity','Software + hardware','What comes next'],work:[['More to come','This chapter’s engineering stories are still to be added. In the meantime, explore my 2025 Tesla work or tap the WHOOP on my wrist.']],metrics:[],photos:[]}
};
let activeChapter = null;
let activeTab = 'overview';
let entryToken = 0;
let finishEntry = null;
let previousFocus = null;
let screenTimer = 0;


const tags = (items) => `<div class="skill-list">${items.map(x=>`<span>${x}</span>`).join('')}</div>`;
const photos = (items) => `<div class="photo-grid">${items.map(([src,caption])=>`<figure><img src="${src}" alt="${caption}" loading="lazy"><figcaption>${caption}</figcaption></figure>`).join('')}</div>`;
function contentFor(c,tab) {
 if(tab==='overview')return `<div class="role-meta"><span>${c.dates}</span><span>·</span><span>${c.location}</span></div><img class="content-hero" src="${c.image}" alt="${c.caption}"><h3>${c.title}</h3><p>${c.description}</p>${tags(c.skills)}`;
 if(tab==='projects')return c.work.map(([title,body])=>`<article class="story-block"><h3>${title}</h3><p>${body}</p></article>`).join('');
 if(tab==='impact')return c.metrics.length?`<div class="metric-grid">${c.metrics.map(([value,label])=>`<div class="metric"><strong>${value}</strong><span>${label}</span></div>`).join('')}</div><p>Building confidence in embedded software through systematic tests, simulated hardware interactions, and validation on real equipment.</p>`:`<h3>Lessons beyond the code.</h3><p>${c.year==='2026'?'Projects and outcomes for this chapter will be shared here.':'Factory-scale engineering made the relationship between software quality and real-world reliability tangible. It also deepened my appreciation for close collaboration across disciplines.'}</p>`;
 return c.photos.length?photos(c.photos):'<h3>A new view, soon.</h3><p>Photos from this chapter will join the story here.</p>';
}
function setTab(tab,focus=false){
 activeTab=tab;
 document.querySelectorAll('#screen-tabs button').forEach(b=>{const selected=b.dataset.tab===tab;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1;if(selected&&focus)b.focus()});
 $('#screen-content').innerHTML=contentFor(chapters[activeChapter],tab);
 $('#screen-content').setAttribute('aria-labelledby',`screen-tab-${tab}`);
 $('#screen-content').scrollTop=0;
}
function populateCabin(key){
 const c=chapters[key];activeChapter=key;app.dataset.car=key;app.dataset.screen='off';
 $('#vehicle-label').textContent=`${c.vehicle} / ${c.year}`;
 $('#screen-brand').textContent='CO-OP JOURNAL';
 $('#screen-kicker').textContent=c.role;
 $('#screen-title').textContent=`${c.company} / ${c.year}`;
 $('#cabin-image').src=`assets/scenes/${key}-stylized.webp`;
 $('#cabin-image').alt=`Stylized first-person view inside the ${c.vehicle}, with a WHOOP on the right wrist.`;
 const tabs=key==='cybercab'?[['overview','Overview'],['projects','The story']]:[['overview','Overview'],['projects','The work'],['impact','Impact'],['photos','Photos']];
 $('#screen-tabs').innerHTML=tabs.map(([id,label])=>`<button role="tab" id="screen-tab-${id}" data-tab="${id}" aria-selected="${id==='overview'}" aria-controls="screen-content" tabindex="${id==='overview'?0:-1}">${label}</button>`).join('');
 setTab('overview');layoutScene();
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
 clearTimeout(screenTimer);app.dataset.screen='waking';$('#infotainment').hidden=false;$('#screen-wake').hidden=true;
 $('#cabin-ui').inert=true;$('.site-header').inert=true;
 // Start from the physical display before moving to its comfortable reading size.
 void $('#infotainment').offsetWidth;
 requestAnimationFrame(()=>{if(app.dataset.screen!=='waking')return;$('#infotainment').classList.add('focused');app.dataset.screen='on';$('#screen-title').focus({preventScroll:true})});
}
function closeScreen(animate=true){
 clearTimeout(screenTimer);const wasOn=app.dataset.screen!=='off';app.dataset.screen='off';$('#infotainment').classList.remove('focused');$('#cabin-ui').inert=false;$('.site-header').inert=false;$('#screen-wake').hidden=false;
 if(animate&&wasOn&&!reducedMotion.matches)screenTimer=setTimeout(()=>{$('#infotainment').hidden=true},500);else $('#infotainment').hidden=true;
 if(animate&&wasOn)$('#screen-wake').focus({preventScroll:true});
}
function routeFromHash(){const key=location.hash.slice(1);if(chapters[key]){if(key!==activeChapter)enterCar(key,{route:false,instant:true})}else if(key==='whoop'){if(!activeChapter)enterCar('ford',{route:false,instant:true}).then(ok=>{if(ok)openPhone()});else openPhone()}else if(activeChapter||finishEntry)exitCar({route:false})}

function phoneContent(tab){
 if(tab==='overview')return `<div class="recovery-ring"><strong>2025</strong><span>THE WHOOP CHAPTER</span></div><p class="phone-section-label">A TERM WITH REAL IMPACT</p><div class="phone-metrics"><div class="phone-metric"><strong>$100k+</strong><span>Manufacturing cost reduction</span></div><div class="phone-metric"><strong>80%</strong><span>Cycle time improvement</span></div></div><button class="phone-card" data-phone-go="work"><img src="images/whoop HQ.jpg" alt="" loading="lazy"><span><strong>Small device. Big systems.</strong><small>Explore the engineering</small></span></button><button class="phone-card" data-phone-go="photos"><img src="images/whoop ceo.jpg" alt="" loading="lazy"><span><strong>The people behind it.</strong><small>A few moments from Boston</small></span></button><p class="phone-copy">Test software, firmware, and the details that make a product ready for the real world.</p>`;
 if(tab==='work')return `<p class="phone-section-label">MANUFACTURING TEST SOFTWARE</p><article class="phone-story"><h3>A better test fixture.</h3><p>Migrated test-fixture hardware and redesigned its software, reducing costs by $2,000 per fixture across 50 units. Improved cycle time by 80% and yield by 2%.</p></article><article class="phone-story"><h3>Making every cycle count.</h3><p>Rewrote a UART parsing algorithm from O(n) to O(1), achieving a 2,000× serial communication speed increase. Used DMA with idle-line interrupts for real-time sensor collection.</p></article><article class="phone-story"><h3>Test the test system.</h3><p>Developed a virtual test environment with hardware simulation. Automated device-interaction logging and SQLite storage to accelerate firmware testing.</p></article><article class="phone-story"><h3>A term to remember.</h3><p>Earned a Co-op Student of the Year Award nomination.</p></article><p class="phone-copy">C / C++ · UART · DMA · SQLite · Hardware simulation</p>`;
 return `<div class="phone-photos"><figure><img src="images/whoop ceo.jpg" alt="Roni with WHOOP CEO Will Ahmed" loading="lazy"><figcaption>With Will Ahmed, CEO of WHOOP.</figcaption></figure><figure><img src="images/whoop HQ.jpg" alt="WHOOP headquarters in Boston" loading="lazy"><figcaption>Boston. A new team, a new perspective.</figcaption></figure></div>`;
}
function setPhoneTab(tab,focus=false){document.querySelectorAll('[data-phone-tab]').forEach(b=>{const selected=b.dataset.phoneTab===tab;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1;if(selected&&focus)b.focus()});$('#phone-content').innerHTML=phoneContent(tab);$('#phone-content').setAttribute('aria-labelledby',`phone-tab-${tab}`);$('.phone-body').scrollTop=0}
function openPhone(){setPhoneTab('overview');if(!$('#phone-dialog').open)$('#phone-dialog').showModal()}

function openInfo(type){
 const target=$('#info-content');
 if(type==='about')target.innerHTML=`<p class="eyebrow">THE PERSON BEHIND THE WHEEL</p><h2 id="info-title">Hi, I’m Roni.</h2><div class="about-layout"><div><p>I’m a Computer Engineering student at the University of Waterloo. I build things where software meets the real world.</p><p>From embedded systems at Ford to manufacturing test software at WHOOP and Tesla, I like understanding how things work—and making them work better.</p><p>Outside the co-op chapters, projects are where I follow an interesting question and see where it goes.</p></div><img class="about-photo" src="images/about-me.jpg" alt="Roni by the Toronto waterfront"></div><div class="info-links"><a href="https://linkedin.com/in/roni-katcharovski" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:roni.katch@gmail.com">Email me</a><a href="projects.html">Projects</a></div>`;
 else if(type==='experience')target.innerHTML=`<p class="eyebrow">A FEW STOPS ALONG THE WAY</p><h2 id="info-title">The journey so far.</h2>${[['ford','2024','Ford','Manufacturing Software'],['whoop','2025','WHOOP','Manufacturing Test Software'],['cybertruck','2025','Tesla','Manufacturing Test & Engineering Software'],['cybercab','2026','Tesla','The next chapter']].map(([key,year,name,role])=>`<button class="experience-row" data-experience="${key}"><span>${year}</span><span><strong>${name}</strong><small>${role}</small></span><span>↗</span></button>`).join('')}<div class="info-links"><a href="electrium-server.html">Electrium Mobility</a><a href="exceed-server.html">Exceed Robotics</a><a href="projects.html">Projects</a></div>`;
 else target.innerHTML=`<p class="eyebrow">EXPERIENCE AT A GLANCE</p><h2 id="info-title">Roni Katcharovski</h2><p>Computer Engineering · University of Waterloo · 2023–present<br><a href="mailto:roni.katch@gmail.com">roni.katch@gmail.com</a> · <a href="https://linkedin.com/in/roni-katcharovski" target="_blank" rel="noreferrer">LinkedIn</a></p><div class="info-links"><button id="print-resume">Print / Save as PDF</button></div><section class="resume-section"><div class="resume-heading"><h3>Tesla</h3><p>Fall 2025 · Sparks, Nevada</p></div><p>Manufacturing Test & Engineering Software</p><ul><li>Software around in-house test equipment and product validation.</li><li>Engineering at the intersection of manufacturing, software, and hardware.</li></ul></section><section class="resume-section"><div class="resume-heading"><h3>WHOOP</h3><p>January–May 2025 · Boston, MA</p></div><p>Manufacturing Test Software</p><ul><li>Reduced manufacturing costs by $100,000+ through test-fixture hardware migration and system optimization.</li><li>Improved cycle time by 80% and yield by 2%.</li><li>Rewrote UART parsing from O(n) to O(1); developed hardware simulation and automated logging.</li></ul></section><section class="resume-section"><div class="resume-heading"><h3>Ford Motor Company</h3><p>May–August 2024 · Waterloo, ON</p></div><p>Manufacturing Software</p><ul><li>Delivered 500+ unit tests and achieved 98% line coverage for embedded-systems validation.</li><li>Simulated complex hardware interactions with Google Mock.</li><li>Refactored real-time telemetry code and performed hardware-in-the-loop testing.</li></ul></section><section class="resume-section"><h3>Tools & skills</h3><p>C / C++ · Python · Embedded systems · STM32 · UART / SPI / I2C · Hardware testing · SQLite</p></section>`;
 target.insertAdjacentHTML('beforeend','<p class="brand-note">Personal portfolio. Company and product names identify my experience; this site is not endorsed by Ford, Lincoln, Tesla, or WHOOP.</p>');
 $('#info-dialog').showModal();
}
document.addEventListener('click',e=>{
 const enter=e.target.closest('[data-enter]');if(enter)enterCar(enter.dataset.enter);
 const info=e.target.closest('[data-open]');if(info)openInfo(info.dataset.open);
 const tab=e.target.closest('[data-tab]');if(tab)setTab(tab.dataset.tab);
 const phoneTab=e.target.closest('[data-phone-tab]');if(phoneTab)setPhoneTab(phoneTab.dataset.phoneTab);
 const phoneGo=e.target.closest('[data-phone-go]');if(phoneGo)setPhoneTab(phoneGo.dataset.phoneGo,true);
 const exp=e.target.closest('[data-experience]');if(exp){$('#info-dialog').close();if(exp.dataset.experience==='whoop'){if(activeChapter)openPhone();else enterCar('ford').then(ok=>{if(ok)openPhone()})}else enterCar(exp.dataset.experience)}
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
  const controls=[...$('#infotainment').querySelectorAll('button:not([tabindex="-1"]),a,[tabindex="0"]')];
  const first=controls[0],last=controls.at(-1);
  if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('#screen-title'))){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
 const tab=e.target.closest('[role=tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...tab.parentElement.querySelectorAll('[role=tab]')];const i=tabs.indexOf(tab);const next=tabs[e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];if(next.dataset.tab)setTab(next.dataset.tab,true);else setPhoneTab(next.dataset.phoneTab,true);
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
