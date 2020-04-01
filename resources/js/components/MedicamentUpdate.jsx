import React from 'react';
import axios from 'axios';

export default class MedicamentUpdate extends React.Component {
  constructor (props) {
    super(props)
    this.token = document.head.querySelector('meta[name="csrf-token"]').getAttribute('content')
    this.state = {
      isLoading: false,
      updated: 0,
      updateList: []
    }
  }

  getToday = () => {
    let today = new Date(),
        dd = String(today.getDate()).padStart(2, '0'),
        mm = String(today.getMonth() + 1).padStart(2, '0'), // + 1 car Janvier = 0
        yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd
  }

  getUpdateList = (event) => {
    event.preventDefault()
    this.setState({ isLoading: true, updated: 0 }, () => {
      axios.post(this.props.api, {
        action: 'get',
        data: this.dateInput.value
      })
      .then((response) => {
        if (response.data.status === 'success') {
          let jsonResponse = JSON.parse(response.data.data)
          this.setState({
            updateList: jsonResponse
          }, () => this.launchUpdate())
        } else {
          alert('error for date')
        }
      })
    })
  }

  launchUpdate = async () => {
    for (var i = 0; i < this.state.updateList.length; i++) {
      let id = this.state.updateList[i]
      await this.updateMedicament(id).then((response) => {
        if (response.data.status === 'success') {
          this.setState({
            isLoading: this.state.updated != this.state.updateList.length,
            updated: this.state.updated + 1
          })
        } else {
          alert('error updating ' + id)
        }
      })
    }
  }

  updateMedicament = (id) => {
    return new Promise((resolve, reject) => {
      axios.post(this.props.api, {
        action: 'update',
        data: id
      })
      .then((response) => {
        return resolve(response)
      })
      .catch(error => {
        return reject(error.message)
      })
    })
  }

  render () {
    return (
      <form method="post" action={this.props.api} className="d-flex flex-column justify-content-center">
        <div className="form-group">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">Médicaments modifiés avant le</span>
            </div>
            <input type="date" name="date" defaultValue={this.getToday()} ref={(input) => this.dateInput = input} className="form-control flex-fill" />
          </div>
        </div>
        {
          this.state.updated > 0 ?
          <div className="progress mb-3">
            <div className="progress-bar bg-danger" style={{'width': `${(this.state.updated)*100/this.state.updateList.length}%`}}>
              {this.state.updated}/{this.state.updateList.length}
            </div>
          </div> :
          null
        }
        <button type="submit" name="get" value="all" className="btn btn-danger" disabled={this.state.isLoading || this.state.updated > 0} onClick={(event) => this.getUpdateList(event)}>
          { this.state.isLoading ? this.state.updated < this.state.updateList.length ? "Mise à jour en cours" : "Mise à jour terminée" : "Lancer la mise à jour" }
        </button>
      </form>
    )
  }
}
