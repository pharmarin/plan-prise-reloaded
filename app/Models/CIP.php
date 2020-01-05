<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CIP extends Model
{
  protected $table = 'bdpm_cip';

  public function CIS () {
    return $this->belongsToMany('App\Models\MedicamentAPI');
  }
}
