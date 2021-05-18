// Express
const express = require('express')
const router = require('./router.js')
const app = express()
const port = 8555

// Express router
app.use(router)

app.listen(port, () => {
    console.log(`[*] Server listening on port ${port}`)
})