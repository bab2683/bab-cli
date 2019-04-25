const {
	createDirectory,
	directoryExists,
	getCurrentDirectoryBase
} = require("../../lib/directories");
const { createFile, getFile } = require("../../lib/files");
const { logSeparator } = require("../../lib/logger");
const { NAME } = require("../../constants/constants");
const errors = require("../../lib/errors");

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

function createFilesAccordingToTemplate(templates, name, filePath, testFolder, test_folder_name) {
	templates.forEach(current => {
		const { filename, template, test } = current(name, formatName(name));
		createFile({
			name:
				test && testFolder
					? `${filePath}/${test_folder_name}/${filename}`
					: `${filePath}/${filename}`,
			content: template,
			filename
		});
	});
}

module.exports = (args, settings) => {
	const { template_path, test_folder, base_folder, test_folder_name } = settings;

	const templatesFile = getFile(template_path, "js");

	if (templatesFile.data) {
		const options = parseArguments(args, base_folder);

		const { name, segments } = options;

		if (!segments[segments.length - 1].exists) {
			prepareFolders(segments);
			if (test_folder) {
				createDirectory(`${segments[segments.length - 1].segment}/${test_folder_name}`);
			}
			logSeparator();

			const templates = require(template_path);
			createFilesAccordingToTemplate(
				templates,
				name,
				segments[segments.length - 1].segment,
				test_folder,
				test_folder_name
			);
		} else {
			errors("Folder already exists, operation aborted");
		}
	} else {
		errors(`No templates file found, please correct the path by typing: ${NAME} conf`);
	}
};
