<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//Route::get('/{any?}', 'RenderController@render');

Route::get('plan-prise/api/v1/discovery', function(){
  $get_routes = Route::getRoutes();
  $results = array();
   foreach ($get_routes as $value)
   {
    $live_path = $value->uri();
    $readable = preg_replace('/\/\{(one|two|three|four|five)\?\}/', '', $live_path);
    $data_results[$value->getName()] = $readable;
   }
  $response_data = Response::make(json_encode($data_results, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
  $response_data->header('Content-Type', 'text/json');
  return $response_data;
})->name('api.discovery');

Route::prefix('plan-prise/api/v1')->group(function() {
  
  Route::prefix('auth')->group(function () {
    Route::post('login', 'Api\UserApiController@login')->name('api.auth.login');
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
    
  });
  
});

/*Auth::routes();

Route::middleware(['auth'])->group(function () {
  Route::get('/approval', 'HomeController@approval')->name('approval');
  
  Route::middleware(['approved'])->group(function () {
    Route::post('medicament/custom/get', 'MedicamentController@getDetailFromCIS')->name('medicament.custom.get');
    // PlanPrise
    Route::get('plan-prise/{pp_id?}', 'PlanPriseController@index')->name('plan-prise.index');
    //Route::get('plan-prise/{pp_id?}/print', 'PlanPriseController@print')->name('plan-prise.print');
    //Route::get('plan-prise/{pp_id?}/export', 'PlanPriseController@export')->name('plan-prise.export');
    
    Route::middleware(['admin'])->group(function () {
      // Users
      Route::get('users', 'UsersController@index')->name('admin.users.index');
      
      Route::get('users/{user_id}/approve', 'UsersController@approve')->name('admin.users.approve');
      // Old Medicament
      Route::get('medicament/import', 'MedicamentImportController@importFromOldDatabase')->name('medicament.import.search');
      Route::get('medicament/import/{id}', 'MedicamentImportController@showImportFormByID')->name('medicament.import.form');
      // Medicament
      Route::get('medicament/search', 'MedicamentController@search')->name('medicament.search');
      Route::resource('medicament', 'MedicamentController');
      // Composition
      Route::resource('composition', 'CompositionController')->only(['index', 'edit']);
    });
  });
});*/
