<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Psr\Http\Message\ServerRequestInterface;
use \Laravel\Passport\Http\Controllers\AccessTokenController;

class ApiAuthController extends AccessTokenController
{
    public function auth(ServerRequestInterface $request)
    {
            $tokenResponse = parent::issueToken($request);
            $token = $tokenResponse->getContent();

            // $tokenInfo will contain the usual Laravel Passort token response.
            $tokenInfo = json_decode($token, true);

            // Then we just add the user to the response before returning it.
            $username = $request->getParsedBody()['username'];
            $user = User::whereEmail($username)->first();
            $tokenInfo = collect($tokenInfo);
            $tokenInfo->put('user_info', base64_encode($user));

            return $tokenInfo;
    }
}