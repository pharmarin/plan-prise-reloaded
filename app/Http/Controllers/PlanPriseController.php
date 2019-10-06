<?php

namespace App\Http\Controllers;

use App\PlanPrise;
use App\Repositories\PlanPriseRepository;
use Illuminate\Http\Request;

class PlanPriseController extends Controller
{
    private $pp_repository;

    /**
     * Only accept ajax calls
     */
    public function __construct (PlanPriseRepository $pp_repository)
    {
      $this->middleware('ajax', ['only' => 'create']);
      $this->pp_repository = $pp_repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index ($pp_id = null)
    {
      $current_pp = $pp_id > 0 ? $this->pp_repository->getPP($pp_id) : null;
      return view('plan-prise.plan')->with(compact('current_pp'));
    }

    public function api (Request $request)
    {
      //var_dump($request->all());
      $pp_id = $request->input('pp_id');
      $request = $request->input('request');
      switch ($request['action']) {
        case 'store':
          return response()->json(
            $this->pp_repository->storePP($pp_id, $request['value'])
          );
          break;
        case 'edit':
          return response()->json(
            $this->pp_repository->editPP($pp_id, $request['value'])
          );
          break;
        case 'delete':
          return response()->json(
            $this->pp_repository->deletePP($pp_id, $request['value'])
          );
          break;
        default:
          // code...
          break;
      }
    }
}
