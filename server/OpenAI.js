/**
 * Welcome to my simple implementation of OpenAIs v1 API endpoints
 *
 * Other project appear to have overcomplicated this
 * My goal is to offer both a 1 to 1 interface for making api request with sane ish js patterns
 *
 * ie openai.v1.completions.post -> openai.generateCompletion
 *
 */
import * as https from "https";
import * as fs from "fs";
import * as path from "path";

import OAIAPI from "./OAIAPI.js"

function saveBase64DataToFile(base64Data, filePath) {
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

    return fs.statSync(filePath);
}

function joinPathToCWD(relativePath) {
    return path.join(process.cwd(), relativePath);
}

function splitOnWhitespaceAndJoinWithUnderscore(str) {
    return str.split(/\s+/).join('_');
}

class ModelPermission {
    /**
     * Construct a ModelPermission object.
     * @param {Object} permissionData - The data for the model permission.
     * @param {string} permissionData.id - The ID of the model permission.
     * @param {string} permissionData.object - The object type.
     * @param {number} permissionData.created - The Unix timestamp for when the model permission was created.
     * @param {boolean} permissionData.allow_create_engine - Whether creating engines is allowed.
     * @param {boolean} permissionData.allow_sampling - Whether sampling is allowed.
     * @param {boolean} permissionData.allow_logprobs - Whether logging log probabilities is allowed.
     * @param {boolean} permissionData.allow_search_indices - Whether searching indices is allowed.
     * @param {boolean} permissionData.allow_view - Whether viewing the model is allowed.
     * @param {boolean} permissionData.allow_fine_tuning - Whether fine-tuning the model is allowed.
     * @param {string} permissionData.organization - The organization that the permission applies to.
     * @param {string} permissionData.group - The group that the permission applies to.
     * @param {boolean} permissionData.is_blocking - Whether the permission is blocking.
     */
    constructor(permissionData) {
        this.id = permissionData.id;
        this.object = permissionData.object;
        this.created = permissionData.created;
        this.allowCreateEngine = permissionData.allow_create_engine;
        this.allowSampling = permissionData.allow_sampling;
        this.allowLogprobs = permissionData.allow_logprobs;
        this.allowSearchIndices = permissionData.allow_search_indices;
        this.allowView = permissionData.allow_view;
        this.allowFineTuning = permissionData.allow_fine_tuning;
        this.organization = permissionData.organization;
        this.group = permissionData.group;
        this.isBlocking = permissionData.is_blocking;
    }
}

class Model {
    /**
     * Construct a Model object.
     * @param {Object} modelData - The data for the model.
     * @param {string} modelData.id - The ID of the model.
     * @param {string} modelData.object - The object type.
     * @param {number} modelData.created - The Unix timestamp for when the model was created.
     * @param {string} modelData.owned_by - The owner of the model.
     * @param {Array<Permission>} modelData.permission - An array of strings representing the permissions for the model.
     * @param {string} modelData.root - The root model ID.
     * @param {string} modelData.parent - The parent model ID.
     */
    constructor(modelData) {
        this.id = modelData.id;
        this.object = modelData.object;
        this.created = modelData.created;
        this.ownedBy = modelData.owned_by;
        this.permission = modelData.permission.map(p => new ModelPermission(p));
        this.root = modelData.root;
        this.parent = modelData.parent;
    }
}

class ImageB64 {

    static array = []

    constructor(base_64_data, size, prompt, edits) {

        this.b64 = base_64_data;

        //if dev forgets to just pass the data in lets try to fix it
        if (typeof this.b64 == "object" && this.b64.b64_json) this.b64 = this.b64.b64_json;

        // this.buffer = Buffer.from(this.b64, 'base64');

        this.size = size;
        this.edits = edits || [];
        this.prompt = prompt || undefined;
        this.i = ImageB64.array.length;
        ImageB64.array.push(this);
        return this;
    }

    //buffer the b64 str if we have not yet.
    toBuffer() {
        this.buffer = this.buffer ||  Buffer.from(this.b64, 'base64');
        return this.buffer;
    }

