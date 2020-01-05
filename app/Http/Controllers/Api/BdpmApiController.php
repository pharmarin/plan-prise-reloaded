<?php

namespace App\Http\Controllers\Api;

use App\Models\BdpmCis;

use App\Repositories\BdpmRepository;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BdpmApiController extends Controller
{

    protected $bdpm_repository;
    protected $DEBUG = false;

    public function __construct (BdpmRepository $bdpm_repository) {
      $this->bdpm_repository = $bdpm_repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $index = $this->bdpm_repository->all($request->query());
      /*$index->each(function ($item) {
        return $item->append('composition_grouped')
                    ->append('composition_string');
      });*/
      return response()->json($index);
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
    public function show($id)
    {
      $show = $this->bdpm_repository->show($id);
      $index->each(function ($item) {
        return $item->append('composition_grouped')
                    ->append('composition_string');
      });
      return response()->json($show);
    }

    /**
    * Called by select to get detail of medicaments from CIS
    * @param  [integer] $request Array of CIS numbers
    * @return [Medicament] Array of medicaments
    */
    public function getFromCIS (Request $request) {
      $cis_array = array_wrap($request->input('data'));

      $detail = [];

      foreach ($cis_array as $cis) {
        $medicament = $this->bdpm_repository->getFromCIS($cis);
        $medicament->append('composition_grouped')
                   ->append('composition_string')
                   ->append('composition_precautions');

        if ($medicament) {
          $detail[] = $medicament;
          $compositions = isset($compositions) ? $compositions->merge($medicament->composition): $medicament->composition;
        } else {
          $detail[] = (new BdpmCis)->getEmpty();
        }
      }

      return response()->json(
        [
          'status' => 'success',
          'data' => [
            'detail' => $detail,
            'composition' => $compositions->toArray()
          ]
        ]
      );
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
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
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
