const PORT = process.env.PORT || 8000;
const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const CronJob = require('cron').CronJob;
const ejs = require('ejs');
const { response } = require('express');

const app = express();

const url = "https://www.amazon.in/Xbox-Series-S/dp/B08J89D6BW/ref=sr_1_1_sspa?dchild=1&keywords=xbox&qid=1635269581&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzUDczTjJKUjk3RkpMJmVuY3J5cHRlZElkPUExMDIwMjkyMzRaUVdZMzlNMzNKNyZlbmNyeXB0ZWRBZElkPUEwOTYyMTEyMTBVTFJGS0NSQjY1SSZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU="
const details = [];

async function configureBrowser(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}
async function checkAvailability(page){
    await page.reload();
    axios.get(url)
    .then(response=>{
             const html = response.data;
             const $ = cheerio.load(html);
            const title =  $('#productTitle').text().trim();
            const price =  $('.priceBlockStrikePriceString').text().trim();
            let discountedPrice = $('#priceblock_dealprice').text().trim();
            if(discountedPrice==""){
                discountedPrice = $('#priceblock_ourprice').text().trim();
            }
            const inStock = $('#availability').find('span').text().trim();
            
            console.log(inStock);
            console.log(discountedPrice);
            if(inStock=="In stock."){
                console.log(true);

            }
        })
}
async function startTracking(){
    const page = await configureBrowser();
    let job = new CronJob('*/5 * * * * *', function(){
        checkAvailability(page);
    },null,true,null,null,true);
    job.start();
}
startTracking();
app.get('/',(req,res)=>{
    
    
});
app.listen(PORT, ()=>console.log(`server running on PORT ${PORT}`));