import os from 'os';
// Default Error Handler
export function defaultErrorHandler(err, req, res, next) {
    console.error(
        JSON.stringify(
            {
                message: err.message,
                stack: err.stack,
            },
            null,
            2
        )
    );
    const statusCode = err.status || 400;
    res.status(statusCode).json({
        message: err.message,
        debugInfo: os.hostname(),
    });
}
