<?php

namespace App\JsonApi\PlanPrises;

use App\JsonApi\CustomRelations\GenericRelation;
use App\Models\PlanPrise;
use CloudCreativity\LaravelJsonApi\Eloquent\AbstractAdapter;
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
  protected $includePaths = [
    'medicaments' => 'medic_data',
  ];

  /**
   * Mapping of JSON API filter names to model scopes.
   *
   * @var array
   */
  protected $filterScopes = [];

  protected $relationships = ['medicaments'];

  protected $primaryKey = 'pp_id';

  /**
   * Adapter constructor.
   *
   * @param StandardStrategy $paging
   */
  public function __construct(StandardStrategy $paging)
  {
    parent::__construct(new PlanPrise(), $paging);
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

  public function medicaments()
  {
    return new GenericRelation('medic_data');
  }
}
