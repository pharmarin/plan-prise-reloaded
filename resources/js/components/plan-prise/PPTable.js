import React, { Component } from 'react';

import PPCard from './PPCard';

export default class PPTable extends React.Component
{

  render () {
    let { data, ...props } = this.props
    return (
      this.props.data.map(medicament => <PPCard key={medicament.codeCIS} medicament={medicament} { ...props } />)
    )
  }

}
