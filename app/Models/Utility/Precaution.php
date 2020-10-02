<?php

namespace App\Models\Utility;

use Illuminate\Database\Eloquent\Model;

class Precaution extends Model
{
  use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

  protected $fillable = ['commentaire', 'population', 'voie_administration'];
  public $timestamps = false;

  public function medicaments()
  {
    return $this->morphedByMany(
      \App\Models\Medicament::class,
      'precaution_cible'
    );
  }

  public function principes_actifs()
  {
    return $this->morphedByMany(
      \App\Models\Utility\PrincipeActif::class,
      'precaution_cible'
    );
  }
}
