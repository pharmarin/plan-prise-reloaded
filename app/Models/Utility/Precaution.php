<?php

namespace App\Models\Utility;

use Illuminate\Database\Eloquent\Model;

class Precaution extends Model
{
  use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

  protected $fillable = ['commentaire', 'population', 'voie_administration'];
  public $timestamps = false;

  public function precaution_cible()
  {
    return $this->morphTo();
  }
}
