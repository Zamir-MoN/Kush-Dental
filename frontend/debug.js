import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  
  await page.goto('http://localhost:3000/staff/login');
  await page.type('input[name="email"]', 'doctor@kushdental.com');
  await page.type('input[name="password"]', 'doctor');
  await page.click('button[type="submit"]');
  
  // Wait for URL to change to dashboard
  await page.waitForFunction('window.location.pathname === "/staff/dashboard"', { timeout: 10000 });
  
  console.log('URL AFTER LOGIN:', page.url());
  
  await page.goto('http://localhost:3000/staff/blog');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('URL ON BLOG:', page.url());
  
  await page.reload();
  await new Promise(r => setTimeout(r, 3000));
  
  console.log('URL AFTER REFRESH:', page.url());
  
  await browser.close();
})();
