<?php

namespace App\Models;

use App\Models\Utility\PrincipeActif;
use Illuminate\Database\Eloquent\Model;
use Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

class Medicament extends Model
{
  use HasJsonRelationships;

  protected $appends = ['type'];

  protected $casts = [
    'cis' => 'array',
    'conservation_duree' => 'array',
    'conservation_frigo' => 'boolean',
    'indications' => 'array',
    'principes_actifs' => 'array',
    'voies_administration' => 'array',
  ];

  protected $fillable = [
    'denomination',
    'principes_actifs',
    'indications',
    'conservation_frigo',
    'conservation_duree',
    'voies_administration',
  ];

  public function getTypeAttribute()
  {
    return 'medicaments';
  }

  public function composition()
  {
    return $this->belongsToJson(
      PrincipeActif::class,
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
