import { Answers, prompt, Question } from 'inquirer';
import { DefaultSettings, SettingObject, UserSettings } from '../models/settings';
import { logger } from '../lib/logger';
import { parseDefaultSettings, saveUserSetting } from '../lib/settings';
import { SETTINGS } from '../constants/constants';
import { textSync } from 'figlet';

type ConfigurationPayload = (data: {
  message: string;
  defaults: DefaultSettings;
  user: UserSettings;
  projectConfiguration: boolean;
}) => void;

interface PromptSettings {
  defaults: DefaultSettings;
  projectConfiguration: boolean;
  projects: { [value: string]: UserSettings };
  questions?: any;
  project_name?: string;
}

function prepareGeneralPromptQuestions(defaults: DefaultSettings, settings: UserSettings) {
  function parseDataByType(type: string, initial: string | boolean) {
    switch (type) {
      case 'bool':
        return { type: 'list', choices: ['true', 'false'] };
      case 'input':
        return {
          type,
          default: initial,
        };
    }
  }
  function returnWhenParameterIfNeeded(fieldSettings: SettingObject) {
    if (fieldSettings.when) {
      return {
        when({ test_folder }: Answers) {
          return test_folder === 'true';
        },
      };
    }
    return {};
  }
  function createQuestion(option: string): Question {
    const common: Question = {
      default: defaults[option].default,
      message: `${defaults[option].question} ${
        defaults[option].default !== undefined && defaults[option].default !== ''
          ? `(default: ${defaults[option].default})`
          : ''
      }`,
      name: option,
      ...parseDataByType(
        defaults[option].type,
        settings && settings[option] ? settings[option] : defaults[option].default,
      ),
      ...returnWhenParameterIfNeeded(defaults[option]),
    };
    if (settings && settings[option] !== undefined) {
      common.message += `(selected: ${settings[option]})`;
    }
    return common;
  }
  return Object.keys(defaults).map(option => {
    return createQuestion(option);
  });
}

function getSettings(user: UserSettings) {
  const parsedDefaults = parseDefaultSettings();
  if (user) {
    return Object.assign(parsedDefaults, user);
  }
  return parsedDefaults;
}
function parseAnswers(defaults: DefaultSettings, answers: Answers) {
  function parseValueByType(value: string, type: string): string | boolean {
    let parsedValue: string | boolean = '';

    switch (type) {
      case 'bool':
        parsedValue = value === 'true';
        break;
      case 'input':
        parsedValue = value;
        break;
    }
    return parsedValue;
  }
  return Object.keys(defaults).reduce((settings: { name: string; value: string | boolean }[], current) => {
    if (current !== 'project_name') {
      settings.push({
        name: current,
        value: parseValueByType(answers[current], defaults[current].type),
      });
    }
    return settings;
  }, []);
}
function projectPrompt(projects: { [value: string]: UserSettings }) {
  return [
    {
      message: 'Select an existing project or create a new one',
      name: 'project',
      type: 'list',
      choices: [...Object.keys(projects), 'New'],
    },
    {
      message: 'Project name',
      name: 'project_name',
      type: 'input',
      validate(value: string) {
        if (value.length) {
          if (Object.keys(projects).indexOf(value) > -1) {
            return 'There is another project with this name';
          }
          if (value.match(/\s+/g)) {
            return 'Spaces are not allowed';
          }
          return true;
        } else {
          return 'Please enter a valid name';
        }
      },
      when({ project }: Answers) {
        return project === 'New';
      },
    },
  ];
}

function generalPrompt({ questions, defaults, projectConfiguration, projects, project_name }: PromptSettings) {
  prompt(questions)
    .then(answers => {
      const settingsObj: SettingObject = {};
      parseAnswers(defaults, answers).forEach(({ name, value }) => {
        settingsObj[name] = value;
      });
      if (projectConfiguration && project_name) {
        projects[project_name] = settingsObj;
        saveUserSetting(SETTINGS.CUSTOM, projects);
      } else {
        saveUserSetting(SETTINGS.INITIAL, settingsObj);
      }
      logger('Settings saved', 'green');
    })
    .catch(err => {
      logger(err, 'red');
    });
}

export const command: ConfigurationPayload = (data): void => {
  if (data) {
    const { message, defaults, user = {}, projectConfiguration } = data;
    logger(textSync('BabCli', { horizontalLayout: 'full' }), 'yellow', true, false);

    if (message !== '') {
      logger(message, 'magenta');
    }
    const payload: PromptSettings = {
      defaults,
      projectConfiguration,
      projects: user[SETTINGS.CUSTOM] || {},
    };
    delete user[SETTINGS.CUSTOM];

    if (projectConfiguration) {
      prompt(projectPrompt(payload.projects)).then(({ project, project_name }: Answers) => {
        if (project === 'New') {
          payload.questions = prepareGeneralPromptQuestions(defaults, getSettings(user));
          payload.project_name = project_name;
        } else {
          payload.questions = prepareGeneralPromptQuestions(defaults, getSettings(payload.projects[project]));
          payload.project_name = project;
        }
        generalPrompt(payload);
      });
    } else {
      payload.questions = prepareGeneralPromptQuestions(defaults, getSettings(user));
      generalPrompt(payload);
    }
  }
};
