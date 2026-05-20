const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5174');
  await page.waitForSelector('button[aria-label="DateTimePicker"]');
  await page.click('button[aria-label="DateTimePicker"]');
  await new Promise(r => setTimeout(r, 1000));
  
  // Click the input to open calendar
  const inputs = await page.$$('input');
  await inputs[0].click();
  await new Promise(r => setTimeout(r, 500));
  
  // Click time picker trigger
  const timeTrigger = await page.$('.nepali-time-picker__trigger');
  if (timeTrigger) {
    console.log("Found time trigger");
    await timeTrigger.click();
    await new Promise(r => setTimeout(r, 500));
    
    // Click hour 5
    const options = await page.$$('.nepali-time-picker__option');
    console.log("Options count:", options.length);
    if (options.length > 5) {
      await options[4].click(); // hour 5
      console.log("Clicked hour 5");
    }
  } else {
    console.log("Time trigger not found");
  }
  
  await new Promise(r => setTimeout(r, 1000));
  const html = await page.evaluate(() => document.body.innerHTML);
  if (html.includes('05:')) {
    console.log("Time successfully changed to 05:");
  } else {
    console.log("Time did not change.");
  }
  
  await browser.close();
})();
