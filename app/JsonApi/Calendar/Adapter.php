<?php

namespace App\JsonApi\Calendar;

use App\JsonApi\CustomRelations\GenericRelation;
use App\Models\Calendar;
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
  protected $includePaths = ['medicaments'];

  /**
   * Mapping of JSON API filter names to model scopes.
   *
   * @var array
   */
  protected $filterScopes = [
    'user' => 'user_id',
  ];

  protected $relationships = ['medicaments'];

  protected $primaryKey = 'cal_id';

  /**
   * Adapter constructor.
   *
   * @param StandardStrategy $paging
   */
  public function __construct(StandardStrategy $paging)
  {
    parent::__construct(new Calendar(), $paging);
  }

  /**
   * @param Builder $query
   * @param Collection $filters
   * @return void
   */
  protected function filter($query, Collection $filters)
  {
    $this->filterWithScopes($query, $filters->except('user'));

    if ($user = $filters->get('user')) {
      $query->where('user_id', '=', $user);
    }
  }

  public function medicaments()
  {
    return new GenericRelation('medicaments');
  }

  protected function searchAll($query)
  {
    return $query->where('user_id', Auth::id())->get();
  }

  protected function creating(Calendar $calendar)
  {
    $max_id = Calendar::where('user_id', Auth::id())
      ->withTrashed()
      ->max('cal_id');
    $max_id = $max_id ?: 0;

    $calendar->cal_id = $max_id + 1;
    $calendar->user_id = Auth::id();
  }
}
