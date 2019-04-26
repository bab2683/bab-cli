export interface SettingObject {
  default?: string | boolean;
  question?: string;
  type?: string;
  when?: string;
  [value: string]: any;
}
export interface DefaultSettings {
  base_folder: SettingObject;
  test_folder: SettingObject;
  test_folder_name: SettingObject;
  template_path: SettingObject;
  [value: string]: any;
}
export interface UserSettings {
  base_folder?: string;
  test_folder?: boolean;
  test_folder_name?: string;
  template_path?: string;
  [value: string]: any;
}
