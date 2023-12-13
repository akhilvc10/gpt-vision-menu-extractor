const OpenAI = require("openai");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({
	apiKey: process.env.OPEN_API_KEY
});

async function main() {
	const imagePath = path.join(__dirname, "./image/image4.PNG");

	// Read the image file and convert it to base64
	const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

	const response = await openai.chat.completions.create({
		model: "gpt-4-vision-preview",
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text:
							"Your job is to efficiently extract the required information and convert it into JSON format from the image that I upload. The JSON format should have below properties" +
							"'name': Capitalized name of the food/menu item." +
							"'type': Classification as 'veg', 'non_veg', or 'only_egg'." +
							"'category': Main category (not sub-category) of each item in capitalized letters." +
							"'desc': Generate a good description for each menu item." +
							"'price': If you see multiple prices then use the first one as default. For items with only one price listed, use that as the default. There will be prices with floating value. Make sure its always in string. Make sure it has only numbers. If you see characters in the image then use 0 there" +
							"Very important: Make sure you analyse the whole data from the image. Dont miss out the data. Take your time and give me full JSON. Dont ommit items. Make sure no comments are added in the JSON"
					},

					{
						type: "image",
						image_url: `data:image/png;base64,${imageBase64}`
					}
				]
			}
		],
		max_tokens: 4096
	});
	const content = response.choices[0].message.content;
	exportFile(content, "```json\\n", "data.json");
	console.log(
		"🚀 ~ file: index.js ~ line 27 ~ main ~ response",
		response.choices[0].message.content
	);
}

function exportFile(content, delimiter, outputFile) {
	const regex = new RegExp(delimiter, "i");
	const parts = content.split(regex);
	if (parts.length > 1) {
		const extractContent = parts[1].trim();
		fs.writeFileSync(outputFile, extractContent.split("```")[0] + "\n", {
			flag: "w"
		});
		console.log("Extracted file");
	} else {
		console.log("Failed");
	}
}

main();
