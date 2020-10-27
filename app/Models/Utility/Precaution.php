<?php

namespace App\Models\Utility;

use Illuminate\Database\Eloquent\Model;

class Precaution extends Model
{
  use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

  protected $fillable = ['commentaire', 'population', 'voie_administration', 'precaution_cible'];
  public $timestamps = false;

  public function precautionCible()
  {
    return $this->morphTo();
  }
}
