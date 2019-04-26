import { logger } from './logger';
import { writeFile } from 'fs';
import { MODULE_NOT_FOUND, GENERIC_ERROR } from '../constants/errors';
import { Error } from '../models/error';

interface FileResponse {
  data?: any;
  error?: Error;
}

export async function getFile(path: string): Promise<FileResponse> {
  try {
    const file = await import(path);
    delete file.default;
    return { data: file };
  } catch (err) {
    if (err.code === MODULE_NOT_FOUND.CODE) {
      return { error: MODULE_NOT_FOUND };
    } else {
      return { error: GENERIC_ERROR };
    }
  }
}
export function createFile({
  name,
  content,
  callback,
  filename,
}: {
  name: string;
  content: string;
  callback?: any;
  filename: string;
}) {
  const data = new Uint8Array(Buffer.from(content));
  writeFile(name, data, err => {
    if (err) {
      logger(`Could not create file with name: ${name}, error: ${err}`, 'red');
    } else {
      logger(`Created file: ${filename}`, 'green', false);
      callback && callback();
    }
  });
}
