<?php

namespace App\JsonApi\PrincipeActifs;

use Neomerx\JsonApi\Schema\SchemaProvider;

class Schema extends SchemaProvider
{
  /**
   * @var string
   */
  protected $resourceType = 'principe-actifs';

  /**
   * @param \\App\Models\PrincipeActif $resource
   *      the domain record being serialized.
   * @return string
   */
  public function getId($resource)
  {
    return (string) $resource->getRouteKey();
  }

  /**
   * @param \\App\Models\PrincipeActif $resource
   *      the domain record being serialized.
   * @return array
   */
  public function getAttributes($resource)
  {
    return [
      'denomination' => $resource->denomination,
    ];
  }
}
