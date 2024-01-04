const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const EventEmitter = require('events');
const {Tiktok} = require("../../../model/Index");

puppeteer.use(StealthPlugin());

const konfigbrowser = {
    headless: "new",
    args: [
        "--log-level=3",
        "--no-default-browser-check",
        "--disable-infobars",
        "--disable-web-security",
        "--disable-site-isolation-trials",
        "--no-experiments",
        "--ignore-gpu-blacklist",
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
        "--mute-audio",
        "--disable-extensions",
        "--no-sandbox",
        "--no-first-run",
        "--no-zygote"
    ],
    executablePath: '/usr/bin/google-chrome-stable'
};

class TikTokClient extends EventEmitter {
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
    }

    async startApp() {
        try {
            const browser = await puppeteer.launch(konfigbrowser);
            const page = await browser.newPage();

            // assuming cookies would be retrieved based on username and password
            let tiktokUser = await Tiktok.findOne({ where: { username: this.username } });
            let cookies;
            if (tiktokUser && tiktokUser.cookie) {
                // If cookies exist, try using them
                cookies = JSON.parse(tiktokUser.cookie);
                this.page = await this.setupBrowser(cookies);
            
                if (!(await this.areCookiesValid())) {
                    // If cookies are not valid, get new cookies and save them
                    cookies = await this.getCookies(this.username, this.password);
                    await this.updateCookiesInDB(tiktokUser, cookies);
                }
            } else {
                // If cookies don't exist, get new cookies and save them
                cookies = await this.getCookies(this.username, this.password);
                tiktokUser = await Tiktok.create({ username: this.username, password: this.password, cookie: JSON.stringify(cookies) });
                this.page = await this.setupBrowser(cookies);
            }
            
            // Now that cookies is defined in this scope, you can use it
            await page.setCookie(...cookies);

            await page.goto('https://www.tiktok.com/messages', { waitUntil: "networkidle2" });
            await page.waitForXPath('//div[@data-e2e="chat-list-item"]');
            const chatItems = await page.$x('//div[@data-e2e="chat-list-item"]');
            
            for (let chatItem of chatItems) {
                // Extract the nickname, message, and time for each chat item
                const nicknameElement = await chatItem.$x('.//p[contains(@class, "PInfoNickname")]');
                const messageElement = await chatItem.$x('.//span[contains(@class, "SpanInfoExtract")]');
                const timeElement = await chatItem.$x('.//span[contains(@class, "SpanInfoTime")]');

                const nickname = await page.evaluate(element => element.innerText, nicknameElement[0]);
                const message = await page.evaluate(element => element.innerText, messageElement[0]);
                const time = await page.evaluate(element => element.innerText, timeElement[0]);

                // Check if the message is unread
                const unreadElement = await chatItem.$x('.//span[contains(@class, "SpanNewMessage")]');
                const isUnread = unreadElement.length > 0; // If the "unread" indicator exists, the message is unread

                this.emit('message', {
                    nickname: nickname,
                    message: message,
                    time: time,
                    isUnread: isUnread
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    async setupBrowser(cookies) {
        const browser = await puppeteer.launch(konfigbrowser);
        const page = await browser.newPage();
    
        await page.setCookie(...cookies);
    
        return page;
    }

    async areCookiesValid() {
        try {
            // Try to navigate to a page that requires login
            await this.page.goto('https://www.tiktok.com/messages', { waitUntil: "networkidle2" });
    
            // If navigation succeeds, cookies are valid
            return true;
        } catch (error) {
            // If navigation fails, cookies are not valid
            return false;
        }
    }
    async getCookies(username, password) {
        console.log(username, password)
        const browser = await puppeteer.launch(konfigbrowser);
        const page = await browser.newPage();

        await page.goto('https://www.tiktok.com/login/phone-or-email/email', { waitUntil: 'networkidle0' });

        // Type in the username and password
        await page.waitForXPath('//*[@id="loginContainer"]/div[1]/form/div[1]/input');
        await page.waitForXPath('//*[@id="loginContainer"]/div[1]/form/div[2]/div/input');

        let usernameInput = await page.$x('//*[@id="loginContainer"]/div[1]/form/div[1]/input');
        await usernameInput[0].click(username);
        await page.keyboard.type(username);
        let passwordInput = await page.$x('//*[@id="loginContainer"]/div[1]/form/div[2]/div/input');
        await passwordInput[0].click(password);
        await page.keyboard.type(password);

        // Submit the form
        await page.waitForXPath('//*[@id="loginContainer"]/div[1]/form/button');
        let submitButton = await page.$x('//*[@id="loginContainer"]/div[1]/form/button');
        await submitButton[0].click();

        // Wait for navigation to ensure the login process has completed
        await page.waitForNavigation({ waitUntil: "networkidle0" });

        // Get cookies
        const cookies = await page.cookies();

        // Close the browser
        await browser.close();

        return cookies;
    }
    
}

module.exports = TikTokClient;
