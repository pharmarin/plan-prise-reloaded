<?php

namespace App\JsonApi\Users;

use CloudCreativity\LaravelJsonApi\Contracts\Validation\ValidatorInterface;
use CloudCreativity\LaravelJsonApi\Document\Error\Error;
use CloudCreativity\LaravelJsonApi\Exceptions\JsonApiException;
use CloudCreativity\LaravelJsonApi\Validation\AbstractValidators;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use function App\Helpers\verifyPassword;

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
  protected $allowedFilteringParameters = ['name', 'approved_at'];

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
    $user = Auth::user();

    if ($user->id !== intval($data['id']) && !$user->admin) {
      throw new JsonApiException(
        Error::fromArray([
          'status' => 401,
          'title' => 'Unauthorized action',
          'detail' =>
            "L'utilisateur n'est pas autorisé à effectuer cette action",
        ])
      );
    }

    return [
      'display_name' => ['string', 'min:3', 'max:50', 'nullable'],
      'email' => [
        'required',
        'email',
        isset($data['email']) ? 'unique:users,email' : '',
      ],
      'name' => ['required', 'string', 'min:3', 'max:50'],
      'rpps' => ['required_if:status,pharmacist', 'integer', 'digits:11'],
      'status' => [Rule::in(['pharmacist', 'student'])],
      'password' => [
        'required_with:current-password',
        'confirmed',
        'min:8',
        'max:20',
      ],
    ];
  }

  /**
   * @param array $document
   * @return \CloudCreativity\LaravelJsonApi\Contracts\Validation\ValidatorInterface
   */
  public function create(array $document): ValidatorInterface
  {
    //$validator = parent::create($document);

    throw new JsonApiException(
      Error::fromArray([
        'status' => 500,
        'title' => 'Impossible action',
        'detail' => "Il est interdit de créer un utilisateur via l'API JSON",
      ])
    );
  }

  /**
   * @param array $document
   * @return \CloudCreativity\LaravelJsonApi\Contracts\Validation\ValidatorInterface
   */
  public function update($record, array $document): ValidatorInterface
  {
    $validator = parent::update($record, $document);

    if (!Auth::user()->admin) {
      verifyPassword(true);
    }

    return $validator;
  }

  /**
   * @param array $document
   * @return \CloudCreativity\LaravelJsonApi\Contracts\Validation\ValidatorInterface
   */
  public function delete($record): ?ValidatorInterface
  {
    $validator = parent::delete($record);

    if (!Auth::user()->admin) {
      verifyPassword();
    }

    return $validator;
  }

  /**
   * Get query parameter validation rules.
   *
   * @return array
   */
  protected function queryRules(): array
  {
    if (!request()->isMethod('PATCH') && !Auth::user()->admin) {
      throw new JsonApiException(
        Error::fromArray([
          'status' => 403,
          'code' => 'not-admin',
          'title' => 'Vous ne pouvez pas effectuer cette action',
          'detail' =>
            'Seuls les administrateurs peuvent accéder à cette requête',
        ])
      );
    }

    return [
        //
      ];
  }
}
