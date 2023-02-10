const accountSid = 'AC12231abbd882a4aafd9802428c09cbe9';
const authToken = '[AuthToken]';

var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken, {
    // lazyLoading: true,
    region: 'US1',

});

const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        to: '+16395330016'
    })
    .then(message => console.log(message.sid))
    .done();


const twilio = {


    subscribe(handler) {


    },

    send(phone, msg, cb) {

        return client.messages
            .create({
                body: msg,
                from: '+14314304242',
                to: phone
            })
            .then(message => {
                console.log("sent msg: ", message.sid)
                if (typeof cb == "function") cb(message)
            });

    },

    addExpressRoutes(router) {
        router.post('/message', twilio.webhook(), (req, res) => {
            // Twilio Messaging URL - receives incoming messages from Twilio
            const response = new MessagingResponse();

            response.message(`Your text to me was ${req.body.Body}.
                    Webhooks are neat :)`);

            res.set('Content-Type', 'text/xml');
            res.send(response.toString());
        });
    }


}


module.exports = twilio;
