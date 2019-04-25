import chalk from 'chalk';
import { NAME } from '../constants/constants';

export function logSeparator(): void {
  console.log('');
}
export function logger(message: string, color: any = '', spaces: boolean = true, prefix: boolean = true): void {
  const parsedMessage = `${prefix ? `${NAME} - ` : ''}${message}`;

  spaces && console.log('');
  if (color !== '' && (chalk as any)[color]) {
    console.log((chalk as any)[color](parsedMessage));
  } else {
    console.log(parsedMessage);
  }
  spaces && console.log('');
}
