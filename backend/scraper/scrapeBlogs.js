const axios = require("axios");
const cheerio = require("cheerio");
const Article = require("../models/Article");

const blogUrls = [
  "https://beyondchats.com/blogs/chatbots-for-small-business-growth/",
  "https://beyondchats.com/blogs/virtual-assistant/",
  "https://beyondchats.com/blogs/boost-conversion-rate-using-chatbots/",
  "https://beyondchats.com/blogs/chatbots-vs-live-chat/",
  "https://beyondchats.com/blogs/introduction-to-chatbots/"
];

async function scrapeBlogs() {
  try {
    for (const url of blogUrls) {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const title = $("h1").first().text().trim();
      const content = $("article").text().trim();

      const exists = await Article.findOne({ sourceUrl: url });
      if (exists) continue;

      await Article.create({
        title,
        content,
        sourceUrl: url
      });

      console.log(`Saved: ${title}`);
    }
  } catch (err) {
    console.error("Scraping failed:", err.message);
  }
}

module.exports = scrapeBlogs;
