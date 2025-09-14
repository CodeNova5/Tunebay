import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // show browser
  const page = await browser.newPage();

  await page.goto("https://evoting.tasued.edu.ng/login"); // replace with actual login page

  // Fill login form
  await page.type('input[name="username"]', "20220294155");
  await page.type('input[name="password"]', "037092");

  // Click login and wait for redirect
  await Promise.all([
    page.click('button[name="login"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }) // waits for page load
  ]);

  console.log("Redirected after login!");
  // await browser.close();
})();
