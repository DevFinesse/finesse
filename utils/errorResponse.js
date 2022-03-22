class ErrorResponse extends Error {
    constructor(message, statusCode){
        //The super keyword is used to access and call functions on an object's parent.
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;