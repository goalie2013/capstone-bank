const puppeteer = require("puppeteer");

function takeScreenshot(date) {
  console.log("takeScreenshot FUNCTION");
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://betterbankingapp.net/deposit/${userId}`);
    await page.emulateMediaType("screen");
    const pdf = await page.pdf({
      path: `${date}.pdf`,
      format: "Letter",
      margin: {
        top: "20px",
        bottom: "40px",
        left: "20px",
        right: "20px",
      },
    });
    res.send(pdf);
    await browser.close();
  })();
}
module.exports = { takeScreenshot };
