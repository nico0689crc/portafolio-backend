const unknownEndpoint = ({ next }) => {
  return next(new Error("Route not found."));
};

module.exports = unknownEndpoint;
