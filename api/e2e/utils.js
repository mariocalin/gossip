module.exports = {
  failTest: (message) => {
    console.error(message);
    throw new Error(message);
  }
};
