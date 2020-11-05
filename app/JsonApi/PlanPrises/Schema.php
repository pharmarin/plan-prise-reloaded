<?php

namespace App\JsonApi\PlanPrises;

use Neomerx\JsonApi\Schema\SchemaProvider;
use App\Models\Medicament;
use App\Models\ApiMedicament;
use CloudCreativity\LaravelJsonApi\Document\Error\Error;
use CloudCreativity\LaravelJsonApi\Exceptions\JsonApiException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class Schema extends SchemaProvider
{
  /**
   * @var string
   */
  protected $resourceType = 'plan-prises';

  protected $relationships = ['medicaments'];

  /**
   * @param \\App\Models\PlanPrise $resource
   *      the domain record being serialized.
   * @return string
   */
  public function getId($resource)
  {
    if (Auth::id() !== $resource->user_id) {
      throw new JsonApiException(
        Error::fromArray([
          'status' => 401,
          'message' =>
            "Vous n'avez pas l'autorisation d'accéder à ce plan de prise. ",
        ])
      );
    }
    return $resource->pp_id;
  }

  /**
   * @param \\App\Models\PlanPrise $resource
   *      the domain record being serialized.
   * @return array
   */
  public function getAttributes($resource)
  {
    return [
      'custom_data' => $resource->custom_data,
      'custom_settings' => $resource->custom_settings,
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
        self::SHOW_DATA => isset($includedRelationships['medicaments']),
        self::DATA => function () use ($resource) {
          return array_filter(
            array_map(function ($r) {
              switch ($r['type']) {
                case 'medicaments':
                  return Medicament::find($r['id']);
                case 'api-medicaments':
                  return ApiMedicament::find($r['id']);
                default:
                  Log::alert(
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
