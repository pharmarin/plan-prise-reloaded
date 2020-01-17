import React from 'react';

import MedicamentForm from './medicament/MedicamentForm';
import alertManager from './generic/Alert';

class Medicament extends React.Component {

  constructor (props) {
    super(props)

    this.newInputs = window.php.default_inputs

    for (var key in this.newInputs) {
      if (this.newInputs.hasOwnProperty(key)) {
        this.newInputs[key].defaultValue = Object.assign({}, this.newInputs[key].emptyObject)
      }
    }

    this.method = 'CREATE'

    if (window.php.old_medicament) {
      this.method = 'IMPORT'

      const old_medicament = window.php.old_medicament

      this.medicament_edit = {
        compositions: old_medicament.nomGenerique
      }

      this.newInputs.old_medicament.defaultValue = old_medicament.id
      this.newInputs.custom_denomination.defaultValue = old_medicament.nomMedicament
      this.newInputs.custom_indications.defaultValue = this.getValueFromOldMedicament('custom_indications', old_medicament.indication)
      this.newInputs.conservation_frigo.defaultValue = old_medicament.frigo
      this.newInputs.conservation_duree.defaultValue = this.getValueFromOldMedicament('conservation_duree', old_medicament.dureeConservation)
      this.newInputs.voies_administration.defaultValue = this.getValueFromOldMedicament('voies_administration', old_medicament.voieAdministration)
      this.newInputs.commentaires.defaultValue = this.getValueFromOldMedicament('commentaires', old_medicament.commentaire)
    }

    if (window.php.medicament) {
      this.method = 'EDIT'

      const edit = window.php.medicament

      this.medicament_edit = edit

      this.newInputs.custom_denomination.defaultValue = edit.custom_denomination
      this.newInputs.custom_indications.defaultValue = edit.custom_indications
      this.newInputs.conservation_frigo.defaultValue = edit.conservation_frigo
      this.newInputs.conservation_duree.defaultValue = edit.conservation_duree
      this.newInputs.voies_administration.defaultValue = JSON.parse(edit.voies_administration)
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
              id: '',
              cible_id: 0,
              cible: 'medicament',
              voie_administration: 0,
              population: commentaire.span,
              commentaire: commentaire.text.replace(/<[^>]*>?/gm, '')
            })
          })
          return result
        case 'conservation_duree':
          result = []
          for (let [labo, duree] of Object.entries(string)) {
            result.push({
              laboratoire: labo,
              duree: duree
            })
          }
          return result
        default:
          return string
      }
    } catch(e) {
      console.log(inputName + ' field in database contains invalid json')
      switch (inputName) {
        case 'voies_administration':
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
        case 'custom_indications':
          return string.split(' OU ').map((indication) => {
            return {[inputName]: indication}
          })
        default:
          return [{[inputName]: string}]
      }
    }
  }

  render () {
    return <MedicamentForm method={this.method} inputs={this.newInputs} medicament={this.medicament_edit} {...this.props} />
  }

}

export default alertManager(Medicament)
