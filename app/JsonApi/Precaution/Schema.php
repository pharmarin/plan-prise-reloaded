<?php

namespace App\JsonApi\Precaution;

use Neomerx\JsonApi\Schema\SchemaProvider;

class Schema extends SchemaProvider
{
  /**
   * @var string
   */
  protected $resourceType = 'precaution';

  /**
   * @param \\App\Models\Precaution $resource
   *      the domain record being serialized.
   * @return string
   */
  public function getId($resource)
  {
    return (string) $resource->getRouteKey();
  }

  /**
   * @param \\App\Models\Precaution $resource
   *      the domain record being serialized.
   * @return array
   */
  public function getAttributes($resource)
  {
    return [
      'cible' => (new $resource->precaution_cible_type())->type .
        '_' .
        $resource->precaution_cible_id,
      'commentaire' => $resource->commentaire,
      'population' => $resource->population,
      'voie_administration' => $resource->voie_administration,
    ];
  }

  public function getRelationships(
    $precaution,
    $isPrimary,
    array $includeRelationships
  ) {
    return [
      'precaution_cible' => [
        self::SHOW_SELF => false,
        self::SHOW_RELATED => false,
        self::SHOW_DATA => isset($includeRelationships['precaution_cible']),
        self::DATA => function () use ($precaution) {
          return $precaution->precaution_cible;
        },
      ],
    ];
  }
}
