import { ALREADY_EXISTS } from '../constants/errors';
import { createDirectory, directoryExists, getCurrentDirectoryBase } from '../lib/directories';
import { createFile, getFile } from '../lib/files';
import { Flags } from '../models/flags';
import { handleError } from '../lib/errors';
import { logSeparator } from '../lib/logger';
import { Template } from '../models/templates';
import { UserSettings } from '../models/settings';

interface Segment {
  exists: boolean;
  name: string;
  segment: string;
}

interface FileCreationSettings {
  name: string;
  fullPath: string;
  segments: Segment[];
  currentPath?: string;
}

type GeneratePayload = (data: { commandArguments: string[]; settings: UserSettings; flags: Flags }) => void;

function parsePath(destination: string): FileCreationSettings {
  const filePath: string = destination[0] === '/' ? destination.slice(1) : destination;

  if (filePath.indexOf('/') > -1) {
    const splitted: string[] = filePath.split('/');
    const name: string = splitted[splitted.length - 1];

    return {
      name,
      fullPath: filePath,
      segments: splitted.reduce((segments: Segment[], current: string) => {
        const currentPath = segments[segments.length - 1]
          ? `${segments[segments.length - 1].segment}/${current}`
          : current;
        return segments.concat([
          {
            exists: directoryExists(currentPath),
            name: current,
            segment: currentPath,
          },
        ]);
      }, []),
    };
  }
  return {
    name: filePath,
    fullPath: filePath,
    segments: [{ exists: directoryExists(filePath), name: filePath, segment: filePath }],
  };
}
function parseArguments(args: string[], baseFolder: string): FileCreationSettings {
  return {
    ...parsePath(baseFolder + args[0]),
    currentPath: getCurrentDirectoryBase(),
  };
}
function prepareFolders(segments: Segment[]): void {
  segments.forEach(current => {
    if (!current.exists) {
      createDirectory(current.segment);
    }
  });
}
function formatName(name: string): string {
  const lowerCase: string = name.toLowerCase();
  const splitted: string[] = lowerCase.split('-');
  return splitted.reduce((sentence: string, current: string) => {
    const firstLetter = current[0].toUpperCase();
    const word = firstLetter + current.slice(1);
    return (sentence += word);
  }, '');
}

function createFilesAccordingToTemplate({
  templates,
  name,
  filePath,
  test_folder,
  test_folder_name,
}: {
  templates: Template[];
  name: string;
  filePath: string;
  test_folder: boolean;
  test_folder_name: string;
}) {
  let parsedTemplates: Template[] = [];

  if (templates.constructor === Object) {
    parsedTemplates = Object.keys(templates).reduce((list: Template[], current: any) => {
      list.push(templates[current]);
      return list;
    }, []);
  } else {
    parsedTemplates = templates;
  }
  parsedTemplates.forEach(current => {
    const { filename, content, test } = current(name, formatName(name));
    createFile({
      name: test && test_folder ? `${filePath}/${test_folder_name}/${filename}` : `${filePath}/${filename}`,
      content,
      filename,
    });
  });
}

export const command: GeneratePayload = ({ commandArguments, settings, flags }) => {
  const { template_path = '', test_folder = true, base_folder = '', test_folder_name = '' } = settings;

  getFile(template_path).then(({ data, error }) => {
    if (data) {
      const { name, segments } = parseArguments(commandArguments, base_folder);

      if (!segments[segments.length - 1].exists) {
        prepareFolders(segments);
        if (test_folder) {
          createDirectory(`${segments[segments.length - 1].segment}/${test_folder_name}`);
        }
        logSeparator();

        createFilesAccordingToTemplate({
          templates: data,
          name,
          filePath: segments[segments.length - 1].segment,
          test_folder,
          test_folder_name,
        });
      } else {
        handleError(ALREADY_EXISTS.CODE);
      }
    } else if (error) {
      handleError(error.CODE);
    }
  });
};
