import https from "https";

let OAIAPI = {

    apiMap: {
        v1: {

            models: {

                get: async () => {
                    let data = await this.request("get", "/v1/models")
                    return data.data.map(d => new Model(d));
                },

                getModel: async (model) => {
                    let data = await this.request("get", "/v1/models/" + model);

                    return new Model(data)

                }
            },


            completions: {
                post: (body) => {
                    this.request("post", '/v1/completions', body)
                }
            },

            edits: {

                post: (body) => {
                    this.request("post", '/v1/edits', body)
                }
            },

            images: {
                generations: {

                    post: async (body) => {
                        let data = await this.request("post", "/v1/images/generations", body);

                        return data;
                    }
                },
                edits: {


                    post: async (body) => {
                        let data = await this.requerst("post", "/v1/images/edits", body);

                        return data;
                    }
                },
                variations: {

                    post: async (body) => {

                        let data = await this.requerst("post", "/v1/images/variations", body);

                        return data;
                    }
                }
            }


        },
    },
    request(method, path, body) {
        // Return a new promise that will either be resolved or rejected based on the outcome of the HTTP request.
        return new Promise((resolve, reject) => {
            // Construct the full request URL by appending the endpoint path to the base API URL.
            let url = `https://api.openai.com${path}`;
            // If the method is "get" and a body object is provided, convert the body object to URL query parameters
            // and append them to the URL.
            if (method === 'get' && body) {
                url += '?' + new URLSearchParams(body).toString();
            }
            // Construct the options object for the request.
            const options = {
                method: method,
                hostname: 'api.openai.com',
                path: path,
                // Set the Authorization header with the API key.
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            };
            // If the method is "post" and a body object is provided, set the Content-Type header to "application/json".
            if (method === 'post' && body) {
                options.headers['Content-Type'] = 'application/json';
            }
            // Make the request using the http.request function and pass the options object.
            const req = https.request(options, (res) => {
                // Set the encoding for the response data to utf8.
                res.setEncoding('utf8');
                // Initialize an empty string to accumulate the response data.
                let data = '';
                // Listen for the "data" event, which is emitted when a chunk of data received from the server.When the "data" event is emitted, append the chunk of data to the data
                res.on('data', (chunk) => {
                    data += chunk;
                });
                // Listen for the "end" event, which is emitted when all the data has been received and the response is complete.
                // When the "end" event is emitted, parse the data string as JSON and resolve the promise with the resulting object.
                res.on('end', () => {
                    let json = JSON.parse(data);
                    console.debug("response: ", json);
                    resolve(json);
                });
            });
            // Listen for the "error" event, which is emitted if the request fails.
            // When the "error" event is emitted, log the error and reject the promise with the error.
            req.on('error', (error) => {
                console.error(error);
                reject(error);
            });
            // If the method is "post" and a body object is provided, write the body object as a JSON string to the request.
            if (method === 'post' && body) {
                req.write(JSON.stringify(body));
            }
            // End the request.
            req.end();
        });
    },
    getModels: this.apiMap.v1.models.get,  //(): This function could be used to retrieve a list of all available models.
    getModelInfo: this.apiMap.v1.models.getModel,  //(modelId): This function could be used to retrieve information about a specific model, given its ID.
    generateCompletions: this.apiMap.v1.completions.post,  //(body): This function could be used to generate completions for a given prompt using the specified model. The body parameter would contain the request body parameters for the API call.
    generateEdit: this.apiMap.v1.edits.post,  //(body): This function could be used to generate an edit for the given input and instruction using the specified model. The body parameter would contain the request body parameters for the API call.
    generateImages: this.apiMap.v1.images.generations.post,  //(body): This function could be used to generate images using the specified model. The body parameter would contain the request body parameters for the API call.
    editImage: this.apiMap.v1.images.edits.post,  //(body): This function could be used to edit an image using the specified model. The body parameter would contain the request body parameters for the API call.
    generateImageVariations: this.apiMap.v1.images.variations.post, //(body): This function could be used to generate variations of an image using the specified model. The body parameter would contain the request body parameters for the API call.



    // newAssistent() {
    //     return new AIIA(this)
    // }

}

export default OAIAPI;

//intuitive functions to call the api

// this.getModels = this.apiMap.v1.models.get  //(): This function could be used to retrieve a list of all available models.
// this.getModelInfo = this.apiMap.v1.models.getModel  //(modelId): This function could be used to retrieve information about a specific model, given its ID.
// this.generateCompletions = this.apiMap.v1.completions.post  //(body): This function could be used to generate completions for a given prompt using the specified model. The body parameter would contain the request body parameters for the API call.
// this.generateEdit = this.apiMap.v1.edits.post  //(body): This function could be used to generate an edit for the given input and instruction using the specified model. The body parameter would contain the request body parameters for the API call.
// this.generateImages = this.apiMap.v1.images.generations.post  //(body): This function could be used to generate images using the specified model. The body parameter would contain the request body parameters for the API call.
// this.editImage = this.apiMap.v1.images.edits.post  //(body): This function could be used to edit an image using the specified model. The body parameter would contain the request body parameters for the API call.
// this.generateImageVariations = this.apiMap.v1.images.variations.post //(body): This function could be used to generate variations of an image using the specified model. The body parameter would contain the request body parameters for the API call.


