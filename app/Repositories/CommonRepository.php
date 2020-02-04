<?php

namespace App\Repositories;


use App\Models\BdpmCis;
use App\Models\Medicament;
use App\Models\OldMedicament;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommonRepository {

  static function find ($id, $type)
  {
    switch ($type) {
      case Medicament::class:
        return Medicament::find($id);
        break;
      case OldMedicament::class:
        return OldMedicament::find($id)->to_medicament;
        break;
      case BdpmCis::class:
        return BdpmCis::find($id)->to_medicament;
        break;
      default:
        throw new \Exception('Type de modèle non envoyé. ');
        break;
    }
  }

}
