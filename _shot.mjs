import { chromium } from 'playwright';
import fs from 'fs';
let execPath;
for (const p of ['/opt/pw-browsers/chromium/chrome-linux/chrome','/opt/pw-browsers/chromium-1194/chrome-linux/chrome']) { if (fs.existsSync(p)) { execPath = p; break; } }
const browser = await chromium.launch({ executablePath: execPath });
const page = await browser.newPage({ viewport: { width: 1440, height: 300 } });
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(()=>{});
await page.waitForTimeout(4200);
await page.screenshot({ path: '/tmp/claude-0/-home-user-Marble-Air/478e444c-e766-51a2-be86-f0583ad22150/scratchpad/nav.png' });
await browser.close();
