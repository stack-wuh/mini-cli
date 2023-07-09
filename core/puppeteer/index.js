import puppeteer from 'puppeteer'
import fs from 'fs-extra'

const workflow = async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
   })

  const page = await browser.newPage()

  await page.goto('https://www.google.com.hk/search?q=puppeteer+%E4%BD%BF%E7%94%A8&newwindow=1&ei=cNKoZK6uD8GH-Abhsqw4&ved=0ahUKEwiupqWokP7_AhXBA94KHWEZCwcQ4dUDCBA&uact=5&oq=puppeteer+%E4%BD%BF%E7%94%A8&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQAzIFCAAQgAQyBQgAEIAEMgUIABCABDIECAAQHjIGCAAQCBAeMgYIABAIEB4yCAgAEAUQHhAKMgYIABAFEB4yBggAEAUQHjIGCAAQCBAeOgQIABBHOgcIABCKBRBDOgcIABAMEIAEOgcIABATEIAEOgYIABAeEBM6CAgAEAgQHhATOgkIABANEBMQgAQ6CAgAEB4QDRATOgoIABAIEB4QDRATOgUIIRCgAUoECEEYAFDrAVi-T2DnUWgHcAJ4AIABpwGIAasKkgEDMC45mAEAoAEBwAEByAEK&sclient=gws-wiz-serp')

  await page.waitForSelector('#rso > div > div > div > div > div > a')

  const links = await page.evaluate(() => {
    const result = [];

    const nodeList = document.querySelectorAll('a');
    nodeList.forEach((node) => {
      result.push({
        text: node.innerText,
        href: node.href,
      });
    });

    return result;
  });

  fs.writeFile('./log.json', JSON.stringify(links))
}

workflow()