const mongoose = require('mongoose')
const http = require('http')
const config = require("./config/config")
const app = require("./server")
const logger = require("./config/logger")

mongoose
    .connect(config.dbConnection)
    .then(() => 
        logger.info("MongoDB Connected"))
    .catch(err => 
        logger.error(err))

const httpServer = http.createServer(app);
const server = httpServer.listen(config.port, () => {
    // console.log(`Server started on port ${config.port}`)
    logger.info(`Server started on port ${config.port}`)
})

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info("Server closed")
            process.exit(1)
        })
    }
    else {
        process.exit(1)
    }
}

const unExpectedErrorHandler = (error) => {
    logger.error(error)
    exitHandler()
}
process.on("uncaughtException", unExpectedErrorHandler)
process.on("unhandledRejection", unExpectedErrorHandler)
// ctrl+c or kill command will trigger this event on linux
process.on("SIGTERM", ()=>{
    logger.info("SIGTERM recieved")
    if(server){
        server.close()
    }
})