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

/*Route::middleware('auth:api')->group(function () {
  Route::get('/user', function (Request $request) {
    return $request->user();
  });
  Route::middleware(['approved'])->group(function () {
    Route::resource('medicament', 'Api\MedicamentApiController');
  });
});*/ // Reste à implémenter https://laravel.com/docs/5.8/api-authentication

Route::resource('composition', 'Api\CompositionApiController', ['as' => 'api']);
Route::resource('medicament', 'Api\MedicamentApiController', ['as' => 'api']);
Route::resource('bdpm', 'Api\BdpmApiController', ['as' => 'api']);
