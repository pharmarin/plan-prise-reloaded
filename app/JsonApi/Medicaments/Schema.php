<?php

namespace App\JsonApi\Medicaments;

use App\Models\ApiMedicament;
use Neomerx\JsonApi\Schema\SchemaProvider;

class Schema extends SchemaProvider
{
  /**
   * @var string
   */
  protected $resourceType = 'medicaments';

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
    array $includedRelationships
  ) {
    return [
      'bdpm' => [
        self::SHOW_SELF => false,
        self::SHOW_RELATED => false,
        self::SHOW_DATA => isset($includedRelationships['bdpm']),
        self::DATA => function () use ($medicament) {
          return collect($medicament->cis)->map(function ($cis) {
            return ApiMedicament::find($cis);
          });
        },
      ],
      'composition' => [
        self::SHOW_SELF => false,
        self::SHOW_RELATED => false,
        self::SHOW_DATA => isset($includedRelationships['composition']),
        self::DATA => function () use ($medicament) {
          return $medicament->composition;
        },
      ],
      'precautions' => [
        self::SHOW_SELF => false,
        self::SHOW_RELATED => false,
        self::SHOW_DATA => isset($includedRelationships['precautions']),
        self::DATA => function () use ($medicament) {
          return $medicament->precautions;
        },
      ],
    ];
  }
}
