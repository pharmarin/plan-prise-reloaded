<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\PlanPriseRepository;

class PlanPriseApiController extends Controller
{

    private $pp_repository;

    public function __construct (PlanPriseRepository $pp_repository)
    {
      $this->middleware('ajax');
      $this->pp_repository = $pp_repository;
    }

    public function searchMedicaments (Request $request)
    {
      $query = $request->input('query') . '%';
      $medicaments = \App\Models\Medicament::where('custom_denomination', 'LIKE', $query)->get(['id as value', 'custom_denomination as label']);
      $old_medicaments = \App\Models\OldMedicament::where('nomMedicament', 'LIKE', $query)->whereNull('import')->get(['id as value', 'nomMedicament as label']);
      $bdpm = \App\Models\BdpmCis::where('denomination', 'LIKE', $query)->whereDoesntHave('medicament')->get(['code_cis as value', 'denomination as label']);
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

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pp_id = null)
    {
      //dd($this->pp_repository->index($pp_id));
      return $this->_jsonResponse(
        $this->pp_repository->index($pp_id)
      );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($pp_id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($pp_id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $pp_id)
    {
      return $this->_jsonResponse(
        $this->pp_repository->update($pp_id, $request['value'])
      );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($pp_id)
    {
      return $this->_jsonResponse(
        $this->pp_repository->destroy($pp_id)
      );
    }

    private function _jsonResponse($response)
    {
      switch ($response['status']) {
        case 'success':
          return response()->json($response['data'], 200);
          break;
        case 'error':
          return response()->json($response['data'], 400);
          break;
        default:
          throw new \Exception('Pas de code erreur. ');
      }
    }
}
