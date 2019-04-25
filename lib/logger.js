const chalk = require("chalk");
const { NAME } = require("../constants/constants");

function logSeparator() {
	console.log("");
}
function logger(message, color = null, spaces = true, prefix = true) {
	const parsedMessage = `${prefix ? `${NAME} - ` : ""}${message}`;

	spaces && console.log("");
	if (color && chalk[color]) {
		console.log(chalk[color](parsedMessage));
	} else {
		console.log(parsedMessage);
	}
	spaces && console.log("");
}

module.exports = {
	logSeparator,
	logger
};
