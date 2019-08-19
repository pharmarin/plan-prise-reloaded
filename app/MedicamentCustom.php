<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MedicamentCustom extends Model
{
    protected $table = 'custom_medics';

    public function apiMedic () {
      return $this->belongsToMany('App\Medicament', 'pivot_medics', 'custom_id', 'CIS');
    }
}
