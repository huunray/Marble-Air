import { chromium } from 'playwright';
import fs from 'fs';
let execPath;
for (const p of ['/opt/pw-browsers/chromium/chrome-linux/chrome','/opt/pw-browsers/chromium-1194/chrome-linux/chrome']) { if (fs.existsSync(p)) { execPath=p; break; } }
const browser = await chromium.launch({ executablePath: execPath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors=[];
page.on('pageerror', e=>errors.push('PAGEERR: '+e.message));
page.on('console', m=>{ if(m.type()==='error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
await page.goto('http://localhost:3000/', { waitUntil:'domcontentloaded', timeout:30000 }).catch(()=>{});
await page.waitForTimeout(4500);
const vh=900;
const total = await page.evaluate(()=>document.documentElement.scrollHeight);
console.log('scrollHeight ratio:', (total/vh).toFixed(2), '(hero 300% + exp 500% + rest -> expect ~10)');

// helper: which experience headline is visible (opacity>0.5) and is exp video pinned
async function probe(yvh){
  await page.evaluate(y=>window.scrollTo(0,y), vh*yvh);
  await page.waitForTimeout(250);
  return await page.evaluate(()=>{
    const heads=[...document.querySelectorAll('h2')].filter(h=>/Acoustics|Culinary|Microclimate|Repose|Multi-Channel/.test(h.textContent||''));
    const vis=heads.map(h=>{const box=h.closest('div'); const op=parseFloat(getComputedStyle(box).opacity); return {t:(h.textContent||'').trim().slice(0,22), op:+op.toFixed(2)};}).filter(x=>x.op>0.5);
    // is any video pinned at top?
    const vids=[...document.querySelectorAll('video')];
    const pinnedTop = vids.map(v=>Math.round(v.getBoundingClientRect().top));
    // index counter
    const idx=[...document.querySelectorAll('span')].map(s=>s.textContent).find(t=>/^0[1-5]$/.test((t||'').trim()));
    return {visible:vis, videoTops:pinnedTop};
  });
}
for (const y of [5.2, 6.2, 7.2, 8.2, 9.0]) {
  const r = await probe(y);
  console.log(`@${y}vh  video tops=${JSON.stringify(r.videoTops)}  visibleHeadline=${JSON.stringify(r.visible)}`);
}
// after experience, is Who We Are reachable
await page.evaluate(y=>window.scrollTo(0,y), vh*10.5);
await page.waitForTimeout(300);
const who = await page.evaluate(()=>{const w=[...document.querySelectorAll('h2')].find(e=>/Who we are/i.test(e.textContent||'')); if(!w)return 'none'; const r=w.getBoundingClientRect(); return (r.top<window.innerHeight&&r.bottom>0)?'visible':'not@'+Math.round(r.top);});
console.log('Who We Are near end:', who);
console.log('JS errors:', errors.length?errors.join(' | '):'none');
await browser.close();
