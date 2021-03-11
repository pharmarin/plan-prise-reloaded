<?php

namespace App\JsonApi\User;

use Neomerx\JsonApi\Schema\SchemaProvider;

class Schema extends SchemaProvider
{
  /**
   * @var string
   */
  protected $resourceType = 'user';

  /**
   * @param \\App\Models\User $resource
   *      the domain record being serialized.
   * @return string
   */
  public function getId($resource)
  {
    return (string) $resource->getRouteKey();
  }

  /**
   * @param \\App\Models\User $resource
   *      the domain record being serialized.
   * @return array
   */
  public function getAttributes($resource)
  {
    return [
      'admin' => $resource->admin,
      'name' => $resource->name,
      'first_name' => $resource->first_name,
      'last_name' => $resource->last_name,
      'display_name' => $resource->display_name,
      'email' => $resource->email,
      'status' => $resource->status,
      'rpps' => $resource->rpps,
      'created_at' => $resource->created_at,
    ];
  }
}
