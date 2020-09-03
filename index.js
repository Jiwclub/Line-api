const axios = require("axios");

const line = require("@line/bot-sdk");
const express = require("express");

// create LINE SDK config from env variables
const config = {
    channelAccessToken: "/htl6JwpXV7a3hKMuNfVtDBvt5GLIWf5g/xIP02SDXW3vE5d7g6ldRKYohk0ODBpXXzQ/Oo+vz2FwgpKzXh53zHmTU71oKca93U9OiAT0E0IGRP3blm6xUQbW7QSicdvwtJ1x95nmB4EYXEVzO/GygdB04t89/1O/w1cDnyilFU=",
    channelSecret: "20ce5613b60bcaed70f38b436460c79a",
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/callback", line.middleware(config), (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// event handler
async function handleEvent(event) {
    console.log("handleEvent");
    if (event.type !== "message" || event.message.type !== "text") {
        // ignore non-text-message event
        return Promise.resolve(null);
    } else if (event.type === "text" || event.message.text === "Hello1") {
        //ตอบช้า
        const payload = {
            type: "text",
            text: "Hello From Heroku Server.",
        };
        const params = {
            message: "บอทส่งตอบข้อความช้า 10 วิ",
        };
        const data = Object.entries(params)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join("&");

        const options = {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Authorization: "Bearer g24FvJy8zkW9k5csjkHvAJkf2BmabJqvoOf8GyamII2",
            },
            data,
            url: "https://notify-api.line.me/api/notify",
        };
        setTimeout(async() => {
            console.log("setTimeout");
            const response = await axios(options); // wrap in async function
            console.log(response);
        }, 5000);

        // return client.replyMessage(event.replyToken, payload);
    }

    // // create a echoing text message
    const echo = {
        type: "text",
        text: event.message.text,
    };

    // // use reply API
    return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});