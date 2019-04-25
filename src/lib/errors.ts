import { logger } from './logger';

export function error(message: string): void {
  logger(message, 'red');
  process.exit();
}
