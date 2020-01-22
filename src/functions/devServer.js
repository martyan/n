const dotenv = require('dotenv').config()
const next = require('next')
const routes = require('./routes')
const express = require('express')
const admin = require('firebase-admin')

admin.initializeApp()

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: './src/app' })
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
    const server = express()

    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))

    server.get('*', handler)

    server.listen(port, err => {
        if(err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})
