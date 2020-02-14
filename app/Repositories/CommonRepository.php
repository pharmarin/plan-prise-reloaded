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
        $model = Medicament::find($id);
        break;
      case OldMedicament::class:
        $model = OldMedicament::find($id);
        $model = $model ? $model->to_medicament : null;
        break;
      case BdpmCis::class:
        $model = BdpmCis::find($id);
        $model = $model ? $model->to_medicament : null;
        break;
      default:
        throw new \Exception('Type de modèle non envoyé. ');
        break;
    }
    return CommonRepository::_getObject($id, $type, $model);
  }

  static function _getObject ($id, $type, $model) {
    if (!$model) return null;
    if (get_class($model) === Medicament::class) $model->load('compositions');
    return [
      'type' => $type,
      'value' => [
        'id' => $id,
        'denomination' => $model->custom_denomination
      ],
      'data' => $model
    ];
  }

}
