<?php

namespace App\Models;

use App\Models\Precaution;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class BdpmCisCompo extends Model
{
    protected $table = 'bdpm_cis_compo';
    protected $guarded = [];
    public $timestamps = false;

    public function getPrecautionsAttribute ()
    {
      $id = $this->code_substance;
      $compositions_table = $this->getTable();
      $precautions_table = (new Precaution)->getTable();
      $pivot_table = (new Precaution)->compositions()->getTable();
      if ($id > 0) {
        return Precaution::join($pivot_table, $pivot_table.'.precaution_id', '=', $precautions_table.'.id')
          ->join($compositions_table, $compositions_table.'.code_substance', '=', $pivot_table.'.cible_id')
          ->where('cible_id', '=', $id)
          ->where(function ($query) {
            $query->where('cible_type', '=', 'App\\Models\\BdpmCisCompo')
                  ->orWhere('cible_type', '=', 'App\\\\Models\\\\BdpmCisCompo');
          })
          ->select($precautions_table.'.*')
          ->distinct()
          ->get()
          ->toArray();
      }
    }
}
