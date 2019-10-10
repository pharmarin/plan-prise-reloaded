let MESSAGES = {
  planPrise: {
    addToPP: (denomination) => {
      return denomination ? `Ajout de ${denomination} au plan de prise en cours...` : 'Ajout du médicament au plan de prise en cours...'
    },
    editPP: 'Sauvegarde en cours...',
    removeFromPP: (denomination) => {
      return denomination ? `Supression de ${denomination} en cours...` : 'Suppression d\'un médicament en cours...'
    }
  }
}

export default MESSAGES
