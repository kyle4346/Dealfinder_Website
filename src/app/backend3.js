const puppeteer = require("puppeteer");

//PLEASE REFER TO BACKEND.JS FOR COMMENTS
//THIS CODE IS THE SAME AS BACKEND.JS EXCEPT FOR THE WEBPAGE URL

async function pages() {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.amazon.com/s?i=fashion-mens-clothing&bbn=7141123011&rh=n%3A1045624&fs=true&page=2&qid=1685835376&ref=sr_pg_2",
    {
      waitUntil: "load",
    }
  );

  const next_button =
    (await page.$(
      "a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator"
    )) !== null;

  console.log("Next button is working: " + next_button);

  const productHandles = await page.$$(
    "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
  );

  let items = [];
  var i = 2;

  for (productHandle of productHandles) {
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

  // await page.waitForSelector(
  //   "div > div > span > a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator",
  //   { visible: true }
  // );
  // for (i; i < 4; i++) {
  //   await page.waitForNavigation();
  //   await page.click(
  //     "div > div > span > a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator"
  //   );
  // }
  console.log(items.length);
  

  await browser.close();
}
pages();
