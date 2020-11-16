<?php

namespace App\JsonApi\Users;

use CloudCreativity\LaravelJsonApi\Validation\AbstractValidators;
use Illuminate\Validation\Rule;

class Validators extends AbstractValidators
{
  /**
   * The include paths a client is allowed to request.
   *
   * @var string[]|null
   *      the allowed paths, an empty array for none allowed, or null to allow all paths.
   */
  protected $allowedIncludePaths = [];

  /**
   * The sort field names a client is allowed send.
   *
   * @var string[]|null
   *      the allowed fields, an empty array for none allowed, or null to allow all fields.
   */
  protected $allowedSortParameters = [];

  /**
   * The filters a client is allowed send.
   *
   * @var string[]|null
   *      the allowed filters, an empty array for none allowed, or null to allow all.
   */
  protected $allowedFilteringParameters = [];

  /**
   * Get resource validation rules.
   *
   * @param mixed|null $record
   *      the record being updated, or null if creating a resource.
   * @param array $data
   *      the data being validated
   * @return array
   */
  protected function rules($record, array $data): array
  {
    return [
      'g-recaptcha-response' => 'recaptcha',
      'name' => ['required', 'string', 'min:3', 'max:50'],
      'status' => ['required', Rule::in(['pharmacist', 'student'])],
      'rpps' => ['required_if:status,pharmacist', 'integer', 'digits:11'],
      'certificate' => [
        'required_if:status,student',
        'file',
        'mimes:image/png,image/jpg,image/jpeg,application/pdf',
      ],
      'email' => ['required', 'email', 'unique:users,email'],
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
