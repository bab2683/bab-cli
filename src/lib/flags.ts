import { Flags } from '../models/flags';

export function getFlags(args: string[]): Flags {
  return args.reduce((list: Flags, current: string) => {
    const flag = current.toLowerCase().match(/^(?:--)([a-z]+)=(\S+)$/i);
    if (flag) {
      list[flag[1]] = flag[2];
    }
    return list;
  }, {});
}
