export const inputs = [
  {
    id: 'properties',
    class: 'col-md-3',
    inputs: [
      {
        id: "custom_indications",
        label: "Indication",
        type: 'radio'
      },
      {
        id: "conservation_duree",
        label: "Conservation après ouverture",
        display: "duree",
        type: 'radio'
      }
    ]
  },
  {
    id: 'posologies',
    class: 'col-md-3',
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
  {
    id: 'commentaires',
    class: 'col-md-6',
    inputs: [
      {
        id: "precautions",
        label: "Commentaires",
        display: 'commentaire',
        help: 'population',
        multiple: true,
        type: 'checkbox',
        class: {
          population:'col-md-4',
          commentaire: 'col-md-8'
        }
      }
    ]
  }
]
