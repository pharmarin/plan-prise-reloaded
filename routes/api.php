<?php

use Illuminate\Http\Request;

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
      $api->resource('old-medicament')->only('read');
      $api->resource('medicament')->only('read');
      $api->resource('api-medicament')->only('read');
    });
    /* plan-prise */
    Route::resource('plan-prise', 'Api\v1\PlanPriseController')->only([
      'update',
    ]);
    JsonApi::register('default')->routes(function ($api) {
      $api
        ->resource('plan-prise', ['has-many' => 'plan-prise-content'])
        ->only('index', 'read');
    });
  });
});

Route::middleware(['web', 'auth:api'])->group(function () {
  // Plan de prise
  Route::get('all/search', 'Api\CommonApiController@search')->name(
    'api.all.search'
  );
  Route::post('all/show', 'Api\CommonApiController@show')->name('api.all.show');
  Route::resource('composition', 'Api\CompositionApiController', [
    'as' => 'api',
  ]);
  Route::resource('medicament', 'Api\MedicamentApiController', ['as' => 'api']);
  Route::resource('plan-prise', 'Api\PlanPriseApiController', ['as' => 'api']);
});
