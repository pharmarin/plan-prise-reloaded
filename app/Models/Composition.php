<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Composition extends Model
{
  public $timestamps = false;
  protected $hidden = ['precs'];

  public function medicaments()
  {
    return $this->belongsToMany('App\Models\Medicament');
  }

  public function precs()
  {
    return $this->morphMany('App\Models\Precaution', 'cible');
  }

  public function getPrecautionsAttribute()
  {
    return $this->precs;
  }
}
