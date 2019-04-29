import { Error } from '../models/error';
import { GENERIC_ERROR, MODULE_NOT_FOUND } from '../constants/errors';
import { logger } from './logger';
import { writeFile } from 'fs';

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
