<?php

namespace App\Http\Controllers;

use App\PlanPrise;
use App\Repositories\PlanPriseRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
      $current_pp = $pp_id > 0 ? $this->pp_repository->get($pp_id) : null;
      $javascript = [
        'routes' => mix_routes([
          'path' => [
            'planprise' => explode($_SERVER['HTTP_HOST'], route('plan-prise.index'))[1]
          ],
          'api' => [
            'planprise' => [
              'index' => route('api.plan-prise.index'),
              'store' => route('api.plan-prise.store'),
              'update' => route('api.plan-prise.index'),
              'destroy' => route('api.plan-prise.index')
            ]
          ],
          'token' => auth('api')->tokenById(Auth::id())
        ]),
        'default' => [
          'inputs' => Config::get('inputs.plan_prise')
        ],
        'current_pp' => $current_pp
      ];
      return view('plan-prise.plan')->with(compact('javascript'));
    }
}
