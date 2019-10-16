class ValidationError extends Error {
    constructor(errorObject) {
        super(errorObject.message)
        this.status = errorObject.httpStatus,
            this.responseError = {
                errorClass: 'Validation Error',
                code: errorObject.code,
                message: errorObject.message,
                errorTime: Date.now()
            }
    }
}
class PermissionError extends Error {
    constructor(errorObject) {
        super(errorObject.message)
        this.status = errorObject.httpStatus,
            this.responseError = {
                errorClass: 'Permission Error',
                code: errorObject.code,
                message: errorObject.message,
                errorTime: Date.now()
            }
    }
}
class DatabaseError extends Error {
    constructor(errorObject) {
        super(errorObject.message)
        this.status = errorObject.httpStatus,
            this.responseError = {
                errorClass: 'Database Error',
                code: errorObject.code,
                message: errorObject.message,
                errorTime: Date.now()
            }
    }
}

module.exports = {
    ValidationError,
    PermissionError,
    DatabaseError
}