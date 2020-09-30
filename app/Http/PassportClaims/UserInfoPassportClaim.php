<?php

namespace App\Http\PassportClaims;

use App\Models\User;

class UserInfoPassportClaim
{
  public function handle($token, $next)
  {
    if ($user = User::find($token->getUserIdentifier())) {
      $token->addClaim('usr', [
        'admin' => (bool) $user->admin,
        'name' => $user->display_name ?: $user->name,
      ]);
    }

    return $next($token);
  }
}
