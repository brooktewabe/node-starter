class ApiError extends Error{
    constructor(statusCode,message,isOperational = true, stack= ''){
        // calling the parent error class to assign error value
        super(message)
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
            this.statusCode= statusCode
            this.isOperational=isOperational
        }
    }
}

module.exports= ApiError