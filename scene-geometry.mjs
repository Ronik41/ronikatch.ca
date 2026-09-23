/** object-fit: cover coordinates shared by scene artwork and interactive overlays. */
export function coverPoint(point, viewport, image, position = [0.5, 0.5]) {
  const scale = Math.max(viewport[0] / image[0], viewport[1] / image[1]);
  return [point[0] * image[0] * scale + (viewport[0] - image[0] * scale) * position[0], point[1] * image[1] * scale + (viewport[1] - image[1] * scale) * position[1]];
}
/** Map an HTML rectangle onto four photographed screen corners, in TL/TR/BR/BL order. */
export function screenMatrix(width, height, corners) {
  const source = [[0,0], [width,0], [width,height], [0,height]];
  const a = [];
  source.forEach(([x,y],i) => {const [u,v] = corners[i]; a.push([x,y,1,0,0,0,-u*x,-u*y,u], [0,0,0,x,y,1,-v*x,-v*y,v]);});
  for(let i=0;i<8;i++) {
    let pivot=i;
    for(let k=i+1;k<8;k++) if(Math.abs(a[k][i])>Math.abs(a[pivot][i])) pivot=k;
    [a[i],a[pivot]]=[a[pivot],a[i]];
    const divisor=a[i][i];
    if(Math.abs(divisor)<1e-10) throw new Error('Degenerate screen geometry');
    for(let j=i;j<9;j++)a[i][j]/=divisor;
    for(let k=0;k<8;k++) if(k!==i){const f=a[k][i];for(let j=i;j<9;j++)a[k][j]-=f*a[i][j];}
  }
  const [a0,b,c,d,e,f,g,h]=a.map(row=>row[8]);
  return [a0,d,0,g,b,e,0,h,0,0,1,0,c,f,0,1];
}
export const sceneLayout = {
 ford: {size:[1672,941], corners:[[.510,.415],[.897,.422],[.927,.750],[.515,.754]], wrist:[.48,.75]},
 cybertruck: {size:[1672,941], corners:[[.472,.410],[.930,.410],[.941,.755],[.471,.755]], wrist:[.442,.792]},
 cybercab: {size:[1672,941], corners:[[.337,.337],[.662,.337],[.670,.542],[.330,.542]], wrist:[.685,.812]}
};
