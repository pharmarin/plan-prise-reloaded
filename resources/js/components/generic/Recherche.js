import React, { Component } from 'react';

import axios from 'axios';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';

import { API_URL } from '../params';

export default class Recherche extends React.Component {

  static defaultProps = {
    limit: "20",
    mutliple: false,
    paginate: false,
    searchAPI: API_URL
  }

  render() {
    return (
      <div className="d-flex">
        <Select2
          className="flex-fill"
          multiple={this.props.multiple}
          onSelect={this.props.onSelect}
          options={
            {
              placeholder: 'Rechercher un médicament',
              closeOnSelect: !this.props.multiple,
              ajax: {
                url: this.props.searchAPI,
                data: (params) => {
                  let query = {
                    query: params.term,
                    limit: this.props.limit
                  }
                  return query
                },
                dataType: 'json',
                processResults: (data) => {
                  return {
                    results: data.map(item => {
                      return {
                        id: item.codeCIS,
                        text: item.denomination
                      }
                    })
                  };
                }
              }
            }
          }
        />
      </div>
    )
  }
}
