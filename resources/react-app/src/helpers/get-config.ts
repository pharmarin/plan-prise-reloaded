const STORAGE_KEY = 'pharmarin.config';

const getLocalStorage = () => {
  const local = localStorage.getItem(STORAGE_KEY);
  if (!local) return false;
  const config = JSON.parse(local);
  if (!config) return false;
  return config as Models.App.Config;
};

export const storeConfig = (config: Models.App.Config) => {
  const string = JSON.stringify(config);
  return localStorage.setItem(STORAGE_KEY, string);
};

const getConfig = <T extends Models.App.Config, K extends keyof T>(
  key: K
): T[K] | null => {
  const localStorage = getLocalStorage() as T;

  if (typeof localStorage !== 'object' || localStorage === null) {
    return null;
  }

  if (key in localStorage) return localStorage[key];

  return null;
};

export default getConfig;
