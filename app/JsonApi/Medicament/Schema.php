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
      'indications' => $resource->indications,
      'conservation_frigo' => $resource->conservation_frigo,
      'conservation_duree' => $resource->conservation_duree,
      'voies_administration' => $resource->voies_administration,
    ];
  }

  public function getRelationships(
    $medicament,
    $isPrimary,
    array $includeRelationships
  ) {
    return [
      'composition' => [
        self::SHOW_SELF => true,
        self::SHOW_RELATED => true,
        self::SHOW_DATA => isset($includeRelationships['composition']),
        self::DATA => function () use ($medicament) {
          return $medicament->composition;
        },
      ],
      'precautions' => [
        self::SHOW_SELF => true,
        self::SHOW_RELATED => true,
        self::SHOW_DATA => isset($includeRelationships['precautions']),
        self::DATA => function () use ($medicament) {
          return $medicament->precautions;
        },
      ],
    ];
  }
}
