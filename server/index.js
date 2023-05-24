const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post("/generate-event-details", async (req, res) => {
  try {
    let { prompt } = req.body;
    if (!prompt) {
      prompt = "meeting tomorrow at the central park";
    }
    console.log(process.env.OPENAI_API_KEY);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
        Extract the event details from the text I will provide.
        use this format:
        {
            summary: "",
            description:
              "",
            location: "",
            start: {
              dateTime: "",
              timeZone: undefined,
            },
            end: {
              dateTime: "",
              timeZone: undefined,
            },
          }
          follow the rules:
        dateTime format is YYYY-MM-DDTHh:mm:ss. timeZone should always be undefined. always escape special characters to ensure correctness within the JSON object. if some details are missing/unclear from the text, always try to guess and add a value. if you don't know the description, make up something funny.
        this is the text:
              ${prompt}
      
              The time complexity of this function is
              ###
            `,
      max_tokens: 64,
      temperature: 0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    });

    return res.status(200).json({
      success: true,
      data: response.data.choices[0].text,
    });
  } catch (error) {
    return res.status(error.response.status).json({
      statusText: error.response.statusText,
      error: error.response.data.error
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
