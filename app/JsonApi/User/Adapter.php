<?php

namespace App\JsonApi\User;

use App\Models\User;
use CloudCreativity\LaravelJsonApi\Eloquent\AbstractAdapter;
use CloudCreativity\LaravelJsonApi\Pagination\StandardStrategy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;

class Adapter extends AbstractAdapter
{
  /**
   * Mapping of JSON API attribute field names to model keys.
   *
   * @var array
   */
  protected $attributes = [];

  /**
   * Mapping of JSON API filter names to model scopes.
   *
   * @var array
   */
  protected $filterScopes = [];

  protected function deserializePasswordField($value)
  {
    return Hash::make($value);
  }

  /**
   * Adapter constructor.
   *
   * @param StandardStrategy $paging
   */
  public function __construct(StandardStrategy $paging)
  {
    parent::__construct(new User(), $paging);
  }

  /**
   * @param Builder $query
   * @param Collection $filters
   * @return void
   */
  protected function filter($query, Collection $filters)
  {
    if ($name = $filters->get('name')) {
      $query
        ->where('user.last_name', 'like', "{$name}%")
        ->orWhere('user.first_name', 'like', "{$name}%");
    } else {
      $this->filterWithScopes($query, $filters);
    }
  }
}
