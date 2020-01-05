<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Precaution extends Model
{
    protected $table = 'custom_precautions';
    protected $guarded = ['id', 'created_at', 'updated_at'];
    protected $appends = ['cible_id'];

    public function compositions ()
    {
      return $this->morphedByMany('App\Models\BdpmCisCompo', 'cible', 'custom_precautions_pivot');
    }

    public function medicaments ()
    {
      return $this->morphedByMany('App\Models\Medicament', 'cible', 'custom_precautions_pivot');
    }

    public function getCibleIdAttribute ()
    {
      $pivot_table = $this->medicaments()->getTable();
      $cible_array = [];

      $pivot_array = DB::table($pivot_table)
      ->where('precaution_id', '=', $this->id)
      ->select('*')
      ->get()
      ->toArray();

      foreach ($pivot_array as $pivot) {
        switch ($pivot->cible_type) {
          case 'App\Models\Medicament':
            $cible_array[] = 'M-' . $pivot->cible_id;
            break;
          case 'App\Models\BdpmCisCompo':
            $cible_array[] = 'S-' . $pivot->cible_id;
            break;
          default: return;
        }
      }

      return implode($cible_array, "+");
    }

    public static function boot() {
      parent::boot();

      static::deleting(function ($precaution) {
        $pivot_table = $precaution->medicaments()->getTable();
        DB::table($pivot_table)->where('precaution_id', '=', $precaution->id)->delete();
      });
    }

}
