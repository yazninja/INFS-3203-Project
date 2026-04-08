export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	if (!body.jsonDB || body.jsonDB == undefined) return "No DB provided"

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
							{ text: `Here is a car in JSON format: ${body.jsonDB}\nBased on this data, give me a rating for the car use all the reasoning and come up with a number from 0-100 that represent how much would you recommend this car. Just reply with the number only.` }
						]
					}
				],
			})
		});
		const data = await response.json();
		let text = data.candidates[0].content.parts[0].text;
		// console.log("Response from Gemini: ", text);
		return Number(text);
	} catch (err) {
		console.error("Error calling Gemini API: ", err);
		return "Error calling Gemini API";
	}

})
