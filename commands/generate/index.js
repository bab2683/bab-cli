const {
	createDirectory,
	directoryExists,
	getCurrentDirectoryBase
} = require("../../lib/directories");
const { createFile, getFile } = require("../../lib/files");
const { logger, logSeparator } = require("../../lib/logger");
const { NAME } = require("../../constants");

function parsePath(destination) {
	const filePath = destination[0] === "/" ? destination.slice(1) : destination;

	if (filePath.indexOf("/") > -1) {
		const splitted = filePath.split("/");
		const name = splitted[splitted.length - 1];
		return {
			name,
			fullPath: filePath,
			segments: splitted.reduce((segments, current) => {
				const currentPath = segments[segments.length - 1]
					? `${segments[segments.length - 1].segment}/${current}`
					: current;
				return segments.concat([
					{
						exists: directoryExists(currentPath),
						name: current,
						segment: currentPath
					}
				]);
			}, [])
		};
	}
	return {
		name: filePath,
		fullPath: filePath,
		segments: [{ exists: directoryExists(filePath), name: filePath, segment: filePath }]
	};
}
function getOptions(args) {}

function parseArguments(args, baseFolder) {
	return {
		...parsePath(baseFolder + args[0]),
		currentPath: getCurrentDirectoryBase()
	};
}
function prepareFolders(segments) {
	segments.forEach(current => {
		if (!current.exists) {
			createDirectory(current.segment);
			logger(`Folder created: ${current.segment}`, "green", false);
		}
	});
}
function formatName(name) {
	const lowerCase = name.toLowerCase();
	const splitted = lowerCase.split("-");
	return splitted.reduce((string, current) => {
		const firstLetter = current[0].toUpperCase();
		const name = firstLetter + current.slice(1);
		return (string += name);
	}, "");
}

function createFilesAccordingToTemplate(templates, name, filePath, testFolder) {
	templates.forEach(current => {
		const { filename, template, test } = current(name, formatName(name));
		createFile(
			test && testFolder ? `${filePath}/__test__/${filename}` : `${filePath}/${filename}`,
			template
		);
		logger(`Created file: ${filename}`, "green", false);
	});
}

module.exports = (args, settings) => {
	console.log("settings in generate file", settings);

	const { template_path, test_folder, base_folder } = settings;

	const templatesFile = getFile(template_path, "js");

	if (templatesFile.data) {
		const options = parseArguments(args, base_folder);

		const { name, segments } = options;

		if (!segments[segments.length - 1].exists) {
			prepareFolders(segments);
			if (test_folder) {
				createDirectory(`${segments[segments.length - 1].segment}/__test__`);
			}
			logSeparator();

			const templates = require(template_path);
			createFilesAccordingToTemplate(
				templates,
				name,
				segments[segments.length - 1].segment,
				test_folder
			);
		} else {
			logger("Folder already exists, operation aborted", "red");
		}
	} else {
		logger(`No templates file found, please correct the path by typing: ${NAME} conf`, "red");
	}
};
