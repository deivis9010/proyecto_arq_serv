class HttpError extends Error {
    constructor(code, message) {
        super(message);
        this.status = code;
        this.name = 'HttpError';
        this.message = message;
    }
}

module.exports = HttpError;
