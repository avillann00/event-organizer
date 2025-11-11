const express = require('express');
const Stripe = require('stripe');
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static('public'));

const stripe = new Stripe('key here')

const YOUR_DOMAIN = "http://localhost:5173";

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [

        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });
    res.redirect(303, session.url);
});