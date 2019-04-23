const { logger } = require("./logger");

module.exports = function(message) {
	logger(message, "red");
	process.exit();
};
