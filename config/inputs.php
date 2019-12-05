<?php

$voiesAdministration = [
  1 => 'Orale',
  2 => 'Cutanée',
  3 => 'Auriculaire',
  4 => 'Nasale',
  5 => 'Inhalée',
  6 => 'Vaginale',
  7 => 'Oculaire',
  8 => 'Rectale',
  9 => 'Sous-cutanée',
  10 => 'Intra-musculaire',
  11 => 'Intra-veineux',
  12 => 'Intra-urétrale'
];

return [
  'medicament' => [
    'old_medicament' => [
      'isRepeated' => false,
      'inputs' => [
        'old_medicament' => [
          'type' => 'hidden'
        ]
      ],
      'emptyObject' => ''
    ],
    'custom_denomination' => [
      'isRepeated' => false,
      'label' => 'Nom du médicament',
      'hint' => 'Nom du médicament qui sera affiché sur le plan de prise. ',
      'inputs' => [
        'custom_denomination' => [
          'type' => 'text',
          'placeholder' => 'Nom du médicament'
        ]
      ],
      'emptyObject' => ''
    ],
    'custom_indications' => [
      'isRepeated' => true,
      'label' => 'Indications',
      'hint' => 'Indications qui seront affichées par défaut dans le plan de prise. ',
      'inputs' => [
        'custom_indications' => [
          'type' => 'text',
          'placeholder' =>
          'Indication'
        ]
      ],
      'emptyObject' => (object) [(object) [ 'custom_indications' => '' ]]
    ],
    'conservation_frigo' => [
      'isRepeated' => false,
      'label' => 'Température de conservation',
      'inputs' => [
        'conservation_frigo' => [
          'type' => 'select',
          'options' => [0 => 'Température ambiante', 1 => 'Frigo']
        ]
      ],
      'emptyObject' => 0
    ],
    'conservation_duree' => [
      'isRepeated' => true,
      'label' => 'Durée de conservation après ouverture',
      'inputs' => [
        'laboratoire' => [
          'type' => 'text',
          'placeholder' => 'Laboratoire'
        ],
        'duree' => [
          'type' => 'text',
          'placeholder' => 'Durée de conservation'
        ]
      ],
      'display' => 'duree',
      'emptyObject' => (object) [(object) [ 'laboratoire' => '', 'duree' => '' ]]
    ],
    'voies_administration' => [
      'isRepeated' => true,
      'label' => 'Voie d\'administration',
      'inputs' => [
        'voies_administration' => [
          'type' => 'select',
          'options' => $voiesAdministration
        ]
      ],
      'emptyObject' => (object) [(object) [ 'voies_administration' => '1' ]]
    ],
    'commentaires' => [
      'isRepeated' => true,
      'label' => 'Commentaires par défaut',
      'inputs' => [
        'id' => ['type' => 'hidden'],
        'cible_id' => ['type' => 'select', 'options' => [0 => 'Ce médicament'], 'className' => 'col-sm-8'],
        'voie_administration' => [
          'type' => 'select',
          'options' => [
            0 => 'Toutes voies d\'administration'
          ] + $voiesAdministration,
          'className' => 'col-sm-4'
        ],
        'commentaire' => [
          'type' => 'textarea',
          'placeholder' => 'Commentaire',
          'className' => 'col-sm-8'
        ],
        'population' => [
          'type' => 'text',
          'placeholder' => 'Option (facultatif)',
          'className' => 'col-sm-4'
        ]
      ],
      'display' => 'commentaire',
      'emptyObject' => (object) [(object) [ 'id' => '', 'cible_id' => 0, 'voie_administration' => 0, 'option' => '', 'commentaire' => '' ]]
    ]
  ],
  'plan_prise' => [
    'inputs' => [
      'poso_matin' => [
        'label' => 'Matin',
        'default' => true
      ],
      'poso_10h' => [
        'label' => '10h'
      ],
      'poso_midi' => [
        'label' => 'Midi',
        'default' => true
      ],
      'poso_16h' => [
        'label' => '16h'
      ],
      'poso_soir' => [
        'label' => 'Soir',
        'default' => true
      ],
      'poso_coucher' => [
        'label' => 'Coucher'
      ],
    ]
  ]
];