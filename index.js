const express = require('express')
const path = require('path')
const app = express()

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));
} else {
    require("dotenv").config();
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})

