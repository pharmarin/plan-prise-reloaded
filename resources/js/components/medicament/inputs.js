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
  old_medicament: {
    isRepeated: false,
    inputs: {
      old_medicament: {type: 'hidden'}
    },
    emptyObject: ''
  },
  customDenomination: {
    isRepeated: false,
    label: 'Nom du médicament',
    hint: 'Nom du médicament qui sera affiché sur le plan de prise. ',
    inputs: {
      customDenomination: {type: 'text', placeholder: 'Nom du médicament'}
    },
    emptyObject: ''
  },
  customIndications: {
    isRepeated: true,
    label: 'Indications',
    hint: 'Indications qui seront affichées par défaut dans le plan de prise. ',
    inputs: {
      customIndications: {type: 'text', placeholder: 'Indication'}
    },
    emptyObject: [{customIndications: ''}]
  },
  conservationFrigo: {
    isRepeated: false,
    label: 'Température de conservation',
    inputs: {
      conservationFrigo: {type: 'select', options: {0: 'Température ambiante', 1: 'Frigo'}}
    },
    emptyObject: 0
  },
  conservationDuree: {
    isRepeated: true,
    label: 'Durée de conservation après ouverture',
    inputs: {
      laboratoire: {type: 'text', placeholder: 'Laboratoire'},
      duree: {type: 'text', placeholder: 'Durée de conservation'}
    },
    emptyObject: [{laboratoire: '', duree: ''}]
  },
  voiesAdministration: {
    isRepeated: true,
    label: 'Voie d\'administration',
    inputs: {
      voiesAdministration: {type: 'select', options: voiesAdministration}
    },
    emptyObject: ["1"]
  },
  commentaires: {
    isRepeated: true,
    label: 'Commentaires par défaut',
    inputs: {
      id: {type: 'hidden'},
      cible_id: {type: 'select', options: {0: 'Ce médicament'}, className: 'col-8'},
      voie_administration: {type: 'select', options: {0: 'Toutes voies d\'administration', ...voiesAdministration}, className: 'col-4'},
      commentaire: {type: 'textarea', placeholder: 'Commentaire', className: 'col-8'},
      population: {type: 'text', placeholder: 'Option (facultatif)', className: 'col-4'}
    },
    emptyObject: [{id: '', cible_id: 0, voieAdministration: 0, option: '', commentaire: ''}]
  }
}
