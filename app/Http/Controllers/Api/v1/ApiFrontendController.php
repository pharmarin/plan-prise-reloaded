<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Support\Facades\Config;
use App\Http\Controllers\Controller;

class ApiFrontendController extends Controller
{
  /**
  * Create a new ApiFrontendController instance.
  *
  * @return void
  */
  public function __construct()
  {
    //$this->middleware('ajax');
  }
  
  public function config()
  {
    $config = [
      "validation" => Config::get('validation')
    ];
    return response()->json($config);
  }
}