import puppeteer, { Browser } from "puppeteer";
const url: string = "https://books.toscrape.com/";
import * as fs from "fs";

type bookDataType = {
  title: string | null;
  price: string;
  imageSrc?: string;
  inStock: string;
  rating?: number | string;
}[];

const fetchData = async () => {
  const browser: Browser = await puppeteer.launch({ headless: false });
  const Page = await browser.newPage();
  await Page.goto(url);

  const bookData: bookDataType = await Page.evaluate((url) => {
    const books = Array.from(document.querySelectorAll(".product_pod"));
    const info = books.map((book: Element) => ({
      title: book.querySelector("h3 a")?.getAttribute("title") || null,
      price: (book.querySelector(".price_color") as HTMLElement)?.innerText,
      imageSrc: url + book.querySelector("img")?.getAttribute("src"),
      inStock:
        (book.querySelector(".instock") as HTMLElement)?.innerText.trim() || "",
      rating: book.querySelector(".star-rating")?.classList[1],
    }));
    return info;
  }, url);
  // console.log(bookData);

  bookData.forEach((book) => {
    book.price = book.price.replace("£", "");
  });

  setTimeout(async () => {
    fs.writeFileSync("bookdata.json", JSON.stringify(bookData));
    await browser.close();
  }, 3000);
};

fetchData();
