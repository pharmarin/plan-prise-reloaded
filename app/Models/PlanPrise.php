<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use \App\Repositories\CommonRepository;

class PlanPrise extends Model
{

  use SoftDeletes;

  protected $table = 'plans_prise';

  protected $attributes = [
    'medic_data' => '[]',
    'custom_data' => '{}',
    'custom_settings' => '{}'
  ];

  protected $casts = [
    'medic_data' => 'collection',
    'custom_data' => 'collection',
    'custom_settings' => 'object'
  ];

  public function user_id ()
  {
    return $this->belongsTo('App\Models\User');
  }

  public function getDataAttribute ()
  {
    $reference_array = $this->medic_data;
    return $reference_array ? $reference_array->map(function ($reference) {
      return CommonRepository::find($reference['id'], $reference['type']);
    })->values()->all() : [];
  }

}
