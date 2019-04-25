const { logger } = require("./logger");
const { writeFile, readFileSync } = require("fs");

module.exports = {
	getFile: function(path, format = "json") {
		let file;
		try {
			file = readFileSync(path, "utf8");
			return { data: format === "json" ? JSON.parse(file) : file };
		} catch (error) {
			if (error.code === "ENOENT") {
				return { error: "FILE_NOT_FOUND" };
			} else {
				logger(error, "red");
				return { error: "GENERIC_ERROR" };
			}
		}
	},
	createFile: function({ name, content, callback, filename }) {
		const data = new Uint8Array(Buffer.from(content));
		writeFile(name, data, err => {
			if (err) {
				logger(`Could not create file with name: ${name}, error: ${err}`, "red");
			} else {
				callback && callback();
			}
		});
		logger(`Created file: ${filename}`, "green", false);
	}
};
