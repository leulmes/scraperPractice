// node.js context
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('node:fs');
puppeteer.use(StealthPlugin());
const arr = [];

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("https://books.toscrape.com/catalogue/category/books/classics_6/index.html");

    let selector = "ol.row";
    let selector2 = "li";

    await page.waitForSelector(selector);
    const booksFromBrowser = await page.evaluate((selector) => {
        // browser context
        const ol = document.querySelector(selector);
        const liElements = ol.querySelectorAll('li');
        const jsonObj = [];
        
        console.log("li ele: ", liElements);
        liElements.forEach((li) => {
            const title = li.querySelector('h3 a').getAttribute('title') || 'N/A';
            const price = li.querySelector('div.product_price p').textContent || 'N/A';
            const inStock = li.querySelector('div.product_price p.instock.availability').innerText;
            
            console.log("title: ", title);
            console.log("price: ", price);
            console.log("in stock? ", inStock);

            const curObj = {
                "title": title,
                "price": price,
                "inStock": inStock
            };

            jsonObj.push(curObj);
        });
        
        console.log('items as HTML:', ol); // Log in browser console
        
        return jsonObj;
    }, selector);
    
    console.log("books: ", booksFromBrowser);
    fs.writeFile('books.txt', JSON.stringify(booksFromBrowser), { flag: 'w+' }, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
    });
})();