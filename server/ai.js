/**
 * This module is the base nodejs api for interaction with open ai
 */
import * as dotenv from 'dotenv'
// import { Configuration, OpenAIApi } from 'openai'

dotenv.config()
let apiKey = process.env.OPENAI_API_KEY


//Their version
import { Configuration, OpenAIApi } from 'openai'
const configuration = new Configuration({
    apiKey:apiKey,
});

const openai = new OpenAIApi(configuration);
const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: "Hello world, what inspirational quote do you have today?",
});
console.log(completion.data.choices[0].text);




import OpenAI from "./OpenAI.js";

let oai = new OpenAI(apiKey);

oai.listModels();

oai.helloText();

oai.helloImg();

oai.simpleImg("Please construct a hilarious cat meme for christmas");


// const xss = require('xss-clean');
// const assert = require('assert');
//
// describe('xss-clean', () => {
//     it('should remove malicious HTML tags', () => {
//         const input = '<script>alert("XSS attack!")</script>';
//         const expectedOutput = '';
//         const output = xss(input);
//         assert.equal(output, expectedOutput);
//     });
//
//     it('should remove malicious attributes', () => {
//         const input = '<div onclick="alert(\'XSS attack!\')">Click me</div>';
//         const expectedOutput = '<div>Click me</div>';
//         const output = xss(input);
//         assert.equal(output, expectedOutput);
//     });
//
//     it('should allow safe HTML tags and attributes', () => {
//         const input = '<a href="http://example.com" target="_blank">Link</a>';
//         const expectedOutput = input;
//         const output = xss(input);
//         assert.equal(output, expectedOutput);
//     });
// });
//

// my version




// openai.createCompletion({
//     s
// })

let ai = {
    api: openai,



    listModels() {

    },

    testAllModels() {

    },



    async sayHi() {
        const completion = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: "Hello world",
        });
    }

};


// OpenAIApi.createCompleation


export default ai
