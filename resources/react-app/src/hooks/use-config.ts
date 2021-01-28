import get from 'lodash-es/get';

const STORAGE_KEY = 'pharmarin.config';

const getLocalStorage = (): Models.App.Config | false => {
  const local = localStorage.getItem(STORAGE_KEY);
  if (!local) return false;
  const config = JSON.parse(local);
  if (!config) return false;
  return config;
};

export const storeConfig = (config: Models.App.Config) => {
  const string = JSON.stringify(config);
  return localStorage.setItem(STORAGE_KEY, string);
};

const useConfig = (key: string | undefined = undefined) => {
  const localStorage = getLocalStorage();
  if (!localStorage) {
    return null;
  }
  if (key) return get(localStorage, key);
  return localStorage;
};

export default useConfig;
