#!/usr/bin/env node
import * as process from 'process';
import { Command } from './models/command';
import { COMMANDS, FLAGS, NAME } from './constants/constants';
import { DefaultSettings, UserSettings } from './models/settings';
import { Flags } from './models/flags';
import { getDefaultSettings, getSettingsAccordingToFlag, getUserSettings } from './lib/settings';
import { getFlags } from './lib/flags';
import { logger } from './lib/logger';
import { mappings } from './constants/mappings';

function getCommand(commandPath: string): Promise<{ command: Command }> {
  return import(commandPath);
}

function executeSelectedCommand({ payload, commandPath }: { payload?: any; commandPath: string }) {
  getCommand(commandPath).then(({ command }) => {
    command(payload);
  });
}

function openConfiguration({
  projectConfiguration,
  message,
  user,
  defaults,
}: {
  projectConfiguration: boolean;
  message: string;
  user: UserSettings;
  defaults: DefaultSettings;
}) {
  executeSelectedCommand({
    payload: {
      defaults,
      user,
      message,
      projectConfiguration,
    },
    commandPath: './commands/config',
  });
}
function openHelp() {
  executeSelectedCommand({ commandPath: './commands/help' });
}

function init(): void {
  const defaultSettings: DefaultSettings = getDefaultSettings();
  const userSettings: UserSettings | null = getUserSettings();

  if (userSettings) {
    if (process.argv.length > 2) {
      const command: string = process.argv[2];
      const commandArguments: string[] = process.argv.slice(3);

      const flags: Flags = getFlags(commandArguments);

      if (command === COMMANDS.CONFIG) {
        openConfiguration({
          projectConfiguration: flags[FLAGS.CUSTOM] !== undefined,
          defaults: defaultSettings,
          user: userSettings,
          message: '',
        });
      } else if (mappings[command]) {
        const settings: UserSettings = getSettingsAccordingToFlag(userSettings, flags);

        executeSelectedCommand({
          payload: { commandArguments, settings, flags },
          commandPath: `./commands/${mappings[command]}`,
        });
      } else {
        logger(`${NAME}: command not found`, 'yellow');
        openHelp();
      }
    } else {
      openHelp();
    }
  } else {
    openConfiguration({
      projectConfiguration: false,
      message: 'It appears you have not configured the cli yet, please answer the following questions',
      defaults: defaultSettings,
      user: userSettings,
    });
  }
}

init();
