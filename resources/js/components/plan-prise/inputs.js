export const inputs = {
  properties: {
    class: 'col-md-3',
    collapse: true,
    inputs: [
      {
        id: "custom_indications",
        label: "Indication",
      },
      {
        id: "conservation_duree",
        label: "Conservation après ouverture",
        display: "duree",
        readOnly: true
      }
    ]
  },
  posologies: {
    class: 'col-md-3',
    collapse: false,
    inputs: [
      {
        id: "poso_matin",
        label: "Matin"
      },
      {
        id: "poso_midi",
        label: "Midi"
      },
      {
        id: "poso_soir",
        label: "Soir"
      }
    ]
  },
  commentaires: {
    class: 'col-md-6',
    collapse: true,
    inputs: [
      {
        id: "precautions",
        label: "Commentaires",
        display: 'commentaire',
        help: 'population',
        multiple: true,
        class: {
          population: 'col-md-4',
          commentaire: 'col-md-8'
        }
      }
    ]
  }
}
