<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\CompositionRepository;
use App\Repositories\PrecautionRepository;

class BdpmCis extends Model
{
    protected $hidden = ['compo'];
    protected $guarded = [];
    protected $primaryKey = 'code_cis';
    //protected $appends = ['composition', 'composition_string', 'composition_grouped'];
    public $timestamps = false;

    public function medicament ()
    {

      return $this->belongsToMany('App\Models\Medicament', 'bdpm_custom_pivot', 'medicament_id', 'code_cis');

    }

    public function cip ()
    {

      return $this->hasMany('App\Models\BdpmCisCip', 'code_cis', 'code_cis');

    }
}
