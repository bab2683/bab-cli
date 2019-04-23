const { mkdirSync, statSync } = require("fs");
const path = require("path");

module.exports = {
	getCurrentDirectoryBase: () => {
		return path.basename(process.cwd());
	},
	directoryExists: filePath => {
		try {
			return statSync(filePath).isDirectory();
		} catch (err) {
			return false;
		}
	},
	createDirectory: name => {
		mkdirSync(name);
	}
};
