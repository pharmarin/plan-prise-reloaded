import React from 'react';

import axios from 'axios';
import AsyncCreatableSelect from 'react-select/async-creatable';

import { SPINNER } from '../params';

export default class SearchComposition extends React.Component
{

  constructor(props)
  {
    super(props)
    this.state = {
      isLoading: false
    }
  }

  _loadDCIOptions = async (inputValue) => {
    this.axiosSourceOptions && this.axiosSourceOptions.cancel('Cancel previous request')
    this.axiosSourceOptions = axios.CancelToken.source()
    return new Promise((resolve) => {
      let url = `${window.php.routes.api.composition.search}?query=${inputValue}`
      axios.get(url, {
        cancelToken: this.axiosSourceOptions.token
      })
        .then((response) => {
          if (response.data.length > 0) {
            let results = response.data.map(item => {
              return {
                value: item.id,
                label: item.denomination
              }
            })
            return resolve(results)
          } else {
            return resolve([])
          }
        })
        .catch((thrown) => {
          if (axios.isCancel(thrown)) {
            console.log(thrown.message);
          } else {
            console.log(thrown)
          }
        })
    });
  }

  _loadDCIPrecautions = async (inputValue) => {
    this.setState({ isLoading: true })
    this.axiosSourcePrecautions && this.axiosSourcePrecautions.cancel('Cancel previous request')
    this.axiosSourcePrecautions = axios.CancelToken.source()
    return new Promise((resolve) => {
      let url = `${window.php.routes.api.composition.get}?data[]=${inputValue.map(input => input.value).join('&data[]=')}`
      axios.get(url, {
        cancelToken: this.axiosSourcePrecautions.token
      })
      .then((response) => {
        this.setState({ isLoading: false })
        let precautions = response.data.map((composition) => composition.precautions).flat()
        this.props.onPrecautionChange(precautions)
      })
      .catch((thrown) => {
        this.setState({ isLoading: false })
        if (axios.isCancel(thrown)) {
          //console.log(thrown.message);
        } else {
          console.log(thrown)
        }
      })
    });
  }

  _handleDCISelect = (inputValues) => {
    this.props.onCompositionChange(inputValues || [])
    this._loadDCIPrecautions(inputValues)
    return inputValues;
  }

  _handleDCIInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      return inputValue.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); }) // Capitalize
    }
    return inputValue
  }

  render ()
  {
    let { defaultOptions } = this.props
    let { isLoading } = this.state
    let colors = {}
    if (document.querySelector('.btn-primary')) {
      colors.primary = document.querySelector('.btn-primary') ? window.getComputedStyle(document.querySelector('.btn-primary')).backgroundColor : 'grey'
      let decompose = /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[\.\d+]*)*\)/g.exec(colors.primary)
      colors.primary50 = 'rgba(' + [decompose[1], decompose[2], decompose[3], .5].join(',') + ')'
      colors.primary75 = 'rgba(' + [decompose[1], decompose[2], decompose[3], .75].join(',') + ')'
      colors.primary25 = 'rgba(' + [decompose[1], decompose[2], decompose[3], .25].join(',') + ')'
    }
    return (
      <>
        <AsyncCreatableSelect
          cacheOptions
          defaultValue={defaultOptions}
          isMulti
          loadOptions={this._loadDCIOptions}
          onChange={this._handleDCISelect}
          onInputChange={this._handleDCIInputChange}
          theme={theme => ({
            ...theme,
            colors: {
              ...theme.colors,
              ...colors
            },
          })}
        />
        <div className={isLoading ? "mt-1" : "d-none"}>
          {SPINNER}
          <span className="ml-2">Import des commentaires associés en cours...</span>
        </div>
      </>
    )
  }

}
