
// Custom error class

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    meta: {
      success: false,
      timestamp: new Date().toISOString(),
    },
    error: {
      message: err.message || "Internal Server Error",
      statusCode,
      details: err.errors || null, // Pass additional error details if available
    },
    data: null, // Data is null in case of an error
  });
};

export { errorHandler };
