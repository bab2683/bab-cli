import { logger } from './logger';
import * as Errors from '../constants/errors';
import { Error } from '../models/error';

export function logError(message: string): void {
  logger(message, 'red');
  process.exit();
}
export function handleError(key: string) {
  const errorList: { [value: string]: Error } = {
    ...Errors,
  };
  logError(errorList[key].MESSAGE);
}
