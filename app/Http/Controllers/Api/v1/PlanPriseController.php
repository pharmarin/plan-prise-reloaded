<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Repositories\PlanPriseRepository;

class PlanPriseController extends Controller
{
  /**
  * Create a new ApiFrontendController instance.
  *
  * @return void
  */
  public function __construct(PlanPriseRepository $pp_repository)
  {
    $this->middleware('ajax');
    $this->pp_repository = $pp_repository;
  }
  
  /**
   * Obtenir la liste des plans de prise
   * ou le plan de prise si un ID est fourni.
   *
   * @return \Illuminate\Http\Response
   */
  public function index($pp_id = null)
  {
    return response()->json(
      $this->pp_repository->index($pp_id)
    );
  }
}