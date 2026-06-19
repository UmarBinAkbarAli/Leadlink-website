const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const viewport of [{name:'desktop', width:1440, height:1200}, {name:'mobile', width:390, height:844}]) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('http://127.0.0.1:8000/index.html', { waitUntil: 'networkidle' });
    const data = await page.evaluate(() => {
      const imgs = [...document.images].map(img => ({ src: img.getAttribute('src'), ok: img.complete && img.naturalWidth > 0, w: img.naturalWidth, h: img.naturalHeight }));
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const broken = imgs.filter(i => !i.ok);
      const hero = document.querySelector('h1')?.innerText;
      const navHeight = Math.round(document.querySelector('.nav')?.getBoundingClientRect().height || 0);
      const cta = document.querySelector('.cta h2')?.innerText;
      return { title: document.title, hero, cta, overflow, height: document.documentElement.scrollHeight, navHeight, imageCount: imgs.length, broken };
    });
    await page.screenshot({ path: `output/playwright/${viewport.name}.png`, fullPage: true });
    results.push({ viewport: viewport.name, data, errors });
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(err => { console.error(err); process.exit(1); });
