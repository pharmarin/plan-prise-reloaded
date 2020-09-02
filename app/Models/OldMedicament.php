<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OldMedicament extends Model
{
  protected $table = 'medics_simple';
  public $timestamps = false;
  public $appends = ['nomGenerique'];

  public function getNomGeneriqueAttribute ()
  {
    if (!isset($this->getAttributes()['nomGenerique'])) return null;
    $composition_array = explode(' + ', $this->getAttributes()['nomGenerique']);
    return array_map(function ($composition) {
      $composition_models = Composition::where('denomination', '=', $composition)->get();
      if (count($composition_models) === 0) {
        $id = $composition;
        $precautions = [];
      } elseif (count($composition_models) === 1) {
        $first_composition = $composition_models->first();
        $id = $first_composition->id;
        $composition = $first_composition->denomination;
        $precautions = $first_composition->precautions;
      } else {
        throw new \Exception('Found more than 1 composition for denomination ' . $composition);
      }
      return (object) [
        'id' => $id,
        'denomination' => $composition,
        'precautions' => $precautions
      ];
    }, $composition_array);
  }

  public function getToMedicamentAttribute ()
  {
    return $this;
    $commentaire = json_decode($this->commentaire, true) ?? [];
    return (object) [
      'id' => $this->id,
      'denomination' => $this->nomMedicament,
      'custom_indications' => array_map(function ($indication) {
        return ['custom_indications' => $indication];
      }, explode(' OU ', $this->indication)),
      'conservation_frigo' => $this->frigo,
      'conservation_duree' => json_decode($this->dureeConservation) ? array_map(function ($duree, $laboratoire) {
        return [
          'laboratoire' => $laboratoire,
          'duree' => $duree
        ];
      }, array_keys(json_decode($this->dureeConservation, true)), json_decode($this->dureeConservation, true)) : $this->dureeConservation,
      'voies_administration' => $this->_switchVoieAdminitration($this->voieAdministration),
      'precautions' => array_map(function ($precaution, $key) {
        return [
          'population' => $precaution['span'] == "" ? null : $precaution['span'],
          'commentaire' => str_replace(['<br>'], "", $precaution['text']),
          'id' => 'old_' . $key
        ];
      }, $commentaire, array_keys($commentaire)),
      'compositions' => $this->nomGenerique,
      'type' => 0
    ];
  }

  private function _switchVoieAdminitration ($voie_administration)
  {
    switch ($voie_administration) {
      case 'Orale': return 1; break;
      case 'Cutanée': return 2; break;
      case 'Auriculaire': return 3; break;
      case 'Nasale': return 4; break;
      case 'Inhalée': return 5; break;
      case 'Vaginale': return 6; break;
      case 'Oculaire': return 7; break;
      case 'Rectale': return 8; break;
      case 'Sous-cutanée': return 9; break;
      case 'Intra-musculaire': return 10; break;
      case 'Intra-veineux': return 11; break;
      case 'Intra-urétrale': return 12; break;
      default: return 0; break;
    }
  }
}
