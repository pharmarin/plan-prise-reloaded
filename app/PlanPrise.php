<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PlanPrise extends Model
{
  protected $table = 'plans_prise';

  protected $fillable = ['user_id', 'pp_id', 'bdpm_id'];

  public function user () {
    return $this->belongsTo('App\User');
  }
}
