<?php

namespace App\Repositories;


use App\Models\BdpmCis;
use App\Models\Medicament;
use App\Models\OldMedicament;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

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

  static function search ($request) {
    $query = $request . '%';
    $limit = 10;
    $medicaments = Medicament::where('custom_denomination', 'LIKE', $query)->take($limit)->get(['id as value', 'custom_denomination as label']);
    $old_medicaments = OldMedicament::where('nomMedicament', 'LIKE', $query)->whereNull('import')->take($limit)->get(['id as value', 'nomMedicament as label']);
    $bdpm = BdpmCis::where('denomination', 'LIKE', $query)->whereDoesntHave('medicament')->take($limit)->get(['code_cis as value', 'denomination as label']);
    $created = collect();
    $created = $created->merge($medicaments)->merge($old_medicaments);
    return [
      [
        'label' => 'Médicament créés',
        'options' => $created->map(function ($item) {
          $item['type'] = get_class($item);
          return $item;
        })
      ],
      [
        'label' => 'Base de données publique',
        'options' => $bdpm->map(function ($item) {
          $item['type'] = get_class($item);
          return $item;
        })
      ]
    ];
  }

  static function _getObject ($id, $type, $model)
  {
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

  static function getValues ($default, $custom, $columns)
  {
    $columns['compositions'] = [
      'id' => 'compositions',
      'display' => 'denomination',
      'join' => ' + '
    ];
    $columns['custom_precautions'] = [
      'id' => 'custom_precautions',
      'display' => 'custom_precautions',
      'multiple' => true,
      'merge' => 'precautions'
    ];
    $columns['conservation_frigo'] = [
      'id' => 'conservation_frigo'
    ];
    $columns['voies_administration'] = [
      'id' => 'voies_administration'
    ];
    $processed = (object) array_merge($default['value'], [
      'type' => $default['type']
    ]);
    $data = $default['data'];
    foreach ($columns as $column) {
      $value = $custom[$column['id']] ?? $data->{$column['id']} ?? "";
      if (is_array($value)) {
        if (isset($column['multiple']) && $column['multiple']) {
          // Dans le cas de merge (custom_precautions)
          if (isset($column['merge']) && $column['merge']) {
            // Si custom, on ne va utiliser que les valeurs de custom (pour custom_precautions)
            $processed->{$column['merge']} = array_merge($processed->{$column['merge']}, array_map(function ($item) use ($column) {
              return $item[$column['display']];
            }, $custom[$column['id']]));
          // else : precautions
          } else {
            $processed->{$column['id']} = array_map(function ($item) use ($column, $custom) {
              if (isset($custom[$column['id']][$item['id']]['checked']) && $custom[$column['id']][$item['id']]['checked'] === false) {
                return null;
              }
              if (isset($item['population']) && $item['population'] && !(isset($custom[$column['id']][$item['id']]['checked']) && $custom[$column['id']][$item['id']]['checked'] === true)) {
                return null;
              }
              if (isset($custom[$column['id']][$item['id']][$column['display']]) && $custom[$column['id']][$item['id']][$column['display']]) {
                // Si la valeur de display est remplie dans custom
                return $custom[$column['id']][$item['id']][$column['display']];
              }
              return $item[$column['display']];
            }, $data->{$column['id']}); // On utilise la valeur de défaut
          }
        } else {
          if (isset($column['join']) && $column['join']) {
            $processed->{$column['id']} = implode($column['join'], array_map(function ($item) use ($column) {
              return is_array($item) ? $item[$column['display']] : $item->{$column['display']};
            }, $value));
          }
        }
      } else {
        $processed->{$column['id']} = $value;
      }
    }
    $voies_administration = Config::get('inputs.voies_administration');
    $processed->voies_administration = $voies_administration[$processed->voies_administration];
    return $processed;
  }

}
