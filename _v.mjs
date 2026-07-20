import { chromium } from 'playwright';
import fs from 'fs';
let e; for (const p of ['/opt/pw-browsers/chromium/chrome-linux/chrome','/opt/pw-browsers/chromium-1194/chrome-linux/chrome']){if(fs.existsSync(p)){e=p;break;}}
const b=await chromium.launch({executablePath:e});
const pg=await b.newPage({viewport:{width:1440,height:900}});
const errs=[]; pg.on('pageerror',x=>errs.push('PAGEERR:'+x.message));
pg.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::|CORS|Access-Control/.test(m.text()))errs.push(m.text());});
await pg.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'}).catch(()=>{});
await pg.waitForTimeout(4500);
const vh=900;
async function head(y){await pg.evaluate(v=>window.scrollTo(0,v),vh*y);await pg.waitForTimeout(220);
 return pg.evaluate(()=>{const hs=[...document.querySelectorAll('h2')].filter(h=>/Acoustics|Culinary|Microclimate|Repose|Multi-Channel/.test(h.textContent||''));const v=hs.map(h=>({t:(h.textContent||'').trim().slice(0,16),op:+parseFloat(getComputedStyle(h.closest('div')).opacity).toFixed(2)})).filter(x=>x.op>0.5);const vids=[...document.querySelectorAll('video')].map(v=>Math.round(v.getBoundingClientRect().top));return {v,vids};});}
for(const y of [4.8,5.7,6.7,7.7,8.6]){const r=await head(y);console.log(`@${y}vh videos=${JSON.stringify(r.vids)} head=${JSON.stringify(r.v)}`);}
console.log('JS errors:',errs.length?errs.join(' | '):'none');
await b.close();
