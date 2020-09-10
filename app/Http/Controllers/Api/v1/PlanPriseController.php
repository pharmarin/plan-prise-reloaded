<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Http\Request;
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

  public function update(Request $request, $id)
  {
    return $this->pp_repository->update($id, $request['value']);
  }
}
