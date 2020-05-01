const puppeteer = require("puppeteer");
const chalk = require("chalk");
var fs = require("fs");

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

(async () => {
  try {
    // open the headless browser
    var browser = await puppeteer.launch({ headless: true });
    // open a new page
    var page = await browser.newPage();
    // enter url in page
    await page.goto(`https://www1.compareyourcountry.org/corporate-tax-statistics/en/0/1028/default`);
    await page.waitForSelector("span.countryLong");

    var countries = await page.evaluate(() => {
      var countryName = document.querySelectorAll(`span.countryLong`);
      var tax = document.querySelectorAll(`span.bars`);
      var array = [];
      for (var i = 0; i < countryName.length; i++) {
        array[i] = {
          country: countryName[i].innerText,
          tax: tax[i].innerText
        };
      }
      return array;
    });
    // console.log(countries);
    await browser.close();
    // Writing the countries inside a json file
    fs.writeFile("taxcountries.json", JSON.stringify(countries), function(err) {
      if (err) throw err;
      console.log("Saved");
    });
    console.log(success("Browser Closed"));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
  }
})();