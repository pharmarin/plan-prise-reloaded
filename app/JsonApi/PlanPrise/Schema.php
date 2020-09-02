<?php

namespace App\JsonApi\PlanPrise;

use Neomerx\JsonApi\Schema\SchemaProvider;
use App\Repositories\CommonRepository;
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
        return (string) $resource->getRouteKey();
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
    public function getRelationships($resource, $isPrimary, array $includedRelationships)
    {
        return [
            'medicaments' => [
                self::SHOW_SELF => true,
                self::SHOW_RELATED => false,
                self::SHOW_DATA => true,
                self::DATA => function () use ($resource) {
                    return array_map(function ($r) {
                        switch ($r["type"]) {
                            case 0:
                                return OldMedicament::find($r['id']);
                            case 1:
                                return Medicament::find($r['id']);
                            case 2:
                                return ApiMedicament::find($r['id']);
                            default:
                                throw new Error("Type de médicament inconnu");
                        }
                    }, $resource->medic_data);
                },
            ],
        ];
    }

}
