<?php

namespace App\Http\Controllers;

use App\OldMedicament;
use App\MedicamentAPI;
use App\Medicament;
use App\Repositories\MedicamentRepository;
use Illuminate\Http\Request;

class MedicamentController extends Controller
{
    protected $medicament_repository;

    public function __construct (MedicamentRepository $medicament_repository) {
      $this->medicament_repository = $medicament_repository;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      $medicaments = $this->medicament_repository->getAll();
      return view('medicament.index')->with(compact('medicaments'));
    }

    public function importFromOldDatabase () {
      $old_medicaments = OldMedicament::where('import', false)->paginate(20);
      //var_dump($old_medicament);
      return view('medicament.import-choose')->with(compact('old_medicaments'));
    }

    public function showImportFormByID (Request $request, $id) {
      $old_medicament = OldMedicament::where('id', $id)->first();

      return view('medicament.import-form')->with(compact('old_medicament'));
    }

    /**
     * Called by select to get detail of medicaments from CIS
     * @param  [Int] $request Array of CIS numbers
     * @return [Medicament] Array of medicaments
     */
    public function getDetailFromCIS (Request $request) {
      $api_selected = $request->input('data');
      $api_selected_detail = [];
      $composition = null;

      foreach ($api_selected as $api_selected_cis) {
        $api_medicament = $this->medicament_repository->getMedicamentByCIS($api_selected_cis['key']);

        // Check if compositions are the same or return error
        if (!$composition) {
          $composition = $api_medicament->compositions;

          // Count the array length
          // If the array > 1, I need to edit composition[0] to handle the multiple compositions
          if (count($composition) > 1) return 'Long Array Compositions !!';
        } else {
          if ($composition[0]->substancesActives != $api_medicament->compositions[0]->substancesActives) {
            return json_encode(
              [
                'status' => 'error',
                'data' => 'Les compositions ne sont pas équivalentes.'
              ]
            );
          }
        }
        // If OK, add the medicament to the array
        $api_selected_detail[] = $api_medicament;
      }

      return json_encode(
        [
          'status' => 'success',
          'data' => json_encode($api_selected_detail)
        ]
      );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
      return view('medicament.create-form');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $this->medicament_repository->saveFromForm($request);
      if (!empty($request->input('old_medicament'))) {
        $old_medicament = OldMedicament::where('id', $request->input('old_medicament'))->first();
        $old_medicament->import = \Carbon\Carbon::now()->toDateTimeString();
        $old_medicament->save();
        return view('medicament.import-choose');
      }
      return view('medicament.create-form');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Medicament  $medicament
     * @return \Illuminate\Http\Response
     */
    public function show(Medicament $medicament)
    {
      return view('medicament.show')->with(compact('medicament'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Medicament  $medicament
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, Medicament $medicament)
    {
      var_dump($medicament);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Medicament  $medicament
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Medicament $medicament)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Medicament  $medicament
     * @return \Illuminate\Http\Response
     */
    public function destroy(Medicament $medicament)
    {
        //
    }
}
