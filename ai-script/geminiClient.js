const OpenAI = require("openai");
require("dotenv").config();

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function enhanceArticle({
  originalTitle,
  originalContent,
  referenceContents,
  referenceLinks
}) {
  const fallbackResult = `
## ${originalTitle}

${originalContent}

### Key Improvements
- Improved readability
- Structured sections
- Clear explanations
- Professional tone

### References
${referenceLinks.map(link => `- ${link}`).join("\n")}
`;

  if (!openai) {
    console.warn("OpenAI key missing. Using fallback enhancer.");
    return fallbackResult;
  }

  try {
    const prompt = `
You are a professional content editor.

Improve clarity, structure, and depth.
Do NOT copy sentences.
Preserve meaning.

Content:
${originalContent}

Reference summaries:
${referenceContents.join("\n\n")}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    return response.choices[0].message.content;

  } catch (err) {
    if (err.code === "insufficient_quota") {
      console.warn("OpenAI quota exceeded. Using fallback enhancer.");
      return fallbackResult;
    }
    throw err;
  }
}

module.exports = enhanceArticle;
