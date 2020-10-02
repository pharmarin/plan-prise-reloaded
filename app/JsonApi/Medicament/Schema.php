<?php

namespace App\JsonApi\Medicament;

use Neomerx\JsonApi\Schema\SchemaProvider;

class Schema extends SchemaProvider
{
  /**
   * @var string
   */
  protected $resourceType = 'medicament';

  /**
   * @param \\App\Models\Medicament $resource
   *      the domain record being serialized.
   * @return string
   */
  public function getId($resource)
  {
    return (string) $resource->getRouteKey();
  }

  /**
   * @param \\App\Models\Medicament $resource
   *      the domain record being serialized.
   * @return array
   */
  public function getAttributes($resource)
  {
    return [
      'denomination' => $resource->denomination,
      'composition' => $resource->composition,
      'indications' => $resource->indications,
      'conservation_frigo' => $resource->conservation_frigo,
      'conservation_duree' => $resource->conservation_duree,
      'voies_administration' => $resource->voies_administration,
      'precautions' => $resource->precautions,
      'created-at' => $resource->created_at->toAtomString(),
      'updated-at' => $resource->updated_at->toAtomString(),
    ];
  }
}
