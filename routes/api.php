<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use CloudCreativity\LaravelJsonApi\Facades\JsonApi;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'v1', 'middleware' => 'web'], function () {
  Auth::routes();
  Route::get('preload', 'Api\v1\FrontendController@config');
  Route::group(['middleware' => 'auth:sanctum'], function () {
    /* app */
    Route::get('user', 'Api\v1\UserController@info');
    Route::delete('oauth/token', 'Api\v1\UserController@logout');
    /* generic */
    Route::resource('generic', 'Api\v1\GenericController')->only(['index']);
    JsonApi::register('default')->routes(function ($api) {
      $api->resource('medicaments')->only('index', 'read', 'update');
      $api->resource('api-medicaments')->only('index', 'read');
      $api->resource('plan-prises')->only('index');
      $api->resource('principe-actifs')->only('index', 'create');
      $api->resource('precautions')->only('read', 'update');
    });
    /* plan-prise */
    Route::resource('plan-prise', 'Api\v1\PlanPriseController')->only([
      'update',
      'destroy',
    ]);
    JsonApi::register('default')->routes(function ($api) {
      $api
        ->resource('plan-prise', ['has-many' => 'plan-prise-content'])
        ->only('index', 'read');
    });
  });
});
