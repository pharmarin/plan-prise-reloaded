<?php

namespace App\JsonApi\PlanPrises;

use Carbon\Carbon;
use CloudCreativity\LaravelJsonApi\Contracts\Store\StoreInterface;
use CloudCreativity\LaravelJsonApi\Http\Controllers\JsonApiController;
use CloudCreativity\LaravelJsonApi\Http\Requests\UpdateResource;

class Controller extends JsonApiController
{
  function update(StoreInterface $store, UpdateResource $request)
  {
    parent::update($store, $request);
    return $this->reply()->meta(
      [
        'acceptedAt' => Carbon::now(),
      ],
      204
    );
  }
}
