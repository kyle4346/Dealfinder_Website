const puppeteer = require("puppeteer");

//robots parser to check if the webpage is crawlable and I don't get in trouble with Amazon

// const robotsParser = require("robots-txt-parser");
// var isCrawlable;

// const robots = robotsParser({
//   userAgent: "Googlebot", // The default user agent to use when looking for allow/disallow rules, if this agent isn't listed in the active robots.txt, we use *.
//   allowOnNeutral: false, // The value to use when the robots.txt rule's for allow and disallow are balanced on whether a link can be crawled.
// });

// robots.useRobotsFor("https://amazon.com/").then(() => {
//   robots.canCrawlSync(
//     "https://www.amazon.com/s?bbn=7141123011&rh=n%3A1045624&fs=true&ref=lp_1045624_sar"
//   ); // Returns true if the link can be crawled, false if not.
//   robots.canCrawl(
//     "https://www.amazon.com/s?bbn=7141123011&rh=n%3A1045624&fs=true&ref=lp_1045624_sar",
//     (value) => {
//       console.log("Crawlable: ", value);
//       isCrawlable = value;
//       if (isCrawlable === false) {
//         console.log("This webpage is not crawlable!!!");
//         process.exit();
//       }
//     }
//   ); // Calls the callback with true if the link is crawlable, false if not.
//   robots
//     .canCrawl(
//       "https://www.amazon.com/s?bbn=7141123011&rh=n%3A1045624&fs=true&ref=lp_1045624_sar"
//     ) // If no callback is provided, returns a promise which resolves with true if the link is crawlable, false if not.
//     .then((value) => {
//       console.log("Crawlable: ", value);
//       isCrawlable = value;
//       if (isCrawlable === false) {
//         console.log("This webpage is not crawlable!!!");
//         process.exit();
//       }
//     });
// });


//PLEASE REFER TO BACKEND.JS FOR COMMENTS
//THIS CODE IS THE SAME AS BACKEND.JS EXCEPT FOR THE WEBPAGE URL
let items = [];

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    userDataDir: "./tmp"
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.amazon.com/b/?node=1258644011&ref_=Oct_d_odnav_d_1040658_6&pd_rd_w=aNUYo&content-id=amzn1.sym.da9d5993-999b-41a1-9ebb-f85ff6fd0fb0&pf_rd_p=da9d5993-999b-41a1-9ebb-f85ff6fd0fb0&pf_rd_r=N5GNRSCNRP825WGR1K49&pd_rd_wg=6PJ4x&pd_rd_r=bdceb127-b27e-42cc-b16f-d5559ca32510"
  );
//"https://www.amazon.com/s?bbn=7141123011&rh=n%3A1045624&fs=true&ref=lp_1045624_sar"
// "https://www.amazon.com/b/?node=1258644011&ref_=Oct_d_odnav_d_1040658_6&pd_rd_w=aNUYo&content-id=amzn1.sym.da9d5993-999b-41a1-9ebb-f85ff6fd0fb0&pf_rd_p=da9d5993-999b-41a1-9ebb-f85ff6fd0fb0&pf_rd_r=N5GNRSCNRP825WGR1K49&pd_rd_wg=6PJ4x&pd_rd_r=bdceb127-b27e-42cc-b16f-d5559ca32510"
  const productHandles = await page.$$(
    "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
  );

  //   await page.screenshot({ path: "screenshot.png" });

  

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

  console.log(items);

  await browser.close();
}
main();

// async function pages() {
//   const browser = await puppeteer.launch({
//     headless: "new",
//   });

//   const page = await browser.newPage();

//   await page.goto(
//     "https://www.amazon.com/s?i=fashion-mens-clothing&bbn=7141123011&rh=n%3A1045624&fs=true&page=2&qid=1685835376&ref=sr_pg_2",{
//       waitUntil : "load"
//     }
//   );

//   const is_disabled = await page.click(".s-pagination-next")

//   console.log(is_disabled);

//   await browser.close();
// }
// pages();
