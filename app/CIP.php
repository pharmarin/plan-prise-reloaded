<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CIP extends Model
{
  protected $table = 'bdpm_cip';

  public function CIS () {
    return $this->belongsToMany('App\MedicamentAPI');
  }
}
