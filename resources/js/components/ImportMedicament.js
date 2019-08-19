import React from 'react';

import { inputs } from './medicament/inputs';
import MedicamentForm from './medicament/MedicamentForm';

export default class ImportMedicament extends React.Component {

  constructor (props) {
    super(props)
    this.old_medicament = JSON.parse(this.props.old_medicament)
    this.api_selected_detail = JSON.parse(this.props.api_selected_detail)
    console.log('old_medicament', this.old_medicament)

    inputs.customDenomination.defaultValue = this.old_medicament.nomMedicament
    inputs.customIndications.defaultValue = this.getValueFromOldMedicament('customIndications', this.old_medicament.indication)
    inputs.conservationFrigo.defaultValue = this.old_medicament.frigo
    inputs.conservationDuree.defaultValue = this.getValueFromOldMedicament('conservationDuree', this.old_medicament.dureeConservation)
    inputs.voieAdministration.defaultValue = this.getValueFromOldMedicament('voieAdministration', this.old_medicament.voieAdministration)
    inputs.commentaires.defaultValue = this.getValueFromOldMedicament('commentaires', this.old_medicament.commentaire)
  }

  getValueFromOldMedicament (inputName, string) {
    try {
      var string = JSON.parse(string)
      switch (inputName) {
        case 'commentaires':
          var result = []
          string.forEach((commentaire) => {
            result.push({
              cible: 0,
              type: 'medicament',
              voieAdministration: 0,
              population: commentaire.span,
              commentaire: commentaire.text
            })
          })
          return result
          break;
        default:
          return string
      }
    } catch(e) {
      console.log(inputName + ' field in database contains invalid json')
      if (inputName == 'voieAdministration') {
        var value = 0
        switch (string) {
          case 'Orale': value = 1; break;
          case 'Cutanée': value =  2; break;
          case 'auriculaire': value =  3; break;
          case 'nasale': value =  4; break;
          case 'inhale': value =  5; break;
          case 'vaginal': value =  6; break;
          case 'oculaire': value = 7; break;
          case 'rectale': value =  8; break;
          case 'IDerm': value =  9; break;
          case 'Imusc': value =  10; break;
          case 'IVein': value = 11; break;
          case 'IUr': value =  12; break;
          default: value =  null; break;
        }
        return [{[inputName]: value}]
      }
      return [{[inputName]: string}]
    }
  }

  render () {
    return <MedicamentForm inputs={inputs} selected={this.api_selected_detail} {...this.props} />
  }

}
