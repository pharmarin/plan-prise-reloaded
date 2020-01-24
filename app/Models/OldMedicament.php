<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OldMedicament extends Model
{
    protected $table = 'medics_simple';
    public $timestamps = false;
    public $appends = ['nomGenerique'];

    public function getNomGeneriqueAttribute ()
    {
      $composition_array = explode(' + ', $this->getAttributes()['nomGenerique']);
      return array_map(function ($composition) {
        $composition_models = Composition::where('denomination', '=', $composition)->get();
        if (count($composition_models) === 0) {
          $id = $composition;
          $precautions = [];
        } elseif (count($composition_models) === 1) {
          $first_composition = $composition_models->first();
          $id = $first_composition->id;
          $composition = $first_composition->denomination;
          $precautions = $first_composition->precautions;
        } else {
          throw new \Exception('Found more than 1 composition for denomination ' . $composition);
        }
        return (object) [
          'id' => $id,
          'denomination' => $composition,
          'precautions' => $precautions
        ];
      }, $composition_array);
    }
}
