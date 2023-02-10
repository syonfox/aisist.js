class Iterable {
    constructor(items) {
        this.items = items;
    }

    [Symbol.iterator]() {
        let index = 0;
        const items = this.items;
        return {
            next() {
                return index < items.length ?
                    {value: items[index++], done: false} :
                    {done: true};
            }
        };
    }

    removeBack() {
        return this.items.pop();
    }

    peekFront() {
        return this.items[0];
    }

    peekBack() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

class Iterable {
    constructor(items) {
        this.items = items;
    }

    [Symbol.iterator]() {
        let index = 0;
        const items = this.items;
        return {
            next() {
                return index < items.length ?
                    {value: items[index++], done: false} :
                    {done: true};
            }
        };
    }

    removeBack() {
        return this.items.pop();
    }

    peekFront() {
        return this.items[0];
    }

    peekBack() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}


class Deque extends Array {
    // ... existing methods
    constructor(...args) {
        super(...args)
    }

    addFront(element) {
        this.unshift(element);
    }

    addBack(element) {
        this.push(element);
    }

    removeFront() {
        return this.shift();
    }

    removeBack() {
        return this.pop();
    }

    peekFront() {
        return this[0];
    }

    peekBack() {
        return this[this.length - 1];
    }

    isEmpty() {
        return this.length === 0;
    }

    size() {
        return this.length;
    }
}

/**
 * The AIM module allows purpose to be aimed over longer durations of time.
 */
class AIMemory {
    /**
     * An class to represent an ai conversational memory
     * this involve a mechanisim for History, Memory Stack
     * as well as a  few output funcyion to display/ render the history.
     */
    constructor() {
        this.history = [];
        this.mem = [];

        this.instructions = ""; // a string to represent the system this memor is operation within

        this.name = "Assistant";

        this.user = "";  // we want to keep track of the session id so openai can internally connect the dots.
    }

    newMsg(prompt, response) {
        history.pushState({
            now: Date.now(),
            prompt,
            response,
        })
    }

    sumerize


}


// pment for anyone who doesn't check Techniques! Prompt Engineering has Evolved! Directives and Tool based chat is the future! They can even build prompts, or just do what you want.
// ﻿
// a DIRECTIVE is a term used to tell chat you are instructing it to do X. A list of Directives might include "write, do, type, etc." and they are followed by : if there are extra conditions to be followed. Chat seems to read them in order, and also follow basic logical operations such as AND OR XAND (for Not AND) and so on.
// ﻿
// A few tips: do not make it too complex, if you write a function with too much going on it gets garbled in the processing. Remember, GPT is a Language Model, not a program interpreter. Keep it simple, work out from the basics (mechanics and IO style) to the more complex rules.
// ﻿
// There is also "Multi Prompting" that is showing some promising effects with designing really complex stuff like DND games. This works by "setting the stage" to tell chat the basics and not to start the game till we request to. Then we feed it the rules, and request to start!
// ﻿
// The Multi-Prompting technique also appears to work with training your session with updated info that it doesn't have. You can use it to condense HUGE articles, YouTube transcripts, etc. You could even do something like update outdated Python libraries (using patch notes) or so on, and even more! If using it to condense info, it probably isn't cheap so I wouldn't abuse this if utilized for education! ask 1000 questions about the information!!
let prompts = [
    `
    I am going to feed you some data, respond with only "okay" and a number of ideas tracked
    until i say "complete" at which point give a highly detailed summary of the data.
    
    `, `

`, `

`, `

`, `

`, `

`, `

`, `

`, `

`, `

`, `

`, `

`,


]
