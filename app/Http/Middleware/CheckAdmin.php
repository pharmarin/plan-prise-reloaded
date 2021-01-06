<?php

namespace App\Http\Middleware;

use Closure;
use CloudCreativity\LaravelJsonApi\Document\Error\Error;
use CloudCreativity\LaravelJsonApi\Exceptions\JsonApiException;

class CheckAdmin
{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle($request, Closure $next)
  {
    if (!(auth()->user() && auth()->user()->admin)) {
      if (!$request->expectsJson()) {
        return redirect()->route('home');
      }
      throw new JsonApiException(
        Error::fromArray([
          'code' => 403,
          'message' => 'unauthorized action',
          'text' =>
            'Seuls les administrateurs peuvent accéder à cette resource',
        ])
      );
    }
    return $next($request);
  }
}
