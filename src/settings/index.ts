import { DefaultSettings } from '../models/settings';

export const defaultSettings: DefaultSettings = {
  base_folder: {
    default: '/',
    question: 'Base folder (example: src/app/)',
    type: 'input',
  },
  test_folder: {
    default: true,
    question: 'Create test folder',
    type: 'bool',
  },
  test_folder_name: {
    default: '__test__',
    question: 'Test folder name',
    type: 'input',
    when: 'test_folder',
  },
  template_path: {
    default: '',
    question: 'Please write down the templates file path',
    type: 'input',
  },
};
