const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");

const scrapeBlogs = require("./scraper/scrapeBlogs");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await scrapeBlogs();
    app.listen(5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch(err => console.error(err));
