<?php

namespace App\JsonApi\PlanPrise;

use Neomerx\JsonApi\Schema\SchemaProvider;
use App\Repositories\GenericRepository;
use App\Models\OldMedicament;
use App\Models\Medicament;
use App\Models\ApiMedicament;

class Schema extends SchemaProvider
{
  /**
   * @var string
   */
  protected $resourceType = 'plan-prise';

  protected $relationships = ['medicaments'];

  /**
   * @param \\App\Models\PlanPrise $resource
   *      the domain record being serialized.
   * @return string
   */
  public function getId($resource)
  {
    return 'pp_id';
  }

  /**
   * @param \\App\Models\PlanPrise $resource
   *      the domain record being serialized.
   * @return array
   */
  public function getAttributes($resource)
  {
    return [
      'pp-id' => $resource->pp_id,
      'custom-data' => $resource->custom_data,
      'custom-settings' => $resource->custom_settings,
      'created-at' => $resource->created_at->toAtomString(),
      'updated-at' => $resource->updated_at->toAtomString(),
    ];
  }

  /**
   * @param Post $resource
   * @param bool $isPrimary
   * @param array $includedRelationships
   * @return array
   */
  public function getRelationships(
    $resource,
    $isPrimary,
    array $includedRelationships
  ) {
    return [
      'medicaments' => [
        self::SHOW_SELF => false,
        self::SHOW_RELATED => false,
        self::SHOW_DATA => isset($includedRelationships['precautions']),
        self::DATA => function () use ($resource) {
          return array_filter(
            array_map(function ($r) {
              switch ($r['type']) {
                case 'medicament':
                  return Medicament::find($r['id']);
                case 'api-medicaments':
                  return ApiMedicament::find($r['id']);
                default:
                  \Log::alert(
                    "Type de médicament inconnu - type: {$r['type']} - id: {$r['id']}"
                  );
                  return null;
              }
            }, $resource->medic_data)
          );
        },
      ],
    ];
  }
}
