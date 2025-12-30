const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeExternalArticle(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120"
      }
    });

    const $ = cheerio.load(data);

    let content = "";

    if ($("article").length) {
      content = $("article").text();
    } else {
      $("p").each((_, el) => {
        content += $(el).text() + "\n";
      });
    }

    return content.trim().slice(0, 4000);
  } catch (err) {
    console.error(`Failed to scrape ${url}`);
    return "";
  }
}

module.exports = scrapeExternalArticle;
