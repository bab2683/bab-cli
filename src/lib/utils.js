module.exports = {
	parsedefaultSettings: function(defaultSettings) {
		return Object.keys(defaultSettings).reduce((parsedSettings, current) => {
			parsedSettings[current] = defaultSettings[current].default;
			return parsedSettings;
		}, {});
	}
};
