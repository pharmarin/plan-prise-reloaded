<?php

namespace App\Http\Controllers;

use App\OldMedicament;
use App\MedicamentAPI;
use App\Medicament;
use App\Repositories\MedicamentRepository;
use App\Repositories\CompositionRepository;
use Illuminate\Http\Request;

class MedicamentController extends Controller
{
    protected $medicament_repository;
    protected $DEBUG = false;

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

    public function importFromOldDatabase (Request $request) {
      if ($request->input('get') === "all") {
        $old_medicaments = OldMedicament::where('import', false)->orderBy('nomGenerique')->paginate(20);
      } elseif ($request->input('get') === "search") {
        $old_medicaments = OldMedicament::where('import', false)->where('nomMedicament', 'like', $request->input('query') . "%")->paginate(20);
      } else {
        $old_medicaments = null;
      }
      return view('medicament.import-choose')->with(compact('old_medicaments'));
    }

    public function showImportFormByID (Request $request, $id) {
      $old_medicament = OldMedicament::where('id', $id)->first();

      return view('medicament.form')->withAction('IMPORT')->with(compact('old_medicament'))->withDebug($this->DEBUG);
    }

    /**
     * Called by select to get detail of medicaments from CIS
     * @param  [Int] $request Array of CIS numbers
     * @return [Medicament] Array of medicaments
     */
    public function getDetailFromCIS (Request $request) {
      $api_selected_array = $request->input('data');
      $api_selected_detail = [];
      $compositionReference = null;

      foreach ($api_selected_array as $api_selected) {
        $api_medicament = $this->medicament_repository->getMedicamentByCIS($api_selected);

        if ($api_medicament->etatCommercialisation == false) {
          $deselect[] = $api_medicament->codeCIS;
        }

        // Check if compositions are the same or return error
        if (!$compositionReference) {
          $compositionReference = $api_medicament->compositions;
        } else {
          $compositionComparer = $api_medicament->compositions;
          if ($compositionComparer->getArray() != $compositionReference->getArray()) {
            $message = 'Problème de PA pour ' . $api_medicament->denomination . '(' . var_export($compositionComparer->getArray(), true) . ' vs. ' . var_export($compositionReference->getArray(), true) . ')\n';
            $deselect = [];
          }
        }
        // If OK, add the medicament to the array
        $api_selected_detail[] = $api_medicament;
      }

      if (isset($deselect)) {
        return json_encode(
          [
            'status' => 'error',
            'data' => (isset($message) ? $message : "") . 'Nous avons déselectionné les médicaments non commercialisés. Merci de réessayer. ',
            'deselect' => $deselect
          ]
        );
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
      return view('medicament.form')->withAction('CREATE')->withDebug($this->DEBUG);
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
        $old_medicament = OldMedicament::find($request->input('old_medicament'));
        $old_medicament->import = \Carbon\Carbon::now()->toDateTimeString();
        $old_medicament->save();
        return redirect()->route('medicament.import.search', $request->query());
      }
      return redirect()->route('medicament.create');
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
      $medicament->load('bdpm');
      return view('medicament.form')->withAction('EDIT')->with(compact('medicament'))->withDebug($this->DEBUG);
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
      $this->medicament_repository->updateFromForm($request, $medicament);
      return redirect()->route('medicament.show', $medicament->id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Medicament  $medicament
     * @return \Illuminate\Http\Response
     */
    public function destroy(Medicament $medicament)
    {
      $this->medicament_repository->delete($medicament);
      return redirect()->route('medicament.index');
    }
}
