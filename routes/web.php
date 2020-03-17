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
Route::get('/', 'HomeController@index')->name('home');

Auth::routes();

Route::middleware(['auth'])->group(function () {
    Route::get('/approval', 'HomeController@approval')->name('approval');

    Route::middleware(['approved'])->group(function () {
        Route::post('medicament/custom/get', 'MedicamentController@getDetailFromCIS')->name('medicament.custom.get');
        // PlanPrise
        Route::get('plan-prise/{pp_id?}', 'PlanPriseController@index')->name('plan-prise.index');
        Route::get('plan-prise/{pp_id?}/print', 'PlanPriseController@print')->name('plan-prise.print');
        Route::get('plan-prise/{pp_id?}/export', 'PlanPriseController@export')->name('plan-prise.export');

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
});
