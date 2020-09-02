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
            'denomination' => $resource->nomMedicament,
            'created-at' => $resource->modifie//->toAtomString(),
        ];
    }
}
