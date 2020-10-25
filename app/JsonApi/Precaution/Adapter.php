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

  protected function updating($resource, $query)
  {
    if ($query->precaution_cible) {
      if ($query->precaution_cible['type'] === 'medicament') {
        $medicament = Medicament::find($query->precaution_cible['id']);
        if (!$medicament) {
          throw new JsonApiException(
            Error::fromArray([
              'title' => 'Aucun médicament à rattacher à la précaution',
              'detail' => '',
              'status' => '500',
            ])
          );
        }
        $resource->precaution_cible()->associate($medicament);
      } elseif ($query->precaution_cible['type'] === 'principe-actif') {
        $pa = PrincipeActif::find($query->precaution_cible['id']);
        if (!$pa) {
          throw new JsonApiException(
            Error::fromArray([
              'title' => 'Aucun principe actif à rattacher à la précaution',
              'detail' => '',
              'status' => '500',
            ])
          );
        }
        $resource->precaution_cible()->associate($pa);
      } else {
        throw new JsonApiException(
          Error::fromArray([
            'title' => 'Aucun type à rattacher à la précaution',
            'detail' => '',
            'status' => '500',
          ])
        );
      }
    }
  }
}
