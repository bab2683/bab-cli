import { UserSettings } from './settings';

export interface CommandPayload {
  settings?: UserSettings | null;
  commandArguments?: string[];
  [value: string]: any;
}

export interface Command {
  (payload: CommandPayload): void;
}
