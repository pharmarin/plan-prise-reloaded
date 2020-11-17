<?php

namespace App\JsonApi\Users;

use Neomerx\JsonApi\Schema\SchemaProvider;

class Schema extends SchemaProvider
{
  /**
   * @var string
   */
  protected $resourceType = 'users';

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
      'display_name' => $resource->display_name,
      'email' => $resource->email,
      'status' => $resource->status,
      'rpps' => $resource->rpps,
    ];
  }
}
