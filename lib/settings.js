const userSettings = require("user-settings").file(".babcli_settings");
const defaultSettings = require("../settings/default_settings.json");
const { NAME } = require("../constants");
const error = require("./errors");

function getDefaultSettings() {
	return {
		...defaultSettings
	};
}
function getUserSettings(list) {
	let complete = true;

	const settings = list.reduce((obj, current) => {
		obj[current] = userSettings.get(current);
		if (obj[current] === undefined) {
			complete = false;
		}
		return obj;
	}, {});
	settings["projects"] = userSettings.get("projects") || {};

	return {
		settings,
		complete
	};
}
function saveUserSetting(key, value) {
	userSettings.set(key, value);
}
function getSettingsAccordingToFlag(userSettings, flags) {
	if (flags["project"]) {
		if (userSettings.projects && userSettings.projects[flags["project"]]) {
			return userSettings.projects[flags["project"]];
		}
		error(
			`the configuration for the project requested does not exists, to create a new configuration type: ${NAME} conf project`
		);
	}
	return userSettings;
}

module.exports = {
	getDefaultSettings,
	getUserSettings,
	saveUserSetting,
	getSettingsAccordingToFlag
};
