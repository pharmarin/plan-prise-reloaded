import React from 'react';

import axios from 'axios';
import AsyncSelect from 'react-select/async';
import _ from 'lodash';

export default class SearchMedicament extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      select: {
        value: null
      }
    }

    this._LoadOptions = _.debounce(this._loadOptions, 500, {
      leading: true
    })
  }

  _loadOptions = async (inputValue) => {
    this.axiosSourceOptions && this.axiosSourceOptions.cancel('Cancel previous request')
    this.axiosSourceOptions = axios.CancelToken.source()
    return await axios.get(window.php.routes.api.all.search, {
      cancelToken: this.axiosSourceOptions.token,
      params: {
        token: window.php.routes.token,
        query: inputValue,
      }
    })
      .then((response) => {
      if (response.data.length > 0) {
        return response.data
      } else {
        return []
      }
    })
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        //console.log(thrown.message);
      } else {
        console.log(thrown)
      }
    })
  }

  _handleSelect = (inputValues) => {
    this.props.onSelect(inputValues || [])
    if (this.props.multiple) this._setValue(null)
    return inputValues;
  }

  _handleChange = (inputValue) => {
    this._setValue(inputValue)
    return inputValue
  }

  _setValue = (value) => {
    this.setState((prevState) => ({
      select: {
        ...prevState.select,
        value
      }
    }));
  }

  render() {
    let { defaultOptions } = this.props
    let colors = {}
    if (document.querySelector('.btn-primary')) {
      colors.primary = document.querySelector('.btn-primary') ? window.getComputedStyle(document.querySelector('.btn-primary')).backgroundColor : 'grey'
      let decompose = /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[\.\d+]*)*\)/g.exec(colors.primary)
      colors.primary50 = 'rgba(' + [decompose[1], decompose[2], decompose[3], .5].join(',') + ')'
      colors.primary75 = 'rgba(' + [decompose[1], decompose[2], decompose[3], .75].join(',') + ')'
      colors.primary25 = 'rgba(' + [decompose[1], decompose[2], decompose[3], .25].join(',') + ')'
    }
    return (
      <AsyncSelect
        cacheOptions
        defaultValue={defaultOptions}
        isMulti={this.props.multiple || false}
        loadingMessage={() => "Chargement en cours..."}
        loadOptions={this._loadOptions}
        menuPlacement="auto"
        noOptionsMessage={() => "Aucun médicament ne correspond à la recherche"}
        onChange={this._handleSelect}
        placeholder="Ajouter un médicament au plan de prise"
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            ...colors
          },
        })}
        value={this.state.select.value}
      />
      )
    }

  }
