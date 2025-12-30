const axios = require("axios");
require("dotenv").config();

async function fetchArticles() {
  try {
    await axios.get(process.env.BACKEND_API_URL);

    const res = await axios.get(process.env.BACKEND_API_URL);
    return res.data.filter(article => !article.isUpdated);

  } catch (err) {
    console.error("Backend not running. Please start the backend server first.");
    process.exit(1);
  }
}

fetchArticles().then(articles => {
  console.log("Articles fetched:", articles.length);
});
