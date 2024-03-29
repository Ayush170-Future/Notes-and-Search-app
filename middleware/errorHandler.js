const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch(statusCode) {
        case 400:
            res.status(400).json({
                title: "Bad Request",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case 401:
            res.status(401).json({
                title: "Unauthorized",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case 404:
            res.status(404).json({
                title: "Not Found",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case 500:
            console.error("Unhandled error:", err);
            res.status(500).json({
                title: "Internal Server Error",
                message: "Something went wrong!",
                stackTrace: err.stack,
            });
            break;
        default:
            console.error("Unhandled error:", err);
            res.status(500).json({
                title: "Internal Server Error",
                message: "Something went wrong!",
                stackTrace: err.stack,
            });
            break;
    }
};

module.exports = errorHandler;
