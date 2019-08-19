<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Medicament extends Model
{
    protected $table = 'bdpm_medics';

    public function customValues () {
      return $this->belongsToMany('App\MedicamentCustom', 'pivot_medics', 'CIS', 'custom_id');
    }

    public function getCompositionsAttribute ($compositions_json) {
      return json_decode($compositions_json);
    }
}
