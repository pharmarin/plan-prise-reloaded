<?php

namespace App\Http\Controllers;

use App\OldMedicament;
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
        //
    }

    public function importFromOldDatabase () {
      $old_medicaments = OldMedicament::where('import', false)->paginate(20);
      //var_dump($old_medicament);
      return view('medicament.import')->with('old_medicaments', $old_medicaments);
    }

    public function showImportFormByID (Request $request, $id) {
      $old_medicament = OldMedicament::where('id', $id)->first();

      $api_search = $this->medicament_repository->getMedicamentListFromAPI($old_medicament->nomMedicament);

      return view('medicament.import-form')->with(compact('old_medicament', 'api_search'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
      $old_medicament = new OldMedicament();
      $old_medicament_id = $request->input('old_medicament');
      $api_selected = $request->input('api_selected');
      $api_selected_detail = [];
      $composition = null;

      if ($old_medicament_id) {
        $old_medicament = OldMedicament::where('id', $old_medicament_id)->first();
      }
      foreach ($api_selected as $api_selected_cis) {
        $api_medicament = $this->medicament_repository->getMedicamentByCIS($api_selected_cis);

        // Check if compositions are the same or return error
        if (!$composition) {
          $composition = $api_medicament->compositions;

          // Count the array length
          // If the array > 1, I need to edit composition[0] to handle the multiple compositions
          if (count($composition) > 1) echo 'Long Array Compositions !!';
        } else {
          if ($composition[0]->substancesActives != $api_medicament->compositions[0]->substancesActives) {
            return 'Error: Compositions are different. ';
          }
        }
        // If OK, add the medicament to the array
        $api_selected_detail[] = $api_medicament;
      }

      return view('medicament.create-form')->with(compact('old_medicament', 'api_selected_detail'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $medicament_id = $this->medicament_repository->saveFromForm($request);
      var_dump($medicament_id);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Medicament  $medicament
     * @return \Illuminate\Http\Response
     */
    public function show(Medicament $medicament)
    {
        //
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
