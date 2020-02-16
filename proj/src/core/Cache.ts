import { IPathname } from "../types/User";

type ICache = { [key in IPathname]: Object };

const Cache: ICache = {
  firewire: undefined,
  firewire2: undefined
};

export function cache(pathname: IPathname, data: Object) {
  Cache[pathname] = data;
}

export function getCache(pathname: IPathname) {
  return Cache[pathname];
}
