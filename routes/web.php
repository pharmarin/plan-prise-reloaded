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
        Route::any('medicament/custom/get', 'MedicamentController@getDetailFromCIS')->name('medicament.custom.get'); //post
        Route::resource('plan-prise', 'PlanPriseController')->except(['create']);

        Route::middleware(['admin'])->group(function () {
          // Users
          Route::get('users', 'UsersController@index')->name('admin.users.index');
          Route::get('users/{user_id}/approve', 'UsersController@approve')->name('admin.users.approve');
          // Old Medicament
          Route::match(['get', 'post'], 'medicament/import', 'MedicamentImportController@importFromOldDatabase')->name('medicament.import.search');
          Route::get('medicament/import/{id}', 'MedicamentImportController@showImportFormByID')->name('medicament.import.form');
          // Medicament API
          Route::get('medicament/refresh', 'MedicamentAPIController@refresh');
          Route::post('medicament/refresh', 'MedicamentAPIController@update')->name('medicament.api.update');
          Route::post('medicament/api/get', 'MedicamentAPIController@getDetailFromCIS')->name('medicament.api.get');
          // Medicament
          Route::resource('medicament', 'MedicamentController');
        });
    });
});
