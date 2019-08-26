<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Medicament extends Model
{
    protected $table = 'custom_medics';

    public function medicamentAPI () {
      return $this->hasMany('App\MedicamentAPI');
    }

    public function precautions () {
      return $this->hasMany('App\MedicamentPrecaution', 'cible_id');
    }

    // Edit attribute
    public function getConservationDureeAttribute ($conservationArray) {
      $conservationArray = json_decode($conservationArray);
      if ($conservationArray[0]->laboratoire === null && $conservationArray[0]->duree === null) return null;
      return $conservationArray;
    }


    // Add attribute
    public function getCompositionAttribute () {
      $substancesActives = $this->medicamentAPI()->first()->compositions[0]->substancesActives;
      $substancesArray = [];
      foreach ($substancesActives as $substanceActive) {
        $substancesArray["S-" . $substanceActive->codeSubstance] = $substanceActive->denominationSubstance . ' ' . $substanceActive->dosageSubstance;
      }

      return $substancesArray;
    }

    // Add attribute
    public function getIndicationsAttribute () {
      $customIndications = json_decode($this->customIndications);
      return array_map(function ($indication) {
        return $indication->customIndications;
      }, $customIndications);
    }

    // Add attribute
    public function getVoieAdministrationStringAttribute () {
      $voiesAdministrationArray = json_decode($this->voiesAdministration);
      $voiesAdministrationValues = [
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
      return array_map(function ($voieAdministration) use ($voiesAdministrationValues) {
        return $voiesAdministrationValues[$voieAdministration->voieAdministration];
      }, $voiesAdministrationArray);
    }
}
