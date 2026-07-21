import { chromium } from 'playwright';
import fs from 'fs';
let e; for (const p of ['/opt/pw-browsers/chromium/chrome-linux/chrome','/opt/pw-browsers/chromium-1194/chrome-linux/chrome']){if(fs.existsSync(p)){e=p;break;}}
const SP='/tmp/claude-0/-home-user-Marble-Air/478e444c-e766-51a2-be86-f0583ad22150/scratchpad';
const b=await chromium.launch({executablePath:e});
const pg=await b.newPage({viewport:{width:1440,height:900}});
const errs=[]; pg.on('pageerror',x=>errs.push('PAGEERR:'+x.message));
pg.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::|CORS|Access-Control|MEDIA|unsplash|cloudinary/i.test(m.text()))errs.push(m.text());});
await pg.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'}).catch(()=>{});
await pg.waitForTimeout(4500);
const info = await pg.evaluate(()=>{const h=[...document.querySelectorAll('h2')].find(x=>/The Flight Experience/.test(x.textContent||''));const wrap=h.closest('div').parentElement;const r=wrap.getBoundingClientRect();return {topAbs:r.top+window.scrollY, vh:window.innerHeight};});
const pts=[0.2,0.46,0.72]; let i=0;
for(const f of pts){await pg.evaluate(v=>window.scrollTo(0,v), info.topAbs+info.vh*6*f);await pg.waitForTimeout(500);await pg.screenshot({path:`${SP}/nc_${i}.png`});i++;}
console.log('JS errors:',errs.length?errs.join(' | '):'none');
await b.close();
