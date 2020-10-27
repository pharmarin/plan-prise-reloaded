<?php

namespace App\JsonApi\Precaution;

use App\Models\Medicament;
use App\Models\Utility\PrincipeActif;
use CloudCreativity\LaravelJsonApi\Eloquent\AbstractAdapter;
use CloudCreativity\LaravelJsonApi\Exceptions\JsonApiException;
use CloudCreativity\LaravelJsonApi\Document\Error\Error;
use CloudCreativity\LaravelJsonApi\Pagination\StandardStrategy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

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

  /**
   * Adapter constructor.
   *
   * @param StandardStrategy $paging
   */
  public function __construct(StandardStrategy $paging)
  {
    parent::__construct(new \App\Models\Utility\Precaution(), $paging);
  }

  /**
   * @param Builder $query
   * @param Collection $filters
   * @return void
   */
  protected function filter($query, Collection $filters)
  {
    $this->filterWithScopes($query, $filters);
  }

  protected function precautionCible()
  {
    return $this->belongsTo();
  }
}
