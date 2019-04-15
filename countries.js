const puppeteer = require('puppeteer');
const chalk = require('chalk');
var fs = require('fs');

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

(async () => {
    let countries = fs.readFileSync('countries.json', {"encoding": "utf8"}, (err, data) => {
        if (err) throw err;
        return JSON.parse(data);
    });
    countries = JSON.parse(countries);
    try {
        // Open the headless browser
        var browser = await puppeteer.launch({headless: false, args: ['--start-maximized']});

        // Open a new page
        var page = await browser.newPage();
        await page.setViewport({ width: 1600, height: 757 });

        let banks = {};

        for (let i = 0; i < countries.length; i++) {
            console.log(countries[i]);
            for (let j = 0; j < countries[i].page.length; j++) {
                await page.goto(`https://www.bankswiftcode.org${countries[i].page[j]}`, {waitUntil: 'networkidle2'});
                var banksElements = await page.$x("//table[contains(@style, 'border')]//tr");
                var banksElem = await page.evaluate((...banksElements) => {
                    return banksElements.map((e, index) => {
                        let tds = e.cells;
                        let bankDetails = {};
                        bankDetails.id = tds[0].textContent;
                        bankDetails.bankName = tds[1].textContent;
                        bankDetails.city = tds[2].textContent;
                        bankDetails.branchName = tds[3].textContent;
                        bankDetails.swiftCode = tds[4].textContent;
                        return (index !== 0) ? bankDetails : null;
                    }).filter(e => e !== null);
                }, ...banksElements);
            }
            banks[countries[i].name] = banksElem;
        }

        await browser.close();

        // Writing the news inside a json file
        fs.writeFile("banks.json", JSON.stringify(banks, null, '\t'), function (err) {
            if (err) throw err;
            console.log("Saved!");
        });

        console.log(success("Browser Closed"));
    } catch (err) {
        // Catch and display errors
        console.log(error(err));
        await browser.close();
        console.log(error("Browser Closed"));
    }
})();


// (async () => {
//     let countries = fs.readFileSync('countries.json', {"encoding": "utf8"}, (err, data) => {
//         if (err) throw err;
//         return JSON.parse(data);
//     });
//     countries = JSON.parse(countries);
//     try {
//         // Open the headless browser
//         var browser = await puppeteer.launch({headless: false, args: ['--start-maximized']});
//
//         // Open a new page
//         var page = await browser.newPage();
//         await page.setViewport({ width: 1600, height: 757 });
//
//         let pages = [];
//
//         for (let i = 150; i < countries.length; i++) {
//             console.log(countries[i]);
//             await page.goto(`https://www.bankswiftcode.org${countries[i].page}`, {waitUntil: 'networkidle2'});
//             var pageElements = await page.$x("//a[contains(text(),'Page')]//@href")
//             var pageElem = await page.evaluate((...pageElements) => {
//                 return pageElements.map(e => {
//                     return e.textContent;
//                 }).filter(e => e !== null);
//             }, ...pageElements);
//             let pageObj = {};
//             pageObj.country = countries[i].name;
//             pageObj.pages = pageElem;
//             pages.push(pageObj);
//         }
//
//         await browser.close();
//
//         let pagesOld = fs.readFileSync('pages.json', {"encoding": "utf8"}, (err, data) => {
//             if (err) throw err;
//             return JSON.parse(data);
//         });
//         pagesOld = JSON.parse(pagesOld);
//
//         pages = pagesOld.concat(pages);
//
//         // Writing the news inside a json file
//         fs.writeFile("pages.json", JSON.stringify(pages, null, '\t'), function (err) {
//             if (err) throw err;
//             console.log("Saved!");
//         });
//
//         console.log(success("Browser Closed"));
//     } catch (err) {
//         // Catch and display errors
//         console.log(error(err));
//         await browser.close();
//         console.log(error("Browser Closed"));
//     }
// })();


// (async () => {
//     try {
//         // Open the headless browser
//         var browser = await puppeteer.launch({headless: false, args: ['--start-maximized']});
//
//         // Open a new page
//         var page = await browser.newPage();
//         await page.setViewport({ width: 1600, height: 757 });
//
//         // enter url in page
//         await page.goto('https://www.bankswiftcode.org/', {waitUntil: 'networkidle2'});
//
//         var lettersElements = await page.$x("//ul[@id='breadcrumbs']//li//a//@href");
//
//         var letters = await page.evaluate((...lettersElements) => {
//             return lettersElements.map(e => e.textContent);
//         }, ...lettersElements);
//
//         var countries = [];
//
//         for (let i = 0; i < letters.length; i++) {
//             console.log(letters[i]);
//             await page.goto(`https://www.bankswiftcode.org${letters[i]}`, {waitUntil: 'networkidle2'});
//             var countryElements = await page.$x("//td//a[not(@class) and not(@rel)]//@href");
//             var countriesElem = await page.evaluate((...countryElements) => {
//                 return countryElements.map(e => e.textContent);
//             }, ...countryElements);
//             for (let x = 0; x < countriesElem.length; x++) {
//                 let countryObj = {};
//                 countryObj.name = countriesElem[x].replace(/\//g, "").replace("/-/g", " ").trim();
//                 countryObj.page = countriesElem[x];
//                 countries.push(countryObj);
//             }
//         }
//
//         await browser.close();
//
//         // Writing the news inside a json file
//         fs.writeFile("countries.json", JSON.stringify(countries, null, '\t'), function (err) {
//             if (err) throw err;
//             console.log("Saved!");
//         });
//
//         console.log(success("Browser Closed"));
//     } catch (err) {
//         // Catch and display errors
//         console.log(error(err));
//         await browser.close();
//         console.log(error("Browser Closed"));
//     }
// })();