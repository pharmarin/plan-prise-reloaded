<?php

namespace App\Http\Controllers;

use App\Models\OldMedicament;
use App\Models\Medicament;
use App\Repositories\MedicamentRepository;
use App\Repositories\CompositionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

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
      $medicaments = $this->medicament_repository->all();
      $columns = ['custom_denomination'];
      return view('medicament.index')->with(compact('medicaments', 'columns'));
    }

    public function search (Request $request)
    {
      if ($request->has('query')) {
        $medicaments = $this->medicament_repository->getLike($request->input('query'));
        $columns = ['custom_denomination'];
        return view('medicament.search')->with(compact('medicaments', 'columns'));
      }
      return view('medicament.search');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
      $javascript = [
        'routes' => mix_routes([
          'action' => route('medicament.store')
        ]),
        'default_inputs' => Config::get('inputs.medicament')
      ];
      return view('medicament.form')->withAction('CREATE')->with(compact('javascript'));
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
      $javascript = [
        'routes' => mix_routes([
          'action' => route('medicament.update', $medicament->id)
        ]),
        'default_inputs' => Config::get('inputs.medicament'),
        'medicament' => $medicament
      ];
      return view('medicament.form')->withAction('EDIT')->with(compact('medicament', 'javascript'));
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
