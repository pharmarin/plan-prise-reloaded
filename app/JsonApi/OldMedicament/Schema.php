<?php

namespace App\JsonApi\OldMedicament;

use Neomerx\JsonApi\Schema\SchemaProvider;

class Schema extends SchemaProvider
{
  /**
   * @var string
   */
  protected $resourceType = 'old-medicament';

  /**
   * @param \\App\Models\OldMedicament $resource
   *      the domain record being serialized.
   * @return string
   */
  public function getId($resource)
  {
    return (string) $resource->getRouteKey();
  }

  /**
   * @param \\App\Models\OldMedicament $resource
   *      the domain record being serialized.
   * @return array
   */
  public function getAttributes($resource)
  {
    return [
      'denomination' => $resource->denomination,
      'compositions' => $resource->compositions,
      'custom_indications' => $resource->custom_indications,
      'conservation_frigo' => $resource->frigo,
      'conservation_duree' => $resource->conservation_duree,
      'voies_administration' => $resource->voies_administration,
      'precautions' => $resource->precautions,
      'created-at' => $resource->modifie,
      'updated-at' => $resource->modifie,
    ];
  }
}
