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
  Route::group(['middleware' => ['auth:api']], function () {
    Route::get('user', 'Api\v1\ApiUserController@info')->name('api.user.info');
    Route::delete('oauth/token', 'Api\V1\ApiUserController@logout');
  });
});

Route::middleware(['auth:api'])->group(function () {

  // Plan de prise
  Route::get('all/search', 'Api\CommonApiController@search')->name('api.all.search');
  Route::post('all/show', 'Api\CommonApiController@show')->name('api.all.show');
  Route::resource('composition', 'Api\CompositionApiController', ['as' => 'api']);
  Route::resource('medicament', 'Api\MedicamentApiController', ['as' => 'api']);
  Route::resource('bdpm', 'Api\BdpmApiController', ['as' => 'api']);
  Route::get('plan-prise/{pp_id?}', 'Api\PlanPriseApiController@index')->name('api.plan-prise.index');
  Route::resource('plan-prise', 'Api\PlanPriseApiController', ['as' => 'api']);

});
