// Softly rounded, stylized 3D wearable. Geometry rotates, so the strap and clasp retain
// their depth through a full turn instead of flipping a flat product picture.
export function mountWhoopDisplay(canvas, app) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const button = canvas.closest('button');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const faces = [];
  const face = (points, color) => faces.push({ points, color });
  const strap = (t, x, inner = false) => [x, Math.sin(t) * (inner ? 38 : 40), Math.cos(t) * (inner ? 24.3 : 26)];
  const segments = 72;
  for (let i = 0; i < segments; i++) {
    const a = i / segments * Math.PI * 2, b = (i + 1) / segments * Math.PI * 2;
    // Fine, low-contrast textile variation, rather than large checkerboard faces.
    for (let strip = 0; strip < 8; strip++) {
      const x = -11 + strip * 2.75, next = x + 2.75;
      face([strap(a,x),strap(b,x),strap(b,next),strap(a,next)], (i + strip) % 2 ? [35,38,41] : [32,35,38]);
    }
    face([strap(a,-11,true),strap(a,11,true),strap(b,11,true),strap(b,-11,true)], [23,26,29]);
    for (const x of [-11,11]) face([strap(a,x),strap(a,x,true),strap(b,x,true),strap(b,x)], [39,42,45]);
  }
  // Rounded perimeter plus a curved bevel through the enclosure's depth.
  // This keeps the sensor's side profile slim and avoids box-shaped end caps.
  function roundedRim(left,right,bottom,top,radius,z) {
    const result=[];
    const corners=[[right-radius,top-radius,0],[left+radius,top-radius,90],[left+radius,bottom+radius,180],[right-radius,bottom+radius,270]];
    for(const [cx,cy,start] of corners) for(let i=0;i<=6;i++) {
      const a=(start+i*15)*Math.PI/180;
      result.push([cx+Math.cos(a)*radius,cy+Math.sin(a)*radius,z]);
    }
    return result;
  }
  function housing(left,right,bottom,top,back,front,radius,color,bevel=.8) {
    const rings=[];
    for(let layer=0;layer<=3;layer++) {
      const t=layer/3*Math.PI/2;
      const inset=bevel*(1-Math.cos(t));
      const z=back+(front-back)*Math.sin(t);
      rings.push(roundedRim(left+inset,right-inset,bottom+inset,top-inset,Math.max(.3,radius-inset),z));
    }
    face(rings.at(-1),color);
    face([...rings[0]].reverse(),color.map(v=>v*.7));
    for(let layer=0;layer<rings.length-1;layer++) for(let i=0;i<rings[layer].length;i++) {
      const next=(i+1)%rings[layer].length;
      face([rings[layer][i],rings[layer][next],rings[layer+1][next],rings[layer+1][i]],color);
    }
  }
  housing(-13,13,-20,27,24.5,28,8,[39,42,46],1.8);
  housing(-13,-10.3,-19,26,26.2,29,1.3,[82,87,92],1);
  housing(10.3,13,-19,26,26.2,29,1.3,[82,87,92],1);
  // Closely spaced threads over the sensor; a separate satin-black clasp below.
  function clothPoint(x,y) {
    // The fabric follows the rounded sensor, with a softly rolled top edge.
    const roll=Math.max(0,y-19);
    return [x,y,28.7-.0035*x*x-.025*roll*roll];
  }
  function clothWidth(y) {
    return y<=19 ? 10 : 5+Math.sqrt(Math.max(0,25-(y-19)**2));
  }
  for(let row=0;row<32;row++) for(let col=0;col<10;col++) {
    const y=-10+row*34/32,next=y+34/32;
    const a=clothWidth(y),b=clothWidth(next);
    const u=col/10*2-1,v=(col+1)/10*2-1;
    face([clothPoint(a*u,y),clothPoint(a*v,y),clothPoint(b*v,next),clothPoint(b*u,next)],(row+col)%2?[35,38,41]:[42,45,48]);
  }
  housing(-10,10,-20,-10,26.5,28.7,3.5,[65,70,75],1);
  const mark = [[-3.5,-13],[-2.7,-17],[0,-13],[.8,-17],[3.5,-13]];
  for(let i=0;i<mark.length-1;i++) {
    const [x,y]=mark[i], [u,v]=mark[i+1];
    face([[x-.22,y,28.8],[x+.22,y,28.8],[u+.22,v,28.8],[u-.22,v,28.8]],[137,143,148]);
  }
  let angle = -.72, last = 0, painted = 0, frame = 0, intersecting = true;
  function transform([x,y,z]) {
    const c=Math.cos(angle),s=Math.sin(angle);
    const xx=x*c+z*s, zz=-x*s+z*c;
    const tilt=-.24, lean=.18;
    const yy=y*Math.cos(lean)-zz*Math.sin(lean), depth=y*Math.sin(lean)+zz*Math.cos(lean);
    return [xx*Math.cos(tilt)-yy*Math.sin(tilt),xx*Math.sin(tilt)+yy*Math.cos(tilt),depth];
  }
  function draw() {
    const w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);
    const polygons=faces.map(f=>({ points:f.points.map(transform), color:f.color }));
    polygons.sort((a,b)=>a.points.reduce((s,p)=>s+p[2],0)/a.points.length-b.points.reduce((s,p)=>s+p[2],0)/b.points.length);
    for(const f of polygons) {
      const [a,b,c]=f.points;
      const u=b.map((n,i)=>n-a[i]),v=c.map((n,i)=>n-a[i]);
      const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      const length=Math.hypot(...n)||1;
      const light=.66+.48*Math.abs((n[0]*-.4+n[1]*.7+n[2]*.58)/length);
      const color=f.color.map((value,i)=>Math.round(Math.min(255,value*light+(i===0?5:i===1?3:2))));
      ctx.beginPath();
      f.points.forEach(([x,y,z],i)=>{
        const perspective=240/(240-z),scale=w/112;
        const px=w/2+x*scale*perspective,py=h/2-y*scale*perspective;
        if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      });
      ctx.closePath();ctx.fillStyle=`rgb(${color.join(',')})`;ctx.fill();
      ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=.45;ctx.stroke();
    }
  }
  function moving() {
    return intersecting && !document.hidden && !reduced.matches &&
      !button.matches(':hover,:focus-visible') && !app.classList.contains('traveling') &&
      app.dataset.view==='driveway' && app.dataset.screen!=='on';
  }
  function tick(time) {
    frame=0;
    if(!moving()) { last=0;return; }
    if(last) angle+=Math.min(time-last,50)*Math.PI*2/22000;
    last=time;
    if(time-painted>=1000/30){draw();painted=time;}
    frame=requestAnimationFrame(tick);
  }
  function refresh() {
    draw();
    if(moving()&&!frame){last=0;frame=requestAnimationFrame(tick);}
    else if(!moving()&&frame){cancelAnimationFrame(frame);frame=0;last=0;}
  }
  canvas.width=480;canvas.height=480;
  canvas.hidden=false;
  button.querySelector('.whoop-band-image').hidden=true;
  for(const event of ['pointerenter','pointerleave','focus','blur']) button.addEventListener(event,refresh);
  reduced.addEventListener('change',refresh);
  document.addEventListener('visibilitychange',refresh);
  new MutationObserver(refresh).observe(app,{attributes:true,attributeFilter:['class','data-view','data-screen']});
  new IntersectionObserver(entries=>{intersecting=entries[0].isIntersecting;refresh();}).observe(button);
  refresh();
}
