import {test} from 'node:test';
import assert from 'node:assert/strict';
import {slideLine,moveGrid,canMove,routes,adjacent,shuffled} from '../mini-games.mjs';
test('2048 merges once per move, preserving tile value and scoring only merges',()=>{
 assert.deepEqual(slideLine([2,2,2,2]),{line:[4,4,0,0],score:8});
 assert.deepEqual(slideLine([2,0,2,4]),{line:[4,4,0,0],score:4});
 assert.deepEqual(slideLine([4,4,8,0]),{line:[8,8,0,0],score:8});
});
test('all four directions move toward the correct edge without mutating input',()=>{
 const grid=[[2,0,0,0],[2,0,0,0],[0,0,0,0],[0,0,0,0]];
 assert.deepEqual(moveGrid(grid,'up').grid[0],[4,0,0,0]);
 assert.deepEqual(moveGrid(grid,'down').grid[3],[4,0,0,0]);
 assert.equal(moveGrid(grid,'right').grid[0][3],2);
 assert.equal(moveGrid(grid,'left').changed,false);
 assert.equal(grid[0][0],2);
});
test('a full grid with no merge has no valid move',()=>assert.equal(canMove([[2,4,2,4],[4,2,4,2],[2,4,2,4],[4,2,4,2]]),false));
test('every route has a reachable destination without crossing walls or wrapping rows',()=>{
 assert.equal(adjacent(5,6,6),false);
 for(const l of routes){const seen=new Set([l.start]),queue=[l.start];while(queue.length){const p=queue.shift();for(let n=0;n<l.size*l.size;n++)if(!seen.has(n)&&!l.walls.includes(n)&&adjacent(p,n,l.size)){seen.add(n);queue.push(n)}}assert.ok(seen.has(l.goal))}
});
test('memory shuffle retains exactly the original cards',()=>{const input=['A','A','B','B'];assert.deepEqual(shuffled(input,()=>.3).sort(),input);assert.deepEqual(input,['A','A','B','B'])});
