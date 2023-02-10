import readline from "readline";


/**
 * AIIA is pronounced as "ay-yuh".
 * AIIA stands for "Artificial Intelligence and Information Association". It is a professional association that promotes
 * the use and development of artificial intelligence and related technologies.
 * Artificial Intelligent Interactive Assistant
 *
 *
 *
 */
class Aiia {

    // constructor(config) {
    constructor(openai, config) {
        this.api = openai;
        this.history = [];

        this.instructions = config.instructions ||
            "The following is a conversation with an AIIA assistant able to understand and response to natural language. " +
            "She is honest, creative, clever, and very friendly. She breaks down and probes at a question when uncertain " +
            "and gives concise context aware answers.\n\n"


        // config = config || {
        //     mode: "compleation",
        //     model: "text-davinci-003",
        //     instructions: "Please continue the ne"
        // }
    }


    async chat(message, aiName = 'AIIA', history_n = 2, maxLength = 400) {
        this.history.push({
            type: 'user',
            message: message,
        });
        let prompt = this.instructions;

        // "The following is a conversation with an AIIA assistant able to understand and response to natural language. She is honest, creative, clever, " +
        // "and very friendly. She breaks down and probes at a question when uncertain and gives concise context aware answers.\n\n"

        // "I'm an AI that understands natural language and provides accurate, context-aware answers. Feel free to ask me anything."
        // Here is an optimized version of the prompt instruction for the AIIA assistant:
        // "Welcome to the AIIA assistant! I am a natural language understanding AI that is here to help you with your questions and provide accurate and context-aware answers. I am honest, creative, and very friendly. If I am uncertain about a question, I will do my best to probe for more information and provide a clear and concise answer. Please feel free to ask me anything, and I will do my best to assist you. How can I help you today?"


        for (let i = 1; i <= history_n; i++) {
            const historyIndex = this.history.length - i;
            if (historyIndex >= 0) {
                const historyMessage = this.history[historyIndex];
                let truncatedMessage = historyMessage.message;
                if (truncatedMessage.length > maxLength) {
                    const halfLength = Math.floor(maxLength / 2);
                    truncatedMessage = truncatedMessage.slice(0, halfLength) + '...' + truncatedMessage.slice(-halfLength);
                }
                prompt += `\n${historyMessage.type}: ${truncatedMessage}`;
            }
        }

        prompt += "\n" + this.name + ": "
        console.log("Aiia request: ", prompt);

        const response = await this.api.completions.post({
            prompt: prompt,
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1, // maybe 0.95
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        let aiMessage = response.choices[0].text;

        this.history.push({
            type: 'aiia',
            prompt: prompt,
            message: aiMessage,
        })
        console.log("Aiia response: ", aiMessage);

        return this.history[this.history.length - 1];
    }


    attachCommandLine() {
        async function sendInput(input) {
            try {
                // history.push("\n\n" + input);
                const response = await ai.generateConversation(input);
                history.push('\n\n' + response);
                input = "";
                console.log('AI: ' + response);
                return response
            } catch (error) {
                console.error("could not proccess: ", input, error);
                return false;
            }

        }

        async function listenForInput() {
            // Initialize an empty string to store the input
            let input = '';

            // Create a readline interface to read input from stdin
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            // Add a 'line' event listener to the readline interface
            rl.on('line', (line) => {
                // Add the line to the input string
                let s = line.split("EOF");

                if (s.length < 2) {
                    input += line;
                    return;
                    //just add the line if no EOF;
                }

                s.forEach(async str => {
                    //the first one may have previos lines
                    if (!str) {
                        //ship empty strings if EOF is nto pasted as a chain
                        return;
                    }
                    input += str;
                    console.log("ME sending: ", input);

                    // let last 3 msgs
                    let history_n = 3;

                    let n = 3
                    if (history.length < history_n) {
                        n = history.length;
                    }
                    let prompt = "";
                    prompt += `Context Chat History(${n}): "`
                    let hist_str = ""
                    for (let i = history.length - n; i < history.length; i++) {
                        hist_str += '"' + history[i] + '"';
                        if (i != history.length - 1) {
                            hist_str += ", "
                        }
                    }


                    let max = 4096;
                    let hist_len = 400;
                    let instruction_len = 200;
                    let msg_len = 600;
                    let instructions = prompt;

                    // if(hist_str.length)
                    //todo finsih good history system
                    history.push(input); // we dont want to push everything but we also dont want history to include current msg.

                    // let n = history.length - 1;
                    // let prompt = "History: \n" + history[n - 2] + history[n - 1] + history[n];
                    prompt += "\nNew Msg: " + input;

                    console.debug("Sending Request with prompt: ", prompt);
                    let res = await sendInput(prompt);
                    if (!res) {
                        //failed to process inout
                    }
                    input = ""; // reset it since we are at eof so next file;
                })

            });

            // Add a 'close' event listener to the readline interface
            rl.on('close', async () => {
                // When EOF is reached, generate a response using the input
                try {
                    const response = await ai.generateConversation("PLEASE SUMMARIZE AND FINAL THOUGHTS IN 3000 tokens history.join(\n): " + history.join("\n"));
                    console.log('AI Final Thoughts: ' + response);
                } catch (error) {
                    console.error(error);
                }
            });
        }

        listenForInput()

    }
}
