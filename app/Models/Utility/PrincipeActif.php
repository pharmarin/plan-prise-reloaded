<?php

namespace App\Models\Utility;

use Illuminate\Database\Eloquent\Model;

class PrincipeActif extends Model
{
  use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

  protected $table = 'principes_actifs';

  public function medicaments()
  {
    return $this->hasManyJson(
      \App\Models\Medicament::class,
      'principes_actifs'
    );
  }
}
