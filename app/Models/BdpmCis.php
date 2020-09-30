<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\CompositionRepository;
use App\Repositories\PrecautionRepository;

class BdpmCis extends Model
{
  protected $guarded = [];
  protected $primaryKey = 'code_cis';
  public $timestamps = false;

  public function medicament()
  {
    return $this->belongsToMany(
      'App\Models\Medicament',
      'bdpm_custom_pivot',
      'code_cis',
      'medicament_id'
    );
  }

  public function cip()
  {
    return $this->hasMany('App\Models\BdpmCisCip', 'code_cis', 'code_cis');
  }

  public function getToMedicamentAttribute()
  {
    return (object) [
      'id' => $this->code_cis,
      'denomination' => $this->denomination,
      'type' => 2,
    ];
  }
}
