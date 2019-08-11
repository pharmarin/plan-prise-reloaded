const voiesAdministration = {
  1: 'Orale',
  2: 'Cutanée',
  3: 'Auriculaire',
  4: 'Nasale',
  5: 'Inhalée',
  6: 'Vaginale',
  7: 'Oculaire',
  8: 'Rectale',
  9: 'Sous-cutanée',
  10: 'Intra-musculaire',
  11: 'Intra-veineux',
  12: 'Intra-urétrale'
}

export const inputs = {
  customDenomination: {
    isRepeated: false,
    label: 'Nom du médicament',
    hint: 'Nom du médicament qui sera affiché sur le plan de prise. ',
    inputs: {
      customDenomination: {type: 'text', placeholder: 'Nom du médicament'}
    },
    defaultValue: ''
  },
  customIndications: {
    isRepeated: true,
    label: 'Indications',
    hint: 'Indications qui seront affichées par défaut dans le plan de prise. ',
    inputs: {
      customIndications: {type: 'text', placeholder: 'Indication'}
    },
    defaultValue: [{customIndications: 'test'}]
  },
  conservationFrigo: {
    isRepeated: false,
    label: 'Température de conservation',
    inputs: {
      conservationFrigo: {type: 'select', options: {0: 'Température ambiante', 1: 'Frigo'}}
    },
    defaultValue: 0
  },
  conservationDuree: {
    isRepeated: true,
    label: 'Durée de conservation',
    inputs: {
      laboratoire: {type: 'text', placeholder: 'Laboratoire'},
      duree: {type: 'text', placeholder: 'Durée de conservation'}
    },
    defaultValue: [{laboratoire: '', duree: ''}]
  },
  voieAdministration: {
    isRepeated: true,
    label: 'Voie d\'administration',
    inputs: {
      voieAdministration: {type: 'select', options: voiesAdministration}
    },
    defaultValue: [{voieAdministration: null}]
  },
  commentaires: {
    isRepeated: true,
    label: 'Commentaires par défaut',
    inputs: {
      cible: {type: 'select', options: {0: 'Cible', 1: 'Ce médicament', 2: 'Tous les médicaments'}, className: 'col-2'},
      voieAdministration: {type: 'select', options: {0: 'Toutes voies d\'administration', ...voiesAdministration}, className: 'col-2'},
      option: {type: 'text', placeholder: 'Option (facultatif)', className: 'col-2'},
      commentaire: {type: 'textarea', placeholder: 'Commentaire', className: 'col-6'}
    },
    defaultValue: [{cible: 0, voieAdministration: 0, option: '', commentaire: ''}]
  }
}
