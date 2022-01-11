const globalErrorHandler = (error, req, res, next) => {
  // const errorObject = JSON.parse(error.message);
  res.status(400).json(error.message);
};

module.exports = globalErrorHandler;
