<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Log;

class Medicament extends Model
{
  use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

  protected $appends = ['type'];
  protected $casts = [
    'conservation_duree' => 'array',
    'conservation_frigo' => 'boolean',
    'indications' => 'array',
    'principes_actifs' => 'array',
    'voies_administration' => 'array',
  ];
  protected $fillable = [
    'denomination',
    'composition',
    'principes_actifs',
    'indications',
    'conservation_frigo',
    'conservation_duree',
    'voies_administration',
  ];

  public function getTypeAttribute()
  {
    return 'medicament';
  }

  public function composition()
  {
    return $this->belongsToJson(
      \App\Models\Utility\PrincipeActif::class,
      'principes_actifs'
    );
  }

  public function precautions()
  {
    return $this->morphMany(
      \App\Models\Utility\Precaution::class,
      'precaution_cible'
    );
  }
}
