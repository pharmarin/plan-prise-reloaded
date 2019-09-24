<?php

namespace App\Http\Controllers;

use App\OldMedicament;
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

    public function search (Request $request)
    {
      if (!$request->input('query')) {
        return view('medicament.search');
      }
      $medicaments = $this->medicament_repository->getLike($request->input('query'));
      return view('medicament.index')->with(compact('medicaments'));
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
    * Called by select to get detail of medicaments from CIS
    * @param  [integer] $request Array of CIS numbers
    * @return [Medicament] Array of medicaments
    */
    public function getDetailFromCIS (Request $request) {
      $cis_array = array_wrap($request->input('data'));
      $detail = [];

      foreach ($cis_array as $cis) {
        $medicament = $this->medicament_repository->getMedicamentByCIS($cis);

        if ($medicament) {
          $detail[] = $medicament->load('bdpm');
        } else {
          $detail[] = (new Medicament)->getEmpty();
        }
      }

      return response()->json(
        [
          'status' => 'success',
          'data' => json_encode($detail)
        ]
      );
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
