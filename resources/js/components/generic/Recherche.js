import React, { Component } from 'react';
//import AsyncSelect from 'react-select/async';
//import { components } from 'react-select';
import Tooltip from '@atlaskit/tooltip';
import axios from 'axios';

export default class Recherche extends React.Component {

  loadOptions = (inputValue, callback) => {
    if (inputValue.length < 3) return
    axios.get('https://cors-anywhere.herokuapp.com/https://www.open-medicaments.fr/api/v1/medicaments?query=' + inputValue)
      .then(response => response.data.map(function (item) {
        return {
          'value': item.codeCIS,
          'label': item.denomination
        }
      }))
      .then(data => callback(data))
  }

  loadingMessage (query) {
    return 'Recherche en cours...'
  }

  noOptionsMessage (query) {
    return 'Aucun médicament ne correspond à votre recherche.'
  }

  render() {
    let closeMenuOnSelect = this.props.closeMenuOnSelect !== null ? this.props.closeMenuOnSelect : true
    return null /* (
      <AsyncSelect
        cacheOptions={true}
        closeMenuOnSelect={closeMenuOnSelect}
        defaultOptions
        isMulti={this.props.isMulti || false}
        loadingMessage={this.loadingMessage}
        loadOptions={this.loadOptions}
        onChange={this.props.onChange}
        onSelectResetsInput={closeMenuOnSelect}
        placeholder={'Recherchez un médicament'}
      />
    );*/
  }
}
