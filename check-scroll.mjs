import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => consoleErrors.push('PAGE_ERROR: ' + err.message));

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Screenshot hero before scroll
await page.screenshot({ path: 'C:/tmp/s1-hero.png' });

// Scroll to fragmentation section
await page.evaluate(() => {
  const el = document.querySelector('.fragmentation-section');
  if (el) el.scrollIntoView({ behavior: 'instant' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/tmp/s2-fragmentation.png' });

// Scroll to divisions section
await page.evaluate(() => {
  const el = document.querySelector('.division');
  if (el) el.scrollIntoView({ behavior: 'instant' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/tmp/s3-divisions.png' });

// Scroll to metrics
await page.evaluate(() => {
  const el = document.querySelector('.metric-grid');
  if (el) el.scrollIntoView({ behavior: 'instant' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/tmp/s4-metrics.png' });

// Scroll to team slider
await page.evaluate(() => {
  const el = document.querySelector('.team');
  if (el) el.scrollIntoView({ behavior: 'instant' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/tmp/s5-team.png' });

// Scroll to testimonial
await page.evaluate(() => {
  const el = document.querySelector('.testimonial');
  if (el) el.scrollIntoView({ behavior: 'instant' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'C:/tmp/s6-testimonial.png' });

// Check visibility of key elements
const vis = await page.evaluate(() => {
  function isVisible(el) {
    if (!el) return 'element not found';
    const s = window.getComputedStyle(el);
    return { opacity: s.opacity, visibility: s.visibility, display: s.display };
  }
  return {
    heroCopy: isVisible(document.querySelector('.hero-copy')),
    heroH1: isVisible(document.querySelector('.hero h1')),
    fragHeading: isVisible(document.querySelector('.fragmentation-heading')),
    fragWords: document.querySelectorAll('.fragmentation-heading .word').length,
    metrics: Array.from(document.querySelectorAll('.metric')).map(m => ({opacity: window.getComputedStyle(m).opacity})).slice(0,3),
    compareCards: Array.from(document.querySelectorAll('.compare-card')).map(c => ({opacity: window.getComputedStyle(c).opacity})).slice(0,2),
    gsapLoaded: typeof window.gsap !== 'undefined',
    scrollTriggerLoaded: typeof window.ScrollTrigger !== 'undefined',
  };
});
console.log('Visibility check:', JSON.stringify(vis, null, 2));
console.log('Errors:', JSON.stringify(consoleErrors));

await browser.close();
