const axios = require("axios");
require("dotenv").config();

const enhanceArticle = require("./geminiClient");
const scrapeExternalArticle = require("./scrapeExternalArticle");

async function fetchArticles() {
  try {
    await axios.get(process.env.BACKEND_API_URL);
    const res = await axios.get(process.env.BACKEND_API_URL);
    return res.data.filter(article => !article.isUpdated);
  } catch (err) {
    console.error("Backend not running. Start backend first.");
    process.exit(1);
  }
}

async function run() {
  const articles = await fetchArticles();
  console.log("Articles fetched:", articles.length);

  for (const article of articles) {
    console.log(`🔍 Enhancing: ${article.title}`);

    const referenceLinks = article.referenceLinks || [
      "https://example.com/article1",
      "https://example.com/article2"
    ];

    const referenceContents = [];

    for (const link of referenceLinks.slice(0, 2)) {
      try {
        const content = await scrapeExternalArticle(link);
        referenceContents.push(content.slice(0, 1000));
      } catch {
        referenceContents.push("Reference content unavailable.");
      }
    }

    const enhancedContent = await enhanceArticle({
      originalTitle: article.title,
      originalContent: article.content,
      referenceContents,
      referenceLinks
    });

    await axios.put(
      `${process.env.BACKEND_API_URL}/${article._id}`,
      {
        updatedContent: enhancedContent,
        isUpdated: true
      }
    );

    console.log(`Updated: ${article.title}`);
  }
}

run();
