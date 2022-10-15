
const puppeteer = require('puppeteer');


const printScreen = async function   () {  
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

const page = await browser.newPage();
console.log('puppeteer page created');
await page.authenticate({ username: 'root', password: 'default' });


await page.goto('http://192.168.88.200');
await page.screenshot({path: 'example.png'});

await page.evaluate(() => {
   const element = document.querySelectorall(' CUdiv1 .divCU');
        return element;
    });
    console.log(element);


await browser.close();
console.log(element);
};

exports.printScreen = printScreen;
