<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\MedicamentPrecaution;

class Medicament extends Model
{
    protected $table = 'custom_medics';

    protected $appends = ['precautions'];

    public function bdpm () {
      return $this->hasMany('App\MedicamentAPI');
    }

    public function getPrecautionsAttribute () {
      $voiesAdministration = $this->voiesAdministrationArray;
      array_push($voiesAdministration, 0);
      return MedicamentPrecaution::whereIn('voie_administration', $voiesAdministration)
        ->where(function ($query) {
          $query->where('cible', 'medicament')
          ->where('cible_id', 'M-' . $this->id)
          ->orWhere('cible', 'substance')
          ->whereIn('cible_id', array_keys($this->getCompositionAttribute()));
        })
        ->get();
    }

    // Edit attribute
    public function getConservationDureeAttribute ($conservationArray) {
      $conservationArray = json_decode($conservationArray);
      if ($conservationArray[0]->laboratoire === null && $conservationArray[0]->duree === null) return null;
      return $conservationArray;
    }


    // Add attribute
    public function getCompositionAttribute () {
      $substancesArray = [];
      $compositions = $this->bdpm()->first()->compositions;
      foreach ($compositions as $composition) {
        foreach ($composition->substancesActives as $substanceActive) {
          $substancesArray["S-" . $substanceActive->codeSubstance] = $substanceActive->denominationSubstance . ' ' . $substanceActive->dosageSubstance;
        }
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
    public function getVoiesAdministrationStringAttribute () {
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
        return $voiesAdministrationValues[$voieAdministration->voiesAdministration];
      }, $voiesAdministrationArray);
    }

    // Add attribute
    public function getVoiesAdministrationArrayAttribute () {
      $voiesAdministrationArray = json_decode($this->voiesAdministration);
      return array_map(function ($voieAdministration) {
        return $voieAdministration->voiesAdministration;
      }, $voiesAdministrationArray);
    }
}
