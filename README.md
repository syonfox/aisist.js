# Build and Deploy Your Own ChatGPT AI Application That Will Help You Code
![Open AI CodeGPT](https://i.ibb.co/LS4DRhb/image-257.png)

# Welcome to Open AI Assistant 

This repository has 2 components A backend server implementation designed to interface directly with open ai.

A frontend client that will allow users to engage with your ai assistant and perform  a variety of tasks.

In order to support this we first need an elegant way of opening an api connection to OPenAi's servers and thus the models.

We also may want to develop an intermediate way of obfuscating our users prompts to avoid censorship and unduly imposition put on open ai

We should pass on liability in both regard AS a developer i can claim no responsibility for ether the inputs of my users or the output of the ai modal.

using this software you acknowledge that you freely engage with the other party and if you do not wish to that is you precognitive.


# Goals.

## provide a simple api

    open ai's igenorated implementation is overly complex and intruduces a little to many options
    our first contrubution will be defining a simple apiMap object representing OpenApies schema
    We will then expand upon this to provide model introspection
    openai.apiMap.v1.models.get
    openai.apiMap.v1.models.model
    openai.apiMap.v1.compleations.post
    openai.apiMap.v1.edits.post
    openai.apiMap.v1.images.genorations.post
    openai.apiMap.v1.images.edits.post
    openai.apiMap.v1.images.variations.post
    ... todo finish


Here are some potential intuitive function names for each of these endpoints:

    getModels(): This function could be used to retrieve a list of all available models.
    getModelInfo(modelId): This function could be used to retrieve information about a specific model, given its ID.
    generateCompletions(body): This function could be used to generate completions for a given prompt using the specified model. The body parameter would contain the request body parameters for the API call.
    generateEdit(body): This function could be used to generate an edit for the given input and instruction using the specified model. The body parameter would contain the request body parameters for the API call.
    generateImages(body): This function could be used to generate images using the specified model. The body parameter would contain the request body parameters for the API call.
    editImage(body): This function could be used to edit an image using the specified model. The body parameter would contain the request body parameters for the API call.
    generateImageVariations(body): This function could be used to generate variations of an image using the specified model. The body parameter would contain the request body parameters for the API call.

![AI Assistant Portrait](openai_assistant_portrait.png)
openai_assistant_portrait.png

### Launch your development career with project-based coaching - https://www.jsmastery.pro
