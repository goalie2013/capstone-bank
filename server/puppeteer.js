const puppeteer = require("puppeteer");
const fs = require("fs");

const takeScreenshot = async (id, date, type, res) => {
  console.log("takeScreenshot FUNCTION");
  let browser;

  // Create folder to save screenshots into
  if (!fs.existsSync("screenshots")) fs.mkdirSync("screenshots");

  //   (async () => {
  const typeLower = type.toLowerCase();
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://betterbankingapp.net/${typeLower}/${id}`);
    await page.emulateMediaType("screen");
    await page.setViewport({ width: 1440, height: 1080 });

    // { path: `${type}-${date}.png` }
    const image = await page.screenshot({
      type: "jpeg",
      quality: 100,
      clip: {
        x: 0,
        y: 70,
        width: 640,
        height: 360,
      },
      omitBackground: true,
    });
    const base64Image = Buffer.from(image).toString("base64");
    console.log("image", image);
    console.log("base64Image", base64Image);
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": image.length,
    });

    res.end(base64Image);
  } catch (err) {
    console.error("screenshot ERROR", err.message);
    res.sendStatus(503);
  } finally {
    await browser.close();
  }
  //   })();
};

function createPdf(id, date, type, res) {
  console.log("createPdf FUNCTION");
  (async () => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`https://betterbankingapp.net/deposit/${id}`);
      await page.emulateMediaType("screen");
      // await page.setViewport({ width: 1920,height: 1280 });
      const pdf = await page.pdf({
        path: `${type} ${date}.pdf`,
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
    } catch (err) {
      console.error("/screenshot ERROR", err.message);
      res.sendStatus(503);
    }
  })();
}
module.exports = { takeScreenshot };
