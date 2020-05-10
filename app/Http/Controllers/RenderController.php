<?php

namespace App\Http\Controllers;

use App\PlanPrise;
use Illuminate\Support\Facades\Config;

class RenderController extends Controller
{

    public function render () {
      $javascript = [
        'routes' => [
          'api' => [
            'all' => [
              'search' => route('api.all.search'),
              'show' => route('api.all.show')
            ],
            'auth' => [
              'login' => route('passport.token'),
              'logout' => route('passport.tokens.index'),
              'info' => route('api.user.info'),
            ],
            'bdpm' => [
              'index' => route('api.bdpm.index'),
              'search' => route('api.bdpm.index')
            ],
            'composition' => [
              'get' => route('api.composition.index'),
              'search' => route('api.composition.index')
            ], 
            'planprise' => [
              'index' => route('api.plan-prise.index'),
              'store' => route('api.plan-prise.store'),
              'update' => route('api.plan-prise.index'),
              'destroy' => route('api.plan-prise.index')
            ]
          ]
        ],
        'default' => [
          'inputs' => Config::get('inputs.plan_prise'),
          'voies_administration' => Config::get('inputs.voies_administration')
        ]
      ];
      return view('react-app')->with(compact('javascript'));
    }

}
