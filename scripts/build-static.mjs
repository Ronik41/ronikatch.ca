import { mkdir, copyFile, readdir, rm } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const publicExtensions = new Set(['.html','.css','.js','.mjs','.jpg','.jpeg','.png','.svg','.webp','.ico','.pdf']);
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.isFile() && publicExtensions.has(extname(entry.name))) await copyFile(resolve(root,entry.name),resolve(out,entry.name));
}
async function copyAssets(relative) {
  await mkdir(resolve(out,relative),{recursive:true});
  for(const entry of await readdir(resolve(root,relative),{withFileTypes:true})) {
    const path=`${relative}/${entry.name}`;
    if(entry.isDirectory()) await copyAssets(path);
    else if(publicExtensions.has(extname(entry.name))) {
      if(relative==='assets/scenes' && !entry.name.endsWith('-stylized.webp'))continue;
      await copyFile(resolve(root,path),resolve(out,path));
    }
  }
}
await copyAssets('assets');
console.log('Static portfolio built in dist.');
