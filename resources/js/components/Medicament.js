import React from 'react';

import { inputs } from './medicament/inputs';
import MedicamentForm from './medicament/MedicamentForm';

export default class Medicament extends React.Component {

  constructor (props) {
    super(props)

    this.newInputs = inputs

    for (var key in this.newInputs) {
      if (this.newInputs.hasOwnProperty(key)) {
        this.newInputs[key].defaultValue = this.newInputs[key].emptyObject
      }
    }

    this.method = 'CREATE'

    if (this.props.old_medicament) {
      this.method = 'IMPORT'

      const old_medicament = JSON.parse(this.props.old_medicament)

      this.newInputs.old_medicament.defaultValue = old_medicament.id
      this.newInputs.customDenomination.defaultValue = old_medicament.nomMedicament
      this.newInputs.customIndications.defaultValue = this.getValueFromOldMedicament('customIndications', old_medicament.indication)
      this.newInputs.conservationFrigo.defaultValue = old_medicament.frigo
      this.newInputs.conservationDuree.defaultValue = this.getValueFromOldMedicament('conservationDuree', old_medicament.dureeConservation)
      this.newInputs.voiesAdministration.defaultValue = this.getValueFromOldMedicament('voiesAdministration', old_medicament.voieAdministration)
      this.newInputs.commentaires.defaultValue = this.getValueFromOldMedicament('commentaires', old_medicament.commentaire)
    }

    if (this.props.edit) {
      this.method = 'EDIT'

      const edit = JSON.parse(this.props.edit)

      this.medicFromAPI = edit.bdpm

      this.newInputs.customDenomination.defaultValue = edit.customDenomination
      this.newInputs.customIndications.defaultValue = JSON.parse(edit.customIndications)
      this.newInputs.conservationFrigo.defaultValue = edit.conservationFrigo
      this.newInputs.conservationDuree.defaultValue =  JSON.parse(edit.conservationDuree)
      this.newInputs.voiesAdministration.defaultValue = JSON.parse(edit.voiesAdministration)
      this.newInputs.commentaires.defaultValue = edit.precautions
    }
  }

  getValueFromOldMedicament (inputName, string) {
    try {
      var string = JSON.parse(string)
      let result
      switch (inputName) {
        case 'commentaires':
          result = []
          string.forEach((commentaire) => {
            result.push({
              cible_id: 0,
              cible: 'medicament',
              voie_administration: 0,
              population: commentaire.span,
              commentaire: commentaire.text
                .replace('<br>', '**')
                .replace('<br/>', '**')
                .replace('<sup>', '')
                .replace('</sup>', '')
            })
          })
          return result
          break;
        case 'conservationDuree':
          result = []
          for (let [labo, duree] of Object.entries(string)) {
            result.push({
              laboratoire: labo,
              duree: duree
            })
          }
          return result
          break;
        default:
          return string
      }
    } catch(e) {
      console.log(inputName + ' field in database contains invalid json')
      switch (inputName) {
        case 'voiesAdministration':
          var value = 0
          switch (string) {
            case 'Orale': value = 1; break;
            case 'Cutanée': value =  2; break;
            case 'Auriculaire': value =  3; break;
            case 'Nasale': value =  4; break;
            case 'Inhalée': value =  5; break;
            case 'Vaginale': value =  6; break;
            case 'Oculaire': value = 7; break;
            case 'Rectale': value =  8; break;
            case 'Sous-cutanée': value =  9; break;
            case 'Intra-musculaire': value =  10; break;
            case 'Intra-veineux': value = 11; break;
            case 'Intra-urétrale': value =  12; break;
            default: value =  0; break;
          }
          return [{[inputName]: value.toString()}]
          break;
        case 'customIndications':
          return string.split(' OU ').map((indication) => {
            return {customIndications: indication}
          })
          break;
        default:
          return [{[inputName]: string}]
      }
    }
  }

  render () {
    return <MedicamentForm method={this.method} inputs={this.newInputs} fromAPI={this.medicFromAPI} {...this.props} />
  }

}
