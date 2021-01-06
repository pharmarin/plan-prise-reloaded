<?php

namespace App\Helpers;

use CloudCreativity\LaravelJsonApi\Document\Error\Error;
use CloudCreativity\LaravelJsonApi\Exceptions\JsonApiException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

function verifyPassword($update = false)
{
  $requestHasPassword = $update
    ? request()->has('data.attributes.current_password')
    : request()->has('meta.password');

  $requestPassword = $update
    ? request()->input('data.attributes.current_password')
    : request()->input('meta.password');

  if (!$requestHasPassword) {
    throw new JsonApiException(
      Error::fromArray([
        'status' => 401,
        'code' => 'password-needed',
        'title' => 'Veuillez indiquer le mot de passe enregistré',
      ])
    );
  }

  $user = Auth::user();

  if (!Hash::check($requestPassword, $user->password)) {
    throw new JsonApiException(
      Error::fromArray([
        'status' => 401,
        'code' => 'password-mismatch',
        'title' =>
          'Le mot de passe ne correspond pas au mot de passe enregistré',
      ])
    );
  }
}
