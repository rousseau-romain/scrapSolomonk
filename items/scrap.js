import puppeteer from 'puppeteer';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getRandomIntFromIterval = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const delayRandom = () => new Promise((resolve) => setTimeout(resolve, getRandomIntFromIterval(100,1000)));

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webpimage/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Accept-Encoding': 'gzip',
    'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
    'Upgrade-Insecure-Requests': '1',
    'Referer': 'https://www.google.fr/'
  });
  await page.goto('https://solomonk.fr/fr/equipement/7143/solomonk');

  await delay(2245);

  // Extract item name
  const itemName = await page.$eval('div.card-solo-item-title a', el => el.innerText.trim());
  console.log(`Item name: ${itemName}`);
  await delayRandom();

  // Extract item effects
  const effects = await page.$$eval('.card-solo-item-content-light li', lis => lis.map(li => li.textContent));
  console.log('Item effects:', effects);
  await delayRandom();

  // Extract item recipe
  const recipes = await page.$$eval('.item-collapse.collapse.show > .list-toggleable > a', links => links.map(link => ({name: link.textContent.trim(), url: link.href})));
  console.log('Item recipes:', recipes);
  await delayRandom();

  // Extract item details
  const details = await page.$eval('.card-solo-item-description', el => el.innerText.trim());
  console.log(`Item details: ${details}`);
  await delayRandom();

  await delay(3289);

  await browser.close();
})();