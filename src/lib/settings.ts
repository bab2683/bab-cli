import { file } from 'user-settings';

import { DefaultSettings, UserSettings } from '../models/settings';
import { Flags } from '../models/flags';

import { defaultSettings } from '../settings';
import { COMMANDS, NAME, FLAGS, SETTINGS } from '../constants/constants';
import { logError } from './errors';
const { get, set } = file('.babcli_settings');

export function getDefaultSettings(): DefaultSettings {
  return {
    ...defaultSettings,
  };
}
export function getUserSettings(): UserSettings {
  const userSettings: UserSettings = get(SETTINGS.INITIAL) || {};
  if (userSettings) {
    userSettings[SETTINGS.CUSTOM] = get(SETTINGS.CUSTOM) || {};
  }
  return userSettings;
}
export function saveUserSetting(key: string, value: any): void {
  set(key, value);
}
export function getSettingsAccordingToFlag(userSettings: UserSettings, flags: Flags): UserSettings {
  if (flags[FLAGS.CUSTOM]) {
    if (userSettings[SETTINGS.CUSTOM] && userSettings[SETTINGS.CUSTOM][flags[FLAGS.CUSTOM]]) {
      return userSettings[SETTINGS.CUSTOM][flags[FLAGS.CUSTOM]];
    }
    logError(
      `the custom configuration requested does not exists, to create a new configuration type: ${NAME} ${
        COMMANDS.CONFIG
      } ${FLAGS.CUSTOM}`,
    );
  }
  return userSettings;
}
export function parseDefaultSettings(): UserSettings {
  return Object.keys(defaultSettings).reduce((parsedSettings: UserSettings, current: string) => {
    parsedSettings[current] = defaultSettings[current].default;
    return parsedSettings;
  }, {});
}
