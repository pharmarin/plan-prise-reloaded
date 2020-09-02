<?php

namespace App\Builders;

use Illuminate\Database\Eloquent\Builder;

class MultipleTypesBuilder extends Builder
{
  public function eagerLoadRelation (array $models, $name, \Closure $constraints)
  {
    if ($name === "medic_data") {
      return collect([]);
    }
  }
}