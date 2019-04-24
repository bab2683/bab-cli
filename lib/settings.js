const userSettings = require("user-settings").file(".babcli_settings");
const defaultSettings = require("../settings/default_settings.json");
const { NAME, FLAGS, SETTINGS } = require("../constants");
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
	settings[SETTINGS.CUSTOM] = userSettings.get(SETTINGS.CUSTOM) || {};

	return {
		settings,
		complete
	};
}
function saveUserSetting(key, value) {
	userSettings.set(key, value);
}
function getSettingsAccordingToFlag(userSettings, flags) {
	if (flags[FLAGS.CUSTOM]) {
		if (userSettings.projects && userSettings.projects[flags[FLAGS.CUSTOM]]) {
			return userSettings.projects[flags[FLAGS.CUSTOM]];
		}
		error(
			`the custom configuration requested does not exists, to create a new configuration type: ${NAME} conf ${
				FLAGS.CUSTOM
			}`
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
