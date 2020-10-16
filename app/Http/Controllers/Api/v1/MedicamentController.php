<?php

namespace App\Http\Controllers\Api\v1;

use CloudCreativity\LaravelJsonApi\Http\Controllers\JsonApiController;
use Illuminate\Http\Request;

class MedicamentController extends JsonApiController
{
  public function updating($store, $request)
  {
    dump($store);
    dd($request->parameters);
  }
}
