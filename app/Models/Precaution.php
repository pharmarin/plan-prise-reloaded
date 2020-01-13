<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Precaution extends Model
{
    protected $table = 'custom_precautions';
    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function cible ()
    {
      return $this->morphTo();
    }
}
