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
    Route::get('user', function () {
      return json_api()
        ->encoder()
        ->serializeData(Auth::user());
    });
    /* generic */
    Route::apiResource('generic', 'Api\v1\GenericController')->only(['index']);
    JsonApi::register('default')->routes(function ($api) {
      $api->resource('medicaments')->only('index', 'read', 'update');
      $api->resource('api-medicaments')->only('index', 'read');
      $api
        ->resource('plan-prises')
        ->controller('\App\JsonApi\PlanPrises\Controller')
        ->only('index', 'read', 'update', 'delete', 'create');
      $api->resource('principe-actifs')->only('index', 'create');
      $api->resource('precautions')->only('read', 'update');
      $api->resource('users')->only('index', 'read', 'update', 'delete');
    });
    Route::get('dashboard', 'Api\v1\DashboardController@stats');
  });
});
