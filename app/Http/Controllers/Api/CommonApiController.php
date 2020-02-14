<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use \App\Models\Medicament;
use \App\Models\OldMedicament;
use \App\Models\BdpmCis;
use \App\Repositories\CommonRepository;

class CommonApiController extends Controller
{

    public function search (Request $request)
    {
      $query = $request->input('query') . '%';
      $medicaments = Medicament::where('custom_denomination', 'LIKE', $query)->get(['id as value', 'custom_denomination as label']);
      $old_medicaments = OldMedicament::where('nomMedicament', 'LIKE', $query)->whereNull('import')->get(['id as value', 'nomMedicament as label']);
      $bdpm = BdpmCis::where('denomination', 'LIKE', $query)->whereDoesntHave('medicament')->get(['code_cis as value', 'denomination as label']);
      $created = collect();
      $created = $created->merge($medicaments)->merge($old_medicaments);
      return response()->json(
        [
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

        ]
      );
    }

    public function show (Request $request)
    {
      return response()->json(
        CommonRepository::find($request->input('id'), $request->input('type'))
      );
    }
}
