const express = require('express')
const mongoose = require('mongoose')
const blogRouter = require("./routes/blog.route")
const config  = require("./config/config")
const {errorHandler,errorConverter} = require("./middlewares/error")

const app = express()

mongoose
    .connect(config.dbConnection)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err))

// Bodyparser middleware
app.use(express.json())
app.use(blogRouter)
// converter should be before handler since it handles those that are not handled intentionally
app.use(errorConverter)
app.use(errorHandler)

app.listen(config.port, () => {
    console.log("Server started on port 3000")
})