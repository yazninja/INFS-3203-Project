import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "node:fs";
export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	if (!body.jsonDB) return "No DB provided"
	const ai = new GoogleGenAI({
		apiKey: process.env.UPLOAD_API_KEY
	});

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	// 1. Create a local temp file to upload
	const tempFilePath = join(__dirname, `data-${Date.now()}.json`);

	try {
		fs.writeFileSync(tempFilePath, body.jsonDB);

		// 2. Upload the file to the Gemini File API
		const uploadResult = await ai.files.upload({
			file: tempFilePath,
			config: {
				mimeType: "application/json",
				displayName: "Vehicle Database",
			}
		});


		const url = "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:generateContent?key=" + (process.env.GEMINI_API_KEY || "");

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					"contents": [
						{
							role: "user",
							parts: [
								{
									inlineData: {
										data: Buffer.from(body.jsonDB).toString('base64'),
										mimeType: "text/plain"
									}
								},
								{ text: "Here is the database in JSON format:\nBased on this data, can you provide suggestions for what a user might want to ask about when chatting with an assistant? Please provide 5 example questions that a user might ask about the cars in this database. Format it in JSON as an array of strings, like this:\n\n[\"What is the most common car make?\", \"How many cars are brand new?\", ...]Just return JSON." }
							]
						}
					],
				})
			});
			const data = await response.json();
			let text = data.candidates[0].content.parts[0].text;
			// remove "```json and the end ``` if it exists"
			text = text.replace(/```json/g, '').replace(/```/g, '').trim();
			console.log("Response from Gemini: ", text);
			return JSON.parse(text);
		} catch (err) {
			console.error("Error calling Gemini API: ", err);
			return "Error calling Gemini API";
		}
	} catch (err) {
		console.error("Gemini Error:", err);
		return { error: "Failed to process data", details: err.message };
	} finally {
		// 4. Cleanup: Delete the local temp file
		if (fs.existsSync(tempFilePath)) {
			fs.unlinkSync(tempFilePath);
		}
	}
})
