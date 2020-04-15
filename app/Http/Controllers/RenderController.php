<?php

namespace App\Http\Controllers;

use App\PlanPrise;
use Illuminate\Support\Facades\Config;

class RenderController extends Controller
{

    public function render () {
      $javascript = [
        'routes' => mix_routes([
          'api' => [
            'planprise' => [
              'index' => route('api.plan-prise.index'),
              'store' => route('api.plan-prise.store'),
              'update' => route('api.plan-prise.index'),
              'destroy' => route('api.plan-prise.index')
            ]
          ]
        ]),
        'default' => [
          'inputs' => Config::get('inputs.plan_prise'),
          'voies_administration' => Config::get('inputs.voies_administration')
        ]
      ];
      return view('react-app')->with(compact('javascript'));
    }

}
