<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Builders\MultipleTypesBuilder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PlanPrise extends Model
{
  use HasFactory;
  use SoftDeletes;
  use \Staudenmeir\EloquentJsonRelations\HasJsonRelationships;

  public function newEloquentBuilder($query)
  {
    return new MultipleTypesBuilder($query);
  }

  protected $table = 'plans_prise';

  protected $attributes = [
    'medic_data' => '[]',
    'custom_data' => '{}',
    'custom_settings' => '{}',
  ];

  protected $casts = [
    'medic_data' => 'json',
    'custom_data' => 'object',
    'custom_settings' => 'object',
  ];

  protected $fillable = ['custom_data', 'custom_settings'];

  public function user_id()
  {
    return $this->belongsTo('App\Models\User');
  }

  public function medic_data()
  {
    return $this->hasMany(Medicament::class);
  }
}
