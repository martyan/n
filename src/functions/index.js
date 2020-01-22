const path = require('path')
const dotenv = require('dotenv').config()
const next = require('next')
const routes = require('./routes')
const express = require('express')
const cors = require('cors')({ origin: true })
const functions = require('firebase-functions')
const admin = require('firebase-admin')

const stripe = require('stripe')(process.env.STRIPE_API_KEY_SECRET)
const createPaymentHandler = require('./common').createPaymentHandler
const createOrderHandler = require('./common').createOrderHandler

admin.initializeApp()

const dev = process.env.NODE_ENV !== 'production'
const conf = {distDir: `${path.relative(process.cwd(), __dirname)}/next`}
const app = next({dev, conf})
const handler = routes.getRequestHandler(app)

const server = express()

server.use(cors)
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.post('/api/payment', createPaymentHandler(stripe))
server.post('/api/order', createOrderHandler(admin))

server.get('*', (req, res) => {
    console.log('File: ' + req.originalUrl) // log the page.js file that is being requested
    app.prepare().then(() => handler(req, res))
})

exports.next = functions.https.onRequest(server)
