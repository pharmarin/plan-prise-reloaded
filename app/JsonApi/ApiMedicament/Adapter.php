<?php

namespace App\JsonApi\ApiMedicament;

use App\Models\ApiMedicament;
use CloudCreativity\LaravelJsonApi\Document\ResourceObject;
use CloudCreativity\LaravelJsonApi\Eloquent\AbstractAdapter;
use CloudCreativity\LaravelJsonApi\Pagination\StandardStrategy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Neomerx\JsonApi\Contracts\Encoder\Parameters\EncodingParametersInterface;

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
    parent::__construct(new ApiMedicament(), $paging);
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

  /**
   * @inheritDoc
   */
  protected function createRecord(ResourceObject $resource)
  {
    dd('createRecord');
  }

  /**
   * @inheritDoc
   */
  protected function fillAttributes($record, Collection $attributes)
  {
    dd('fillAttributes');
  }

  /**
   * @inheritDoc
   */
  protected function persist($record)
  {
    dd('persist');
  }

  /**
   * @inheritDoc
   */
  protected function destroy($record)
  {
    dd('destroy');
  }

  /**
   * @inheritDoc
   */
  public function query(EncodingParametersInterface $parameters)
  {
    $query = $parameters->getFilteringParameters();
    $field = array_keys($query)[0];
    return ApiMedicament::where($field, $query[$field]);
  }

  /**
   * @inheritDoc
   */
  public function exists(string $resourceId): bool
  {
    return true;
  }

  /**
   * @inheritDoc
   */
  public function find($resourceId)
  {
    dd('find');
  }

  /**
   * @inheritDoc
   *
   * @var $resourceIds: Est en fait une Collection, mais findMany demande un iterable...
   */
  public function findMany(iterable $resourceIds): iterable
  {
    return array_map(function ($id) {
      return ApiMedicament::find($id);
    }, $resourceIds->toArray());
  }
}
