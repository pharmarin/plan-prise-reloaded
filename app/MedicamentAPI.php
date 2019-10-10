<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\MedicamentPrecaution;
use App\Repositories\MedicamentRepository;
use App\Repositories\CompositionRepository;

class MedicamentAPI extends Model
{
    protected $table = 'bdpm_medics';

    protected $appends = ['associated_precautions', 'compositions_array', 'compositions_string'];

    public function custom_values () {
      return $this->belongsTo('App\Medicament', 'medicament_id');
    }

    public function cip () {
      return $this->hasMany('App\CIP', 'medicament_id');
    }

    public function getIndicationsTherapeutiquesAttribute ($indications) {
      return stripslashes($indications);
    }

    public function getCompositionsAttribute ($compositions_json) {
      $composition = json_decode($compositions_json);
      return new CompositionRepository($composition);
    }

    public function getAssociatedPrecautionsAttribute () {
      return MedicamentPrecaution::where('cible', 'substance')
        ->whereIn('cible_id', array_map(function ($composition) {
          return $composition->codeSubstance;
        }, $this->compositions_array))
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
