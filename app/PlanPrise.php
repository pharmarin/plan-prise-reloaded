<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlanPrise extends Model
{

  use SoftDeletes;

  protected $table = 'plans_prise';

  protected $appends = ['medic_data_detail'];

  protected $attributes = [
    'medic_data' => '[]',
    'custom_data' => '{}'
  ];

  protected $casts = [
    'medic_data' => 'array',
    'custom_data' => 'array'
  ];

  public $api_repository;

  public function __construct () {
    $this->api_repository = resolve('App\Repositories\MedicamentAPIRepository');parent::__construct();
  }

  public function user_id ()
  {
    return $this->belongsTo('App\User');
  }

  public function getMedicDataDetailAttribute ()
  {
    return array_map(function ($code_cis) {
      $medicament = $this->api_repository->getMedicamentAPIByCIS($code_cis);
      return [
        'data' => $medicament,
        'custom_data' => $medicament->custom_values
      ];
    }, $this->medic_data);
  }
}
