export type Config = {
  version: string;
  validation: {
    [key: string]: string;
  };
} | null;

const STORAGE_KEY = 'pharmarin.config';

const getLocalStorage = () => {
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

export default (key: string | undefined = undefined): Config => {
  const localStorage = getLocalStorage();
  if (!localStorage) {
    return null;
  }
  if (key) return localStorage[key];
  return localStorage;
};
