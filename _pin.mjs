import { chromium } from 'playwright';
import fs from 'fs';
let execPath;
for (const p of ['/opt/pw-browsers/chromium/chrome-linux/chrome','/opt/pw-browsers/chromium-1194/chrome-linux/chrome']) { if (fs.existsSync(p)) { execPath = p; break; } }
const browser = await chromium.launch({ executablePath: execPath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push('PAGEERR: '+e.message));
page.on('console', m => { if (m.type()==='error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(()=>{});
await page.waitForTimeout(4500); // preloader gone

const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
const vh = 900;
console.log('scrollHeight / viewport ratio:', (totalHeight/vh).toFixed(2), '(expect >4 due to 300% hero pin)');

// video top at scroll 0
const box0 = await page.evaluate(() => { const v=document.querySelector('video'); const r=v.getBoundingClientRect(); return {top: Math.round(r.top), h: Math.round(r.height)}; });
// scroll to 1.5x viewport (mid-pin) -> video should still be pinned near top
await page.evaluate((y)=>window.scrollTo(0,y), vh*1.5);
await page.waitForTimeout(300);
const boxMid = await page.evaluate(() => { const v=document.querySelector('video'); const r=v.getBoundingClientRect(); return {top: Math.round(r.top)}; });
// scroll past the pin (well beyond 3x) -> Who We Are should be in view
await page.evaluate((y)=>window.scrollTo(0,y), vh*4.2);
await page.waitForTimeout(400);
const whoVisible = await page.evaluate(() => {
  const els=[...document.querySelectorAll('h2')];
  const w=els.find(e=>/Who we are/i.test(e.textContent||''));
  if(!w) return 'no-h2';
  const r=w.getBoundingClientRect();
  return (r.top < window.innerHeight && r.bottom > 0) ? 'visible' : 'not-visible@'+Math.round(r.top);
});

console.log('video top @scroll0:', box0.top, ' (height', box0.h+')');
console.log('video top @mid-pin(1.5vh):', boxMid.top, ' -> pinned if ~0');
console.log('Who We Are @scroll 4.2vh:', whoVisible);
console.log('JS errors:', errors.length ? errors.join(' | ') : 'none');
await browser.close();