    //path is relative to process Current working Dir fefults to prompt
    saveToDisk(_path) {

        if (!_path) _path = splitOnWhitespaceAndJoinWithUnderscore(this.prompt) + ".png"

        let p = joinPathToCWD(_path);

        this.toBuffer();

        fs.writeFileSync(p, this.buffer);

        let stat = fs.statSync(p);
        console.log(p, ", Stats: ", stat);

        return p;


    }

    sendExpressResponse(res) {
        this.toBuffer();
        res.set('Content-Type', 'image/png');
        res.send(this.buffer);
    }


    edit(prompt) {

    }
    variation(n) {

    }


}


class OpenAI {
    static CreateImageRequestSizeEnum = {
        _256x256: '256x256',
        _512x512: '512x512',
        _1024x1024: '1024x1024'
    };
    static CreateImageRequestResponseFormatEnum = {
        Url: 'url',
        B64Json: 'b64_json'
    };

    /**
     * initialise an api connection to api.openapi.com with your token
     * @param api_token - the api to
     */
    constructor(api_token) {


        this.apiKey = api_token;

        //api map structure

        //each level of depth represents the path of tha pi endpoint uri ie v1.images.edits -> /v1/images/edits
        //these are template whit http-method function that take appropriate parameters ie get and post

        //the apiMap object maps directly onto the api.openai.com endpoints offerings. so you can only learn that and not the shortcuts

        /**
         * a map of the implemented openai api
         * @memberOf OpenAI
         */
        this.apiMap = OAIAPI.apiMap
        //intuitive functions to call the api

        this.getModels = this.apiMap.v1.models.get  //(): This function could be used to retrieve a list of all available models.
        this.getModelInfo = this.apiMap.v1.models.getModel  //(modelId): This function could be used to retrieve information about a specific model, given its ID.
        this.generateCompletions = this.apiMap.v1.completions.post  //(body): This function could be used to generate completions for a given prompt using the specified model. The body parameter would contain the request body parameters for the API call.
        this.generateEdit = this.apiMap.v1.edits.post  //(body): This function could be used to generate an edit for the given input and instruction using the specified model. The body parameter would contain the request body parameters for the API call.
        this.generateImages = this.apiMap.v1.images.generations.post  //(body): This function could be used to generate images using the specified model. The body parameter would contain the request body parameters for the API call.
        this.editImage = this.apiMap.v1.images.edits.post  //(body): This function could be used to edit an image using the specified model. The body parameter would contain the request body parameters for the API call.
        this.generateImageVariations = this.apiMap.v1.images.variations.post //(body): This function could be used to generate variations of an image using the specified model. The body parameter would contain the request body parameters for the API call.

    }

    async listModels() {

        let models = await this.apiMap.v1.models.get();


        models.forEach(m => {
            console.log("Found model to play with: ", m.id);
        })


    }

    async helloText() {
        let d = this.apiMap.v1.completions.post({
            model: "babbage",
            prompt: "Hi from the syonfox/OpenAIAssistant: "
        })

        console.log(d);

    }

    async helloImg(prompt = "A self portrait of an Open AI Assistant") {
        let size = OpenAI.CreateImageRequestSizeEnum._256x256;

        let d = await this.apiMap.v1.images.generations.post({
            "prompt": prompt,
            "n": 1,
            "size": size,
            response_format: OpenAI.CreateImageRequestResponseFormatEnum.B64Json
        })

        let imgs = d.data.map(d => new ImageB64(d.b64_json, size, prompt))


        imgs.forEach(i => {
            console.log("Saving", i.prompt)
            i.saveToDisk();
        })


        console.log(d);

    }




    async simpleImg(prompt = "A self portrait of an Open AI Assistant") {
        let size = OpenAI.CreateImageRequestSizeEnum._512x512;

        let d = await this.apiMap.v1.images.generations.post({
            "prompt": prompt,
            "n": 1,
            "size": size,
            response_format: OpenAI.CreateImageRequestResponseFormatEnum.B64Json
        })

        let imgs = d.data.map(d => new ImageB64(d.b64_json, size, prompt))


        imgs.forEach(i => {
            console.log("Saving", i.prompt)
            i.saveToDisk();
        })


        console.log(d);

    }









