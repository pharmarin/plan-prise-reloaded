import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import Tooltip from '@atlaskit/tooltip';
import axios from 'axios';

const loadOptions = (inputValue, callback) => {
  if (inputValue.length < 3) return
  axios.get('https://cors-anywhere.herokuapp.com/https://www.open-medicaments.fr/api/v1/medicaments?query=' + inputValue)
    .then(response => response.data.map(function (item) {
      return {
        'value': item.codeCIS,
        'label': item.denomination
      }
    }))
    .then(data => callback(data))
};

export default class Recherche extends React.Component {

  loadingMessage (query) {
    return 'Recherche en cours...'
  }

  noOptionsMessage (query) {
    return 'Aucun médicament ne correspond à votre recherche.'
  }

  render() {
    return (
      <AsyncSelect
        cacheOptions={true}
        loadOptions={loadOptions}
        loadingMessage={this.loadingMessage}
        defaultOptions
        onChange={this.props.onChange}
        placeholder={'Recherchez un médicament'}
      />
    );
  }
}
