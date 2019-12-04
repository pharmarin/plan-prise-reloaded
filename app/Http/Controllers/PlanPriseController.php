<?php

namespace App\Http\Controllers;

use App\PlanPrise;
use App\Repositories\PlanPriseRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

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
      $javascript = [
        'PP_base_url' => str_replace('http://'.$_SERVER['HTTP_HOST'], '',  url()->to('/')).route('plan-prise.index', [], false),
        'default_settings' => Config::get('inputs.plan_prise'),
        'current_pp' => $current_pp
      ];
      return view('plan-prise.plan')->with(compact('javascript'));
    }

    public function api (Request $request)
    {
      $pp_id = $request->input('pp_id');
      $request = $request->input('request');
      switch ($request['action']) {
        case 'store':
          return response()->json(
            $this->pp_repository->storePP($pp_id, $request['value'])
          );
        case 'edit':
          return response()->json(
            $this->pp_repository->editPP($pp_id, $request['value'])
          );
        case 'delete':
          return response()->json(
            $this->pp_repository->deletePP($pp_id, $request['value'])
          );
        case 'destroy':
          return response()->json(
            $this->pp_repository->destroyPP($pp_id)
          );
        case 'settings':
          return response()->json(
            $this->pp_repository->settingsPP($pp_id, $request['value'])
          );
        default:
          // code...
          break;
      }
    }
}
