import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });

const points = [900, 1450, 1950, 2550];
for (let i = 0; i < points.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), points[i]);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `output/playwright/fragmentation-step-${i + 1}.png` });
}

await browser.close();
