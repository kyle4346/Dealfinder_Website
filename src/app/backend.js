require("dotenv").config();
// const axios = require("axios");
const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_KEY);
const morgan = require("morgan");
const app = express();
const port = process.env.PORT;


//=======Declarations==================================


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



client.connect();
console.log("Connected successfully to MongoDB server");
const dbName = "walmart";
const db = client.db(dbName);

const collection = db.collection("mens_clothing");

//==========Backend Connections======================================================

let items = [];

//main function for launching puppeteer api for webscraping amazon men's shirts
async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    userDataDir: "./tmp"
  });

  const page = await browser.newPage();

  //url to scrape from
  await page.goto(
    "https://www.amazon.com/s?bbn=7141123011&rh=n%3A1045624&fs=true&ref=lp_1045624_sar"
  );
//"https://www.amazon.com/s?bbn=7141123011&rh=n%3A1045624&fs=true&ref=lp_1045624_sar"
  const productHandles = await page.$$(
    "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
  );



  
//for loop to web scrape title, price, brand, and the image url from amazon
  for (const productHandle of productHandles) {
    let brand = "Null";
    let title = "Null";
    let price = "Null";
    let imgUrl = "Null";

    //====================================================================================

    try {
      brand = await page.evaluate(
        (el) => el.querySelector("h5.s-line-clamp-1").textContent,
        productHandle
      );
    } catch (error) {}

    try {
      title = await page.evaluate(
        (el) => el.querySelector("h2 > a > span").textContent,
        productHandle
      );
    } catch (error) {}

    try {
      price = await page.evaluate(
        (el) => el.querySelector(".a-price > .a-offscreen").textContent,
        productHandle
      );
    } catch (error) {}

    try {
      imgUrl = await page.evaluate(
        (el) => el.querySelector(".s-image").getAttribute("src"),
        productHandle
      );
    } catch (error) {}

    // console.log(title, price, imgUrl);

    if (title !== "Null") {
      items.push({ brand, title, price, imgUrl });
    }

    //=======================================================
  }
  //testing purpose to show that all 60 items in webpage was parsed
  console.log(items);
  console.log(items.length);

  await browser.close();
}
main();

//===================database====================================================

//security for database connections
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/findOne", (req, res) => {
//   async function findOne() {
//     const findResult = await collection.findOne({ name: "James Sanchez" });
//     // console.log(findResult);
//     res.send(findResult);
//   }
//   findOne();
// });

// app.get("/find", (req, res) => {
//   async function findAll() {
//     const findResult = await collection.find({}).toArray();
//     // console.log(findResult);
//     res.send(findResult);
//   }
//   findAll();
// });

//link for posting all items scraped from amazon website
app.post("/post", (req,res) => {
  async function postAll() {
    const postResults = await collection.insertMany(items);
    res.send(postResults);
  }
  postAll();
  console.log("Items Posted!")
})