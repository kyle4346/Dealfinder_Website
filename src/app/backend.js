require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT;
const url = "https://en.wikipedia.org/wiki/Prince_Alfred_of_Great_Britain";

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

async function urlData() {
  try{
    let res = await axios.get(url);
    const $ = await cheerio.load(res.data);
    const $life = $(
      "#mw-content-text > div.mw-parser-output > p:nth-child(11)"
      )
    console.log($life.text());
  }catch(e){
    console.log(e);
  }
};
urlData();

app.get('/', (req, res) => {
  res.send('Hello World!')
});