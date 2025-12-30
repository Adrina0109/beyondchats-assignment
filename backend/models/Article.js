const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  sourceUrl: String,
  isUpdated: {
    type: Boolean,
    default: false
  },
  references: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Article", articleSchema);
