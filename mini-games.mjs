export const gameNames={ford:'Memory Lane',cybertruck:'Charge Shift',cybercab:'Route Finder'};
export function shuffled(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export function slideLine(line){const numbers=line.filter(Boolean),result=[];let score=0;for(let i=0;i<numbers.length;i++){if(numbers[i]===numbers[i+1]){const n=numbers[i]*2;result.push(n);score+=n;i++}else result.push(numbers[i])}return {line:[...result,...Array(line.length-result.length).fill(0)],score}}
export function moveGrid(grid,direction){const next=grid.map(r=>[...r]);let score=0;for(let i=0;i<4;i++){let line=direction==='left'||direction==='right'?[...grid[i]]:grid.map(r=>r[i]);const reverse=direction==='right'||direction==='down';if(reverse)line.reverse();const merged=slideLine(line);score+=merged.score;if(reverse)merged.line.reverse();for(let j=0;j<4;j++)if(direction==='left'||direction==='right')next[i][j]=merged.line[j];else next[j][i]=merged.line[j]}return {grid:next,score,changed:JSON.stringify(next)!==JSON.stringify(grid)}}
export function canMove(grid){return ['left','right','up','down'].some(d=>moveGrid(grid,d).changed)}
export const routes=[
 {size:6,walls:[2,8,10,14,16,22,26,28,32],start:0,goal:35},
 {size:6,walls:[6,8,10,14,16,18,20,22,26,28,32],start:0,goal:35},
 {size:6,walls:[2,4,8,10,12,14,16,20,22,24,26,28],start:0,goal:35}
];
export function adjacent(a,b,size){return Math.abs(Math.floor(a/size)-Math.floor(b/size))+Math.abs(a%size-b%size)===1}
export function mountGame(root,key){
 let dispose=()=>{};root.innerHTML=`<div class="game-top"><div><span class="game-eyebrow">PARKED ARCADE</span><h3>${gameNames[key]}</h3></div><button class="game-reset">New game</button></div><p class="game-instructions"></p><div class="game-stats" role="status" aria-live="polite"></div><div class="game-board" tabindex="0" aria-label="${gameNames[key]} game board"></div><div class="game-controls"></div>`;
 const $=s=>root.querySelector(s),board=$('.game-board'),status=$('.game-stats');
 const bind=(el,event,handler)=>{el.addEventListener(event,handler);const old=dispose;dispose=()=>{el.removeEventListener(event,handler);old()}};
 if(key==='ford'){
  let cards=[],open=[],matched=new Set(),moves=0,timer=null;board.className='game-board memory-board';
  $('.game-instructions').textContent='Find six matching pairs. Two cards at a time; no timer, no rush.';
  function render(){board.innerHTML=cards.map((word,i)=>`<button class="memory-card ${matched.has(i)?'matched':open.includes(i)?'revealed':''}" data-card="${i}" aria-label="Card ${i+1}${matched.has(i)?': '+word+', matched':open.includes(i)?': '+word:': face down'}" ${matched.has(i)?'disabled':''}>${open.includes(i)||matched.has(i)?word:'· · ·'}</button>`).join('');status.textContent=matched.size===12?`All pairs found in ${moves} moves. Nicely done.`:`${matched.size/2} / 6 pairs · ${moves} ${moves===1?'move':'moves'}`}
  function reset(){clearTimeout(timer);cards=shuffled(['CAN','CPU','RAM','I/O','BUS','ECU'].flatMap(x=>[x,x]));open=[];matched=new Set();moves=0;render()}
  bind(board,'click',e=>{const button=e.target.closest('[data-card]');if(!button||open.length===2)return;const i=Number(button.dataset.card);if(open.includes(i)||matched.has(i))return;open.push(i);if(open.length===2){moves++;if(cards[open[0]]===cards[open[1]]){open.forEach(x=>matched.add(x));open=[]}else timer=setTimeout(()=>{const focused=board.contains(document.activeElement);open=[];render();if(focused)board.focus({preventScroll:true})},850)}render();const next=board.querySelector(`[data-card="${i}"]`);if(!next.disabled)next.focus({preventScroll:true});else board.focus({preventScroll:true})});bind($('.game-reset'),'click',reset);reset();const old=dispose;dispose=()=>{clearTimeout(timer);old()};
 }else if(key==='cybertruck'){
  let grid,score,moves;board.className='game-board charge-board';$('.game-instructions').textContent='Merge equal tiles to reach 2048. Use arrow keys, WASD, or the direction buttons.';
  $('.game-controls').innerHTML='<div class="direction-pad">'+[['up','↑'],['left','←'],['down','↓'],['right','→']].map(([d,l])=>`<button data-direction="${d}" aria-label="Move ${d}">${l}</button>`).join('')+'</div>';
  function spawn(){const empty=[];grid.forEach((r,y)=>r.forEach((n,x)=>{if(!n)empty.push([y,x])}));if(!empty.length)return;const [y,x]=empty[Math.floor(Math.random()*empty.length)];grid[y][x]=Math.random()<.9?2:4}
  function render(){board.innerHTML=grid.flat().map(n=>`<div class="charge-tile" data-value="${n}" aria-label="${n||'empty'}">${n||''}</div>`).join('');status.textContent=(grid.flat().some(n=>n>=2048)?'2048 reached! Keep going. ':!canMove(grid)?'No moves left. Start a new game. ':'')+`Score ${score} · ${moves} ${moves===1?'move':'moves'}`}
  function reset(){grid=Array.from({length:4},()=>Array(4).fill(0));score=0;moves=0;spawn();spawn();render()}
  function move(d){const next=moveGrid(grid,d);if(!next.changed)return;grid=next.grid;score+=next.score;moves++;spawn();render()}
  bind($('.game-controls'),'click',e=>{const b=e.target.closest('[data-direction]');if(b)move(b.dataset.direction)});
  bind(root,'keydown',e=>{const d={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'}[e.key];if(d){e.preventDefault();move(d)}});bind($('.game-reset'),'click',reset);reset();
 }else{
  let level=0,path=[];board.className='game-board route-board';$('.game-instructions').textContent='Connect PICKUP to DROP-OFF. Tap an adjacent square or use arrow keys. Tap the previous square to undo.';
  $('.game-controls').innerHTML='<button data-route-undo>Undo step</button><button data-route-next>Different route</button>';
  function render(){const l=routes[level],won=path.at(-1)===l.goal;board.innerHTML=Array.from({length:l.size*l.size},(_,i)=>`<button class="route-cell ${l.walls.includes(i)?'wall':path.includes(i)?'visited':''} ${i===path.at(-1)?'current':''}" data-cell="${i}" aria-label="Row ${Math.floor(i/l.size)+1}, column ${i%l.size+1}${i===l.start?', pickup':i===l.goal?', drop-off':l.walls.includes(i)?', blocked':path.includes(i)?', route':''}" ${l.walls.includes(i)?'disabled':''}>${i===l.start?'P':i===l.goal?'D':i===path.at(-1)?'●':path.includes(i)?'·':''}</button>`).join('');status.textContent=won?`Arrived! ${path.length-1} steps. Try another route.`:`Route ${level+1} · ${path.length-1} steps · P = pickup, D = drop-off`}
  function reset(){path=[routes[level].start];render()}
  function step(i){const l=routes[level];if(path.length>1&&i===path.at(-2)){path.pop();render();return}if(path.at(-1)===l.goal||i<0||i>=l.size*l.size||l.walls.includes(i)||path.includes(i)||!adjacent(path.at(-1),i,l.size))return;path.push(i);render()}
  bind(board,'click',e=>{const b=e.target.closest('[data-cell]');if(b){step(Number(b.dataset.cell));board.focus({preventScroll:true})}});
  bind(root,'keydown',e=>{const l=routes[level],d={ArrowUp:-l.size,ArrowDown:l.size,ArrowLeft:-1,ArrowRight:1}[e.key];if(d){e.preventDefault();step(path.at(-1)+d);board.focus({preventScroll:true})}});
  bind($('.game-controls'),'click',e=>{if(e.target.closest('[data-route-undo]')){if(path.length>1)path.pop();render()}if(e.target.closest('[data-route-next]')){level=(level+1)%routes.length;reset()}});bind($('.game-reset'),'click',reset);reset();
 }
 return ()=>dispose();
}
