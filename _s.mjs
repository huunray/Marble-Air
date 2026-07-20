import { chromium } from 'playwright';
import fs from 'fs';
let e; for (const p of ['/opt/pw-browsers/chromium/chrome-linux/chrome','/opt/pw-browsers/chromium-1194/chrome-linux/chrome']){if(fs.existsSync(p)){e=p;break;}}
const b=await chromium.launch({executablePath:e});
const pg=await b.newPage({viewport:{width:1440,height:900}});
await pg.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'}).catch(()=>{});
await pg.waitForTimeout(4500);
await pg.evaluate(()=>window.scrollTo(0,900*5.7)); await pg.waitForTimeout(400);
await pg.screenshot({path:'/tmp/claude-0/-home-user-Marble-Air/478e444c-e766-51a2-be86-f0583ad22150/scratchpad/exp.png'});
await b.close();