    // openChat(name, bot, personality) {
    //
    //     let chat = {
    //         name, bot, personality,
    //         history: [],
    //         msg: "",
    //         response: ""
    //     }
    //
    //
    //
    //
    //
    //
    // }
    //


    async refienPromptForImage(prompt) {

        this.generateCompletions({
            model
        })


    }


    async imgRefine(prompt, n=2, promptSelect, imgSelect, variationSelect) {

        //this pipeline is an attempt to generate a good image with basic info
        //the proccess entailes first refineing the prompt with davinci then
        // generationg an image

        //then if the image is aproved genorating som variations based on it to select the final result from






    }



    newAssistant(options) {
        return new Assistant(this, options);
    }
}

// a refinement is a way of improving a prompt.
class Refinement {

    static builtIn = {
        dalle: {
            replace: "[description of the image you want]",
            prompt: "I'm trying to generate an image with DALL-E, but the results aren't quite what I'm looking for. " +
                "Can you help me refine my prompt to get the image I'm imagining? I'm thinking of something like a " +
                "[description of the image you want], but I'm having trouble finding the right words to capture it accurately. " +
                "Please only provide the updated prompt."
        },

        davinci: {
            replace: "[description of the image you want]",
            prompt: "I'm trying to generate an image with DALL-E, but the results aren't quite what I'm looking for. " +
                "Can you help me refine my prompt to get the image I'm imagining? I'm thinking of something like a " +
                "[description of the image you want], but I'm having trouble finding the right words to capture it accurately. " +
                "Please only provide the updated prompt."
        },

        takeaways: {
            replace: "[text]",
            prompt: "Write a list of the most important takeaways of the text bellow.\n\n[text]"
        },

        summary:{
            replace: "[text]",
            prompt: "Please write a clear and concise summer of the text bellow.\n\n[text]"
        },

    }
    constructor(instructions, replace_placholder, options) {

        this.instructions = instructions

        //if insert is in middle perform

    }
}

//a prompt is awaiting response.
class Prompt {

    static B

    constructor(openai, prompt, options) {

        this.ai = openai;
        this.prompt = prompt;
        this.options= options || {};



    }

    refine(instructions) {
        //use the edits api?

    }

    refineForText(){}
    refineForEdit(){}
    refineForImg(){


        let instructions = {
        }

    }
}


/**
 * As a large language model, I am trained to understand and generate human-like text and can perform a wide range of language-related tasks. Some specific functions that I am well-suited for include:
 *
 *     Answering questions: I can understand and provide accurate answers to a wide range of questions on a variety of topics.
 *
 *     Generating text: I can generate coherent and coherent text on a given topic or in response to a prompt.
 *
 *     Summarization: I can generate summaries of longer texts by identifying the most important points and generating a shorter version of the text.
 *
 *     Translation: I can translate text from one language to another with a high level of accuracy.
 *
 *     Sentiment analysis: I can analyze the sentiment of text and identify whether it is positive, negative, or neutral.
 *
 *     Text classification: I can classify text into different categories based on its content.
 *
 * Overall, my capabilities as a language model make me well-suited for a wide range of language-related tasks, including answering questions, generating text, summarization, translation, sentiment analysis, and text classification.
 */
class Assistant {
    constructor(openai, options) {



        this.brain = {
            text: {},
            voice: {},
            img: {},
            analysis: {},
            predict: {}
        }

    }

    compleation(text, options) {

    }

    edit(instructions, text, options) {

    }

    // todo
    // code() {}
    // image() {}


    answer(question) {

    }

    generate(prompt) {
    }

    sumerize(text) {
    }

    sentiment(text) {
    }

    clasifiction(test) {
    }


}


export {
    OpenAI,
    Assistant,
    // APIOpenAI,
}

export default OpenAI
