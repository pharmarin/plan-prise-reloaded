<?php

namespace App\Helpers;

use CloudCreativity\LaravelJsonApi\Document\Error\Error;
use CloudCreativity\LaravelJsonApi\Exceptions\JsonApiException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

function verifyPassword()
{
  if (!request()->has('meta.password')) {
    throw new JsonApiException(
      Error::fromArray([
        'status' => 401,
        'code' => 'password-needed',
        'title' => 'Password needed',
        'detail' =>
          'La confirmation du mot de passe est obligatoire lors de la suppression du compte',
      ])
    );
  }

  $user = Auth::user();

  if (!Hash::check(request()->input('meta.password'), $user->password)) {
    throw new JsonApiException(
      Error::fromArray([
        'status' => 401,
        'code' => 'password-mismatch',
        'title' => 'Password mismatch',
        'detail' =>
          'Le mot de passe ne correspond pas au mot de passe enregistré',
      ])
    );
  }
}
