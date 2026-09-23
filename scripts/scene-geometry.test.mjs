import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coverPoint, screenMatrix, sceneLayout } from '../scene-geometry.mjs';
function map(m,x,y){const w=m[3]*x+m[7]*y+1;return [(m[0]*x+m[4]*y+m[12])/w,(m[1]*x+m[5]*y+m[13])/w]}
test('screen projection attaches all four corners at desktop, tablet, and phone sizes',()=>{
 for(const [key,scene] of Object.entries(sceneLayout))for(const viewport of [[1440,900],[1024,768],[390,844]]){
  const corners=scene.corners.map(p=>coverPoint(p,viewport,scene.size));
  const m=screenMatrix(600,400,corners);
  [[0,0],[600,0],[600,400],[0,400]].forEach(([x,y],i)=>{const actual=map(m,x,y);for(let axis=0;axis<2;axis++)assert.ok(Math.abs(actual[axis]-corners[i][axis])<1e-6,`${key} corner ${i}`)});
 }
});
test('cover mapping centers the image while retaining aspect ratio',()=>{
 assert.deepEqual(coverPoint([.5,.5],[400,800],[1600,900]),[200,400]);
 const left=coverPoint([0,.5],[400,800],[1600,900]);assert.ok(left[0]<0);
});
test('degenerate screen coordinates fail explicitly',()=>assert.throws(()=>screenMatrix(0,0,[[0,0],[0,0],[0,0],[0,0]]),/Degenerate/));
