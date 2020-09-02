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
    Route::get('user', 'Api\v1\UserController@info');
    Route::delete('oauth/token', 'Api\V1\UserController@logout');
    //Route::get('plan-prise/{pp_id?}', 'Api\v1\PlanPriseController@index');
    //Route::resource('plan-prise', 'Api\PlanPriseApiController');
    JsonApi::register('default')->routes(function ($api) {
      $api->resource('plan-prise', ['has-many' => 'plan-prise-content']);
      $api->resource('plan-prise-content');
    });
  });
});

Route::middleware(['web', 'auth:api'])->group(function () {

  // Plan de prise
  Route::get('all/search', 'Api\CommonApiController@search')->name('api.all.search');
  Route::post('all/show', 'Api\CommonApiController@show')->name('api.all.show');
  Route::resource('composition', 'Api\CompositionApiController', ['as' => 'api']);
  Route::resource('medicament', 'Api\MedicamentApiController', ['as' => 'api']);
  Route::get('plan-prise/{pp_id?}', 'Api\PlanPriseApiController@index')->name('api.plan-prise.index');
  Route::resource('plan-prise', 'Api\PlanPriseApiController', ['as' => 'api']);

});
