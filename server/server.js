import express from 'express'

import cors from 'cors'

import ai from "./ai.js"


let openai = ai.api;

ai.sayHi();

// const openai = new OpenAIApi(configuration);
const xss = require('xss-clean');
const bodyParser = require('body-parser');

const app = express()
app.use(cors())
app.use(express.json())



// Set up xss-clean middleware
function sanitizeInput(req, res, next) {
  req.body = xss(req.body);
  req.query = xss(req.query);
  req.params = xss(req.params);
  next();
}

// Use sanitizeInput middleware in express app
app.use(sanitizeInput);
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf
    }
}))


app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

//expose client
// app.use(express.static('client'));


// You can replace these 4 lines of your code:

    // app.use(express.static(path.join(__dirname, 'client')))

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
