<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MedicamentAPI extends Model
{
    protected $table = 'bdpm_medics';

    protected $appends = ['associatedPrecautions'];

    public function customValues () {
      return $this->belongsToMany('App\Medicament');
    }

    public function cip () {
      return $this->hasMany('App\CIP', 'medicament_id');
    }

    public function getCompositionsAttribute ($compositions_json) {
      return json_decode($compositions_json);
    }

    public function getAssociatedPrecautionsAttribute () {
      return MedicamentPrecaution::where('cible', 'substance')
        ->whereIn('cible_id', array_keys($this->getCompositionArrayAttribute()))
        ->get();
    }

    // Add attribute
    public function getCompositionArrayAttribute () {
      $substancesActives = $this->compositions[0]->substancesActives;
      $substancesArray = [];
      foreach ($substancesActives as $substanceActive) {
        $substancesArray["S-" . $substanceActive->codeSubstance] = $substanceActive->denominationSubstance . ' ' . $substanceActive->dosageSubstance;
      }

      return $substancesArray;
    }
}
