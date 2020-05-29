<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Support\Facades\Config;
use App\Http\Controllers\Controller;

class FrontendController extends Controller
{
  /**
  * Create a new ApiFrontendController instance.
  *
  * @return void
  */
  public function __construct()
  {
    $this->middleware('ajax');
  }
  
  public function config()
  {
    $config = [
      "validation" => Config::get('validation'),
      "default" => [
        "pp_inputs" => Config::get('inputs.plan_prise'),
        "voies_administration" => Config::get('inputs.voies_administration')
      ]
    ];
    $config['version'] = md5(serialize($config));
    return response()->json($config);
  }
}