import { GoogleGenAI } from "@google/genai";
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.jsonDB) return "No DB provided"
  if (!body.message) return "No message provided"

  const url = "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-pro:generateContent?key=" + (process.env.GEMINI_API_KEY || "");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [
            { text: body.message + "\n\nThe prices are in QAR. Use the data below to answer. Here is the database in JSON format:" },
            {
              inlineData: {
                data: Buffer.from(body.jsonDB).toString('base64'),
                mimeType: "text/plain"
              }
            },
          ]
        }]
      })
    });
    console.log("Response status from Gemini API: ", response.status);
    console.log("response:", response);
    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    return text;
  } catch (err) {
    console.error("Error generating content:", err);
    return "Error generating content";
  }
})
