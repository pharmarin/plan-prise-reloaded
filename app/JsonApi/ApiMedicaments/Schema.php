<?php

namespace App\JsonApi\ApiMedicaments;

use Neomerx\JsonApi\Schema\SchemaProvider;

class Schema extends SchemaProvider
{
  /**
   * @var string
   */
  protected $resourceType = 'api-medicaments';

  /**
   * @param \\App\Models\ApiMedicament $resource
   *      the domain record being serialized.
   * @return string
   */
  public function getId($resource)
  {
    return (string) $resource->id;
  }

  /**
   * @param \\App\Models\ApiMedicament $resource
   *      the domain record being serialized.
   * @return array
   */
  public function getAttributes($resource)
  {
    return [
      'denomination' => $resource->denomination
    ];
  }
}
