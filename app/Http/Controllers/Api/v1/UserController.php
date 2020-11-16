<?php

namespace App\Http\Controllers\Api\v1;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
  /**
   * Create a new ApiUserController instance.
   *
   * @return void
   */
  public function __construct()
  {
    $this->middleware('ajax');
  }

  /**
   * Get the authenticated User.
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function info()
  {
    return response()->json(Auth::user());
  }

  /**
   * Logout the currently logged in user
   */
  public function logout()
  {
    Auth::user()
      ->token()
      ->revoke();
    return response()->json('Success');
  }
}
