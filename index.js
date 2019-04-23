#!/usr/bin/env node

const process = require("process");

//UTILS
const mappings = require("./mappings");
const constants = require("./constants");
const { logger } = require("./lib/logger");
const {
	getDefaultSettings,
	getUserSettings,
	getSettingsAccordingToFlag
} = require("./lib/settings");
const { getFlags } = require("./lib/flags");

const defaultSettings = getDefaultSettings();
const userSettings = getUserSettings(Object.keys(defaultSettings));

if (userSettings.complete && process.argv.length > 2) {
	const command = process.argv[2];
	const commandArguments = process.argv.slice(3);

	if (command === "conf") {
		openConfiguration(commandArguments[0] === "project");
	} else if (mappings[command]) {
		const flags = getFlags(commandArguments);

		const settings = getSettingsAccordingToFlag(userSettings.settings, flags);
		const commandToExecute = require(`./commands/${mappings[command]}`);
		commandToExecute(commandArguments, settings);
	} else {
		logger(`${constants.NAME}: command not found`, "yellow");
		openHelp();
	}
} else if (!userSettings.complete) {
	openConfiguration(
		false,
		"It appears you have not configured the cli yet, please answer the following questions"
	);
} else {
	openHelp();
}
function openConfiguration(projectConfiguration, message = "") {
	require("./commands/conf")(
		defaultSettings,
		userSettings.settings,
		message,
		projectConfiguration
	);
}
function openHelp() {
	require("./commands/help")();
}
