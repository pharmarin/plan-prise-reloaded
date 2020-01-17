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
        } elseif (count($composition_models) === 1) {
          $id = $composition_models->first()->id;
          $composition = $composition_models->first()->denomination;
        } else {
          throw new \Exception('Found more than 1 composition for denomination ' . $composition);
        }
        return (object) [
          'id' => $id,
          'denomination' => $composition
        ];
      }, $composition_array);
    }
}
