import figlet from 'figlet';
import inquirer from 'inquirer';

import { logger } from '../lib/logger';
import { SETTINGS } from '../constants/constants';

import { saveUserSetting, parseDefaultSettings } from '../lib/settings';
import { Command } from '../models/command';

// function prepareGeneralPromptQuestions(defaults, settings) {
//   function parseDataByType(type, initial) {
//     switch (type) {
//       case 'bool':
//         return { type: 'list', choices: ['true', 'false'] };
//       case 'input':
//         return {
//           type,
//           default: initial,
//         };
//     }
//   }
//   function returnWhenParameterIfNeeded(defaults) {
//     if (defaults.when) {
//       return {
//         when: function({ test_folder }) {
//           return test_folder === 'true';
//         },
//       };
//     }
//     return {};
//   }

//   function createQuestion(option) {
//     const common = {
//       default: defaults[option].default,
//       message: `${defaults[option].question} ${
//         defaults[option].default !== undefined && defaults[option].default !== ''
//           ? `(default: ${defaults[option].default})`
//           : ''
//       }`,
//       name: option,
//       ...parseDataByType(
//         defaults[option].type,
//         settings && settings[option] ? settings[option] : defaults[option].default,
//       ),
//       ...returnWhenParameterIfNeeded(defaults[option]),
//     };
//     if (settings && settings[option] !== undefined) {
//       common.message += `(selected: ${settings[option]})`;
//     }
//     return common;
//   }
//   return Object.keys(defaults).map(option => {
//     return createQuestion(option);
//   });
// }

// function getSettings(defaults, user) {
//   const parsedDefaults = parsedefaultSettings(defaults);
//   if (user) {
//     return Object.assign(parsedDefaults, user);
//   }
//   return parsedDefaults;
// }
// function parseAnswers(defaults, answers) {
//   function parseValueByType(value, type) {
//     switch (type) {
//       case 'bool':
//         return value === 'true';

//       case 'input':
//         return value;
//     }
//   }
//   return Object.keys(defaults).reduce((settings, current) => {
//     if (current !== 'project_name') {
//       settings.push({
//         name: current,
//         value: parseValueByType(answers[current], defaults[current].type),
//       });
//     }
//     return settings;
//   }, []);
// }
// function projectPrompt(projects) {
//   return [
//     {
//       message: 'Select an existing project or create a new one',
//       name: 'project',
//       type: 'list',
//       choices: [...Object.keys(projects), 'New'],
//     },
//     {
//       message: 'Project name',
//       name: 'project_name',
//       type: 'input',
//       validate: function(value) {
//         if (value.length) {
//           if (Object.keys(projects).indexOf(value) > -1) {
//             return 'There is another project with this name';
//           }
//           if (value.match(/\s+/g)) {
//             return 'Spaces are not allowed';
//           }
//           return true;
//         } else {
//           return 'Please enter a valid name';
//         }
//       },
//       when: function({ project }) {
//         return project === 'New';
//       },
//     },
//   ];
// }

// function generalPrompt({ questions, defaults, projectConfiguration, projects, project_name }) {
//   inquirer
//     .prompt(questions)
//     .then(answers => {
//       const settingsObj = {};

//       parseAnswers(defaults, answers).forEach(({ name, value }) => {
//           settingsObj[name] = value;
// 	  });

//       if (projectConfiguration) {
//         projects[project_name] = settingsObj;
//         saveUserSetting(SETTINGS.CUSTOM, projects);
//       }else{
// 		 saveUserSetting(SETTINGS.INITIAL);
// 	  }

//       logger('Settings saved', 'green');
//     })
//     .catch(err => {
//       logger(err, 'red');
//     });
// }

// module.exports = function(defaults, user, message, projectConfiguration) {
//   logger(figlet.textSync('BabCli', { horizontalLayout: 'full' }), 'yellow', true, false);
//   if (message !== '') {
//     logger(message, 'magenta');
//   }
//   const payload = {
//     defaults,
//     projectConfiguration,
//     projects: user[SETTINGS.CUSTOM] || {},
//   };
//   delete user[SETTINGS.CUSTOM];

//   if (projectConfiguration) {
//     inquirer.prompt(projectPrompt(payload.projects)).then(({ project, project_name }) => {
//       if (project === 'New') {
//         payload.questions = prepareGeneralPromptQuestions(defaults, getSettings(defaults, user));
//         payload.project_name = project_name;
//       } else {
//         payload.questions = prepareGeneralPromptQuestions(defaults, getSettings(defaults, payload.projects[project]));
//         payload.project_name = project;
//       }
//       generalPrompt(payload);
//     });
//   } else {
//     payload.questions = prepareGeneralPromptQuestions(defaults, getSettings(defaults, user));
//     generalPrompt(payload);
//   }
// };

export const command: Command = (payload): void => {
  console.log('payload', payload);
};
