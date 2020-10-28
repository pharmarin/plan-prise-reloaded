<?php

namespace App\JsonApi\Medicaments;

use App\JsonApi\CustomRelations\BelongsToJson;
use App\JsonApi\CustomRelations\ExternalAPI;
use CloudCreativity\LaravelJsonApi\Eloquent\AbstractAdapter;
use CloudCreativity\LaravelJsonApi\Pagination\StandardStrategy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

use App\Models\Utility\PrincipeActif;

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

  protected $includePaths = [
    'bdpm' => null
  ];

  protected $defaultPagination = ['number' => 20];

  /**
   * Resource relationship fields that can be filled.
   *
   * @var array
   */
  protected $relationships = ['composition'];

  /**
   * Adapter constructor.
   *
   * @param StandardStrategy $paging
   */
  public function __construct(StandardStrategy $paging)
  {
    parent::__construct(new \App\Models\Medicament(), $paging);
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

  public function bdpm()
  {
    return new ExternalAPI('bdpm');
  }

  protected function composition()
  {
    return new BelongsToJson('composition');
  }
}
