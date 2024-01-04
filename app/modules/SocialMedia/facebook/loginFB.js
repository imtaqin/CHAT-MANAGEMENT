const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");


class loginFB {
  constructor() {
    this.paths = path.join(__dirname, '../../../lib/extensions/getCookie');
  }
  async loginAndSave(username, password) {
    const userDataDir = path.resolve(__dirname, username);
    const filePath = process.cwd() + "/storage/" + username + ".json";
    
    // Check if the user's data file exists.
 

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-notifications",       `--disable-extensions-except=${this.paths}`,
      `--load-extension=${this.paths}`],
   userDataDir,

   executablePath: puppeteer.executablePath("chrome")
    });

    const page = await browser.newPage();
    await page.goto("https://www.facebook.com/");

    try {
      await page.waitForSelector('input[name="email"]', { timeout: 1000 });
      await page.type('input[name="email"]', username);
      await page.type('input[name="pass"]', password);
      await page.click('button[name="login"]');
      await page.waitForNavigation();
    } catch (error) {
      console.log("User seems already logged in");
    }
    
    try {
      const newPage = await browser.newPage();
      await newPage.goto("chrome-extension://hgofplolajolelklccnjjolkmmephmdg/popup.html#requests", { waitUntil: 'load' });
      await newPage.waitForSelector('#btnCopy');
      const text = await newPage.evaluate(() => {
        let textarea = document.getElementById('yourFbstate');
        return textarea.value;
      });
      await newPage.close();
      await browser.close();
      return text;
    } catch (error) {
      console.log(error);
    } finally {
    //await browser.close();
    }
  }
}

module.exports = loginFB;
