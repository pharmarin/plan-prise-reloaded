import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import constant from 'lodash/constant';
import debounce from 'lodash/debounce';

export default class SearchMedicament extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      select: {
        value: null,
      },
    };

    this.loadOptions = debounce(this.loadOptions, 500, {
      leading: true,
    });
  }

  loadOptions = async (inputValue) => {
    if (this.axiosSourceOptions) {
      this.axiosSourceOptions.cancel('Cancel previous request');
    }
    this.axiosSourceOptions = axios.CancelToken.source();
    return axios
      .get(window.php.routes.api.all.search, {
        cancelToken: this.axiosSourceOptions.token,
        params: {
          token: window.php.routes.token,
          query: inputValue,
        },
      })
      .then((response) => {
        if (response.data.length > 0) {
          return response.data;
        }
        return [];
      })
      .catch((thrown) => {
        if (axios.isCancel(thrown)) {
          // console.log(thrown.message);
        } else {
          console.log(thrown);
        }
      });
  };

  handleSelect = (inputValues) => {
    const { multiple, onSelect } = this.props;
    onSelect(inputValues || []);
    if (multiple) this.setValue(null);
    return inputValues;
  };

  handleChange = (inputValue) => {
    this.setValue(inputValue);
    return inputValue;
  };

  setValue = (value) => {
    this.setState((prevState) => ({
      select: {
        ...prevState.select,
        value,
      },
    }));
  };

  render() {
    const { defaultOptions, multiple } = this.props;
    const { select } = this.state;
    const colors = {};
    if (document.querySelector('.btn-primary')) {
      colors.primary = document.querySelector('.btn-primary')
        ? window.getComputedStyle(
            document.querySelector('.btn-primary'),
          ).backgroundColor
        : 'grey';
      const decompose = /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[.\d+]*)*\)/g.exec(
        colors.primary,
      );
      colors.primary50 = `rgba(${[
        decompose[1],
        decompose[2],
        decompose[3],
        0.5,
      ].join(',')})`;
      colors.primary75 = `rgba(${[
        decompose[1],
        decompose[2],
        decompose[3],
        0.75,
      ].join(',')})`;
      colors.primary25 = `rgba(${[
        decompose[1],
        decompose[2],
        decompose[3],
        0.25,
      ].join(',')})`;
    }
    return (
      <AsyncSelect
        cacheOptions
        defaultValue={defaultOptions}
        isMulti={multiple || false}
        loadingMessage={constant('Chargement en cours...')}
        loadOptions={this.loadOptions}
        menuPlacement="auto"
        noOptionsMessage={constant(
          'Aucun médicament ne correspond à la recherche',
        )}
        onChange={this.handleSelect}
        placeholder="Ajouter un médicament au plan de prise"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            ...colors,
          },
        })}
        value={select.value}
      />
    );
  }
}

SearchMedicament.propTypes = {
  defaultOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  multiple: PropTypes.bool,
  onSelect: PropTypes.func,
};
