<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicamentCIP extends Model
{
  protected $table = 'bdpm_cip';
  protected $fillable = ['CIP7', 'CIP13'];
  public $timestamps = false;

  public function medicament_id () {
    return $this->belongsTo('App\Models\MedicamentAPI');
  }
}
