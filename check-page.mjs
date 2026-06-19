import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => consoleErrors.push('PAGE_ERROR: ' + err.message));

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

await page.screenshot({ path: 'C:/tmp/homepage-full.png', fullPage: true });

const teamEl = await page.$('.team');
if (teamEl) await teamEl.screenshot({ path: 'C:/tmp/team-section.png' });

const testEl = await page.$('.testimonial');
if (testEl) await testEl.screenshot({ path: 'C:/tmp/testimonial-section.png' });

const heroEl = await page.$('.hero');
if (heroEl) await heroEl.screenshot({ path: 'C:/tmp/hero-section.png' });

const teamData = await page.evaluate(() => {
  const track = document.getElementById('teamTrack');
  const tsName = document.getElementById('tsName');
  const testQuote = document.getElementById('testQuote');
  const testName = document.getElementById('testName');
  return {
    teamTrackFound: !!track,
    teamCards: track ? track.children.length : 0,
    teamTransform: track ? window.getComputedStyle(track).transform : 'N/A',
    centerCardTransform: track && track.children[1] ? window.getComputedStyle(track.children[1]).transform : 'N/A',
    tsNameText: tsName ? tsName.textContent : 'empty',
    testQuoteText: testQuote ? testQuote.textContent.slice(0, 80) : 'empty',
    testNameText: testName ? testName.textContent : 'empty',
    gsapLoaded: typeof window.gsap !== 'undefined',
  };
});
console.log('Page state:', JSON.stringify(teamData, null, 2));
console.log('Console errors:', consoleErrors.length ? consoleErrors : ['none']);

await browser.close();
