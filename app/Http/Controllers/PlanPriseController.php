<?php

namespace App\Http\Controllers;

use App\User;
use App\PlanPrise;
use App\Repositories\MedicamentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanPriseController extends Controller
{
    private $user_id;

    private $plan;

    private $medicament_repository;

    /**
     * Only accept ajax calls
     */
    public function __construct (PlanPrise $plan, MedicamentRepository $medicament_repository)
    {
      $this->middleware('ajax', ['only' => 'create']);
      $this->plan = $plan;
      $this->medicament_repository = $medicament_repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      //return $this->addToPlanPrise(-1, ['value' => '67851855', 'label' => 'test']);
      return view('plan-prise.plan');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    /*public function create()
    {
        //
    }*/

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $id = $request->input('id');
      $data = $request->input('data');
      $this->addToPlanPrise($id, $data);
    }

    /**
     * Add to Plan de prise or Create a new Plan de prise and add the medicine to it
     * @param int $id ID of the current plan de prise or -1 to create a new one
     * @param array $data Array with the CIS number of the medicine selected in search field + Denomation returned by OpenMedicament
     */
    public function addToPlanPrise ($id, $data)
    {
      $this->user_id = Auth::id();
      $pp_id = $id < 0 ? $this->getNextPlanPriseID() : $id;
      $codeCIS = $data['value'];
      $denomination = $data['label'];

      $medicament = $this->getMedicamentID($codeCIS);

      $this->plan->pp_id = $pp_id;
      $this->plan->user_id = $this->user_id;
      $this->plan->bdpm_id = $medicament;
      $this->plan->save();

      //$pp_content = User::find($this->user_id)->plans_prise->where('pp_id', 3);

      var_dump($medicament);
    }

    /**
     * Get the next available ID for the Plan de prise of the current user. If the current user has no Plan de prise, the cout begins with 1.
     * @return Int New ID of the plan de prise
     */
    private function getNextPlanPriseID () {
      $id = User::find($this->user_id)->plans_prise->max('pp_id');
      if (!$id) {
        $id = 0;
      }
      return $id + 1;
    }

    private function getMedicamentID ($codeCIS) {
      $medicament = Medicament::where('codeCIS', $codeCIS);
      if ($medicament->count() > 0) {
        return $medicament->first()->id;
      }
      //$medicament_from_api = $this->getMedicamentFromAPI($codeCIS);
      /*
      $table->bigInteger('codeCIS')->unsigned();
      $table->string('denomination');
      $table->string('formePharmaceutique');
      $table->boolean('homeopathie');
      $table->boolean('etatCommercialisation');
      $table->string('indicationTherapeutiques');
      $table->text('compositions');
      */
      /*$this->medicament->codeCIS = $medicament_from_api->codeCIS;
      $this->medicament->denomination = $medicament_from_api->denomination;
      $this->medicament->formePharmaceutique = $medicament_from_api->formePharmaceutique;
      $this->medicament->voiesAdministration = json_encode($medicament_from_api->voiesAdministration);
      $this->medicament->homeopathie = $medicament_from_api->homeopathie;
      $this->medicament->etatCommercialisation = $medicament_from_api->etatCommercialisation;
      $this->medicament->indicationsTherapeutiques = json_encode($medicament_from_api->indicationsTherapeutiques);
      $this->medicament->compositions = json_encode($medicament_from_api->compositions);
      $this->medicament->save();
      return $this->medicament->id;*/

      //return $medicament_from_api;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\PlanPrise  $planPrise
     * @return \Illuminate\Http\Response
     */
    public function show(PlanPrise $planPrise)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\PlanPrise  $planPrise
     * @return \Illuminate\Http\Response
     */
    public function edit(PlanPrise $planPrise)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\PlanPrise  $planPrise
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PlanPrise $planPrise)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\PlanPrise  $planPrise
     * @return \Illuminate\Http\Response
     */
    public function destroy(PlanPrise $planPrise)
    {
        //
    }
}
