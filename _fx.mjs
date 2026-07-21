import { chromium } from 'playwright';
import fs from 'fs';
let e; for (const p of ['/opt/pw-browsers/chromium/chrome-linux/chrome','/opt/pw-browsers/chromium-1194/chrome-linux/chrome']){if(fs.existsSync(p)){e=p;break;}}
const SP='/tmp/claude-0/-home-user-Marble-Air/478e444c-e766-51a2-be86-f0583ad22150/scratchpad';
const b=await chromium.launch({executablePath:e});
const pg=await b.newPage({viewport:{width:1440,height:900}});
const errs=[]; pg.on('pageerror',x=>errs.push('PAGEERR:'+x.message));
pg.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::|CORS|Access-Control|MEDIA/.test(m.text()))errs.push(m.text());});
await pg.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'}).catch(()=>{});
await pg.waitForTimeout(4500);
const info = await pg.evaluate(()=>{const h=[...document.querySelectorAll('h2')].find(x=>/The Flight Experience/.test(x.textContent||''));const wrap=h.closest('div').parentElement;const r=wrap.getBoundingClientRect();return {topAbs:r.top+window.scrollY, vh:window.innerHeight};});
await pg.evaluate((y)=>window.scrollTo(0,y), info.topAbs+info.vh*6*0.3);
await pg.waitForTimeout(600);
const vis = await pg.evaluate(()=>{const cards=[...document.querySelectorAll('.fx-card')];const v=cards.map((c,i)=>({i,op:+parseFloat(getComputedStyle(c).opacity).toFixed(2)})).filter(x=>x.op>0.5);
  // check layering: video is behind cards
  const vid=document.querySelector('.fx-card')? true:false;
  const hasVideo=!!document.querySelector('section video, div video');
  return {v, hasVideo};});
await pg.screenshot({path:`${SP}/fxvid.png`});
console.log('visibleCards=',JSON.stringify(vis.v),'hasVideoEl=',vis.hasVideo);
console.log('JS errors:',errs.length?errs.join(' | '):'none');
await b.close();
