class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //foward the message to the Error class
        this.code = errorCode;
    }
}

module.exports = HttpError;