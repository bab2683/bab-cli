import { Error } from '../models/error';

export const MODULE_NOT_FOUND: Error = {
  CODE: 'MODULE_NOT_FOUND',
  MESSAGE: 'Filen not found',
};
export const GENERIC_ERROR: Error = {
  CODE: 'GENERIC_ERROR',
  MESSAGE: 'Unhandled error, please try again',
};
export const ALREADY_EXISTS: Error = {
  CODE: 'ALREADY_EXISTS',
  MESSAGE: 'Folder already exists, operation aborted',
};
