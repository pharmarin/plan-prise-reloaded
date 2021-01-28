import { Theme } from 'react-select';

const reactSelectOptions = {
  classNamePrefix: 'react-select',
  theme: (theme: Theme): Theme => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: 'rgba(16, 185, 129, 1)',
      primary75: 'rgba(16, 185, 129, .75)',
      primary50: 'rgba(16, 185, 129, .50)',
      primary25: 'rgba(16, 185, 129, .25)',
    },
  }),
};

export default reactSelectOptions;
