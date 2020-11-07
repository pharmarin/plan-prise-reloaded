<?php

namespace App\JsonApi\PlanPrises;

use App\JsonApi\CustomRelations\GenericRelation;
use App\Models\PlanPrise;
use CloudCreativity\LaravelJsonApi\Eloquent\AbstractAdapter;
use CloudCreativity\LaravelJsonApi\Pagination\StandardStrategy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

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

  protected function searchAll($query)
  {
    return $query->where('user_id', Auth::id())->get();
  }

  protected function creating(PlanPrise $planPrise)
  {
    $max_id = PlanPrise::where('user_id', Auth::id())
      ->withTrashed()
      ->max('pp_id');
    $max_id = $max_id ?: 0;

    $planPrise->pp_id = $max_id + 1;
    $planPrise->user_id = Auth::id();
  }
}
