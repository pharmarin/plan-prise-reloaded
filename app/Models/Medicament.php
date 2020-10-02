<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

use App\Repositories\BdpmRepository;
use App\Repositories\CompositionRepository;
use App\Repositories\PrecautionRepository;

class Medicament extends Model
{
  use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

  protected $table = 'medicaments';
  protected $appends = ['type'];
  protected $casts = [
    'conservation_duree' => 'array',
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
}
