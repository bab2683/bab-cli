import { mkdirSync, existsSync } from 'fs';
import { basename } from 'path';
import { logger } from './logger';

export function getCurrentDirectoryBase(): string {
  return basename(process.cwd());
}
export function directoryExists(filePath: string): boolean {
  return existsSync(filePath);
}
export function createDirectory(name: string): void {
  mkdirSync(name);
  logger(`Folder created: ${name}`, 'green', false);
}
