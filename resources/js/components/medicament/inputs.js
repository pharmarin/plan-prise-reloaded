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
    emptyObject: () => { return '' }
  },
  custom_denomination: {
    isRepeated: false,
    label: 'Nom du médicament',
    hint: 'Nom du médicament qui sera affiché sur le plan de prise. ',
    inputs: {
      custom_denomination: {type: 'text', placeholder: 'Nom du médicament'}
    },
    emptyObject: () => { return '' }
  },
  custom_indications: {
    isRepeated: true,
    label: 'Indications',
    hint: 'Indications qui seront affichées par défaut dans le plan de prise. ',
    inputs: {
      custom_indications: {type: 'text', placeholder: 'Indication'}
    },
    emptyObject: () => { return [{ custom_indications: '' }] }
  },
  conservation_frigo: {
    isRepeated: false,
    label: 'Température de conservation',
    inputs: {
      conservation_frigo: {type: 'select', options: {0: 'Température ambiante', 1: 'Frigo'}}
    },
    emptyObject: () => { return 0 }
  },
  conservation_duree: {
    isRepeated: true,
    label: 'Durée de conservation après ouverture',
    inputs: {
      laboratoire: {type: 'text', placeholder: 'Laboratoire'},
      duree: {type: 'text', placeholder: 'Durée de conservation'}
    },
    emptyObject: () => { return [{ laboratoire: '', duree: '' }] }
  },
  voies_administration: {
    isRepeated: true,
    label: 'Voie d\'administration',
    inputs: {
      voies_administration: {type: 'select', options: voiesAdministration}
    },
    emptyObject: () => { return [{ voies_administration: '1' }] }
  },
  commentaires: {
    isRepeated: true,
    label: 'Commentaires par défaut',
    inputs: {
      id: {type: 'hidden'},
      cible_id: {type: 'select', options: {0: 'Ce médicament'}, className: 'col-sm-8'},
      voie_administration: {type: 'select', options: {0: 'Toutes voies d\'administration', ...voiesAdministration}, className: 'col-sm-4'},
      commentaire: {type: 'textarea', placeholder: 'Commentaire', className: 'col-sm-8'},
      population: {type: 'text', placeholder: 'Option (facultatif)', className: 'col-sm-4'}
    },
    emptyObject: () => { return [{ id: '', cible_id: 0, voie_administration: 0, option: '', commentaire: '' }] }
  }
}
