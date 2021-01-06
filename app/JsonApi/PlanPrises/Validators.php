<?php

namespace App\JsonApi\PlanPrises;

use CloudCreativity\LaravelJsonApi\Validation\AbstractValidators;

class Validators extends AbstractValidators
{
  /**
   * The include paths a client is allowed to request.
   *
   * @var string[]|null
   *      the allowed paths, an empty array for none allowed, or null to allow all paths.
   */
  protected $allowedIncludePaths = [
    'medicaments',
    'medicaments.bdpm',
    'medicaments.composition',
    'medicaments.precautions',
  ];

  /**
   * The sort field names a client is allowed send.
   *
   * @var string[]|null
   *      the allowed fields, an empty array for none allowed, or null to allow all fields.
   */
  protected $allowedSortParameters = ['id'];

  /**
   * The filters a client is allowed send.
   *
   * @var string[]|null
   *      the allowed filters, an empty array for none allowed, or null to allow all.
   */
  protected $allowedFilteringParameters = ['user'];

  /**
   * Get resource validation rules.
   *
   * @param mixed|null $record
   *      the record being updated, or null if creating a resource.
   * @return mixed
   */
  protected function rules($record, array $data): array
  {
    return [
        //
      ];
  }

  /**
   * Get query parameter validation rules.
   *
   * @return array
   */
  protected function queryRules(): array
  {
    return [
        //
      ];
  }
}
