import get from 'lodash/get';

export type Config = {
  [key: string]: any;
  version: string;
  validation: {
    [key: string]: string;
  };
  default: {
    pp_inputs: any; // TODO
  };
} | null;

const STORAGE_KEY = 'pharmarin.config';

const getLocalStorage = (): Config | false => {
  const local = localStorage.getItem(STORAGE_KEY);
  if (!local) return false;
  const config = JSON.parse(local);
  if (!config) return false;
  return config;
};

export const storeConfig = (config: Config) => {
  const string = JSON.stringify(config);
  return localStorage.setItem(STORAGE_KEY, string);
};

export default (key: string | undefined = undefined) => {
  const localStorage = getLocalStorage();
  if (!localStorage) {
    return null;
  }
  if (key) return get(localStorage, key);
  return localStorage;
};
