<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    return $this->morphToMany(
      \App\Models\Utility\Precaution::class,
      'precaution_cible'
    );
  }

  public function getConservationDureeAttribute($conservations)
  {
    return array_map(function ($conservation) {
      return [
        "laboratoire" => strval($conservation->laboratoire),
        "duree" => strval($conservation->duree)
      ];
    }, json_decode($conservations));
  }
}
