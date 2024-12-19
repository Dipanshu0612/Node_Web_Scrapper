import puppeteer, { Browser } from "puppeteer";

const url: string = "https://books.toscrape.com/";

const fetchData = async () => {
  const browser: Browser = await puppeteer.launch({ headless: false });
  const Page = await browser.newPage();
  await Page.goto(url);

  await Page.locator(".image_container a").click();

  setTimeout(async () => {
    await browser.close();
  }, 2000);
};

fetchData();
