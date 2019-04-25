#!/usr/bin/env node

import * as process from 'process';

//MODELS
import { DefaultSettings, UserSettings } from './models/settings';
import { Flags } from './models/flags';
import { CommandPayload, Command } from './models/command';

//UTILS
import { mappings } from './constants/mappings';
import { COMMANDS, NAME, FLAGS } from './constants/constants';
import { logger } from './lib/logger';
import { getDefaultSettings, getUserSettings, getSettingsAccordingToFlag } from './lib/settings';
import { getFlags } from './lib/flags';

async function executeSelectedCommand(commandArguments: string[], settings: UserSettings, commandPath: string) {
  const { command }: { command: Command } = await import(commandPath);
  command({
    settings,
    commandArguments,
  });
}

async function openConfiguration({
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
  //   const confCommand: any = import('./commands/conf');
  //   console.log(confCommand);
  //   confCommand('./commands/conf')(defaultSettings, userSettings, message, projectConfiguration);
  const { command }: { command: Command } = await import('./commands/conf');
  command({
    settings: user,
    defaults,
    commandArguments: [],
    user,
    message,
    projectConfiguration,
  });
}
async function openHelp({ user, defaults }: { user: UserSettings; defaults: DefaultSettings }) {
  const { command }: { command: Command } = await import('./commands/help');
  command({});
}

function init() {
  const defaultSettings: DefaultSettings = getDefaultSettings();
  const userSettings: UserSettings | null = getUserSettings();

  if (userSettings) {
    if (process.argv.length > 2) {
      const command: string = process.argv[2];
      const commandArguments: string[] = process.argv.slice(3);

      const flags: Flags = getFlags(commandArguments);

      if (command === COMMANDS.CONFIG) {
        openConfiguration(flags[FLAGS.CUSTOM] !== undefined);
      } else if (mappings[command]) {
        const settings: UserSettings = getSettingsAccordingToFlag(userSettings.settings, flags);
        executeSelectedCommand(commandArguments, settings, `./commands/${mappings[command]}`);
      } else {
        logger(`${NAME}: command not found`, 'yellow');
        openHelp();
      }
    } else {
      openHelp();
    }
  } else {
    openConfiguration(false, 'It appears you have not configured the cli yet, please answer the following questions');
  }
}

init();
