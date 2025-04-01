// node.js context
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('node:fs');
puppeteer.use(StealthPlugin());

// (async () => {
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();

//     await page.goto("https://quotes.toscrape.com");
//     let selector = 'div';//".row:not(.header-box) .col-md-8";
//     await page.waitForSelector(selector);

//     await page.evaluate((selector) => {
//         // browser context
//         const quotes = document.querySelector(selector);
//         console.log("quotes: ",  document.querySelector(selector));

//     });
//     console.log("page: ", page);
// })();
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("https://quotes.toscrape.com");
    let selector = ".row:not(.header-box) .col-md-8";
    await page.waitForSelector(selector);
    
    const quoteJson = await page.evaluate((selector) => {
        // browser context
        const jsonObj = [];
        let tagList = [];
        const allQuotes = document.querySelector(selector);
        const quoteList = allQuotes.querySelectorAll('.quote');

        quoteList.forEach((quote) => {
            const text = quote.querySelector('span.text').innerHTML || 'N/A';
            const author = quote.querySelector('span:nth-child(2)').querySelector('small').innerHTML || 'N/A';
            const tags = quote.querySelector('div').querySelectorAll('a');

            tags.forEach((tag) => {
                tagList.push(tag.innerHTML || 'N/A');
            })

            const curObj = {
                "author": author,
                "quote": text,
                "tags": tagList
            };

            tagList = []; // reset tag list for every quote
            jsonObj.push(curObj);
            // console.log("quote: ", text);
            // console.log("author: ", author);
            // console.log("tags: ", tagList);
        });
        return jsonObj;
    }, selector);
    console.log("quotes JSON: ", quoteJson);
    
   
})();