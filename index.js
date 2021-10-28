const express = require('express')
const path = require('path')
const app = express()

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
} else {
    require("dotenv").config();
}

const pool = require('./db')

app.get('/score', async (req, res) => {
    try {
        const scores = await pool.query('SELECT * FROM scores')
        res.json(scores.rows)
    } catch (err) {
        console.log(err.message)
    }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})
