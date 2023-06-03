require("dotenv").config();
const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const cors = require("cors");
// const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_KEY);
const morgan = require("morgan");
const app = express();
const port = process.env.PORT;
const url =
  "https://www.amazon.com/b/ref=s9_acss_bw_cg_MDTSBCMF_4a1_w?node=15697821011&ref_=Oct_d_odnav_d_1040658_13&pd_rd_w=ZNN8E&content-id=amzn1.sym.0e1885af-abe0-46a1-a6e0-433e493867c5&pf_rd_p=0e1885af-abe0-46a1-a6e0-433e493867c5&pf_rd_r=KD6BE9NQXRN5CEDFCQGS&pd_rd_wg=3UmWO&pd_rd_r=8d25d828-0817-4852-be6f-67ebe8edaaef&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-5&pf_rd_r=M1DTZCAH97QXD8JYEB60&pf_rd_t=101&pf_rd_p=32311044-e5fc-4c2b-a568-f1b5918d242f&pf_rd_i=7147441011";

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function main() {
  try {
    let res = await axios.get(url);
    const $ = await cheerio.load(res.data);
    const $life = $(
      "div"
    );
    const text1 = $life.text();
    console.log(text1);
  } catch (e) {
    console.log(e);
  }
}
main();

client.connect();
console.log("Connected successfully to MongoDB server");
const dbName = "sample_analytics";
const db = client.db(dbName);

const collection = db.collection("customers");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/findOne", (req, res) => {
  async function findOne() {
    const findResult = await collection.findOne({ name: "James Sanchez" });
    // console.log(findResult);
    res.send(findResult);
  }
  findOne();
});

app.get("/find", (req, res) => {
  async function findAll() {
    const findResult = await collection.find({}).toArray();
    // console.log(findResult);
    res.send(findResult);
  }
  findAll();
});
