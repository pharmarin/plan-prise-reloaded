<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\MedicamentPrecaution;
use App\Repositories\MedicamentRepository;
use App\Repositories\CompositionRepository;

class MedicamentAPI extends Model
{
    protected $table = 'bdpm_medics';

    protected $appends = ['associatedPrecautions', 'compositionsArray', 'compositionsString'];

    public function customValues () {
      return $this->belongsToMany('App\Medicament');
    }

    public function cip () {
      return $this->hasMany('App\CIP', 'medicament_id');
    }

    public function getCompositionsAttribute ($compositions_json) {
      $composition = json_decode($compositions_json);
      return new CompositionRepository($composition);
    }

    public function getAssociatedPrecautionsAttribute () {
      return MedicamentPrecaution::where('cible', 'substance')
        ->whereIn('cible_id', array_map(function ($composition) {
          return $composition->codeSubstance;
        }, $this->compositionsArray))
        ->get();
    }

    // Add attribute
    public function getCompositionsArrayAttribute () {
      return $this->compositions->getArray();
    }

    // Add attribute
    public function getCompositionsStringAttribute () {
      return $this->compositions->getString();
    }
}
