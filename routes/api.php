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

Route::prefix('v1')->group(function () {
  Route::post('oauth/token', 'Api\ApiAuthController@auth')->name('api.auth.login');
});

Route::middleware(['jwt'])->group(function () {

  // Authentication
  Route::prefix('auth')->group(function () {
    Route::post('logout', 'Api\UserApiController@logout')->name('api.auth.logout');
    Route::post('refresh', 'Api\UserApiController@refresh')->name('api.auth.refresh');
    Route::get('info', 'Api\UserApiController@info')->name('api.auth.info');
  });

  // Plan de prise
  Route::get('all/search', 'Api\CommonApiController@search')->name('api.all.search');
  Route::post('all/show', 'Api\CommonApiController@show')->name('api.all.show');
  Route::resource('composition', 'Api\CompositionApiController', ['as' => 'api']);
  Route::resource('medicament', 'Api\MedicamentApiController', ['as' => 'api']);
  Route::resource('bdpm', 'Api\BdpmApiController', ['as' => 'api']);
  Route::get('plan-prise/{pp_id?}', 'Api\PlanPriseApiController@index')->name('api.plan-prise.index');
  Route::resource('plan-prise', 'Api\PlanPriseApiController', ['as' => 'api']);

});*/
