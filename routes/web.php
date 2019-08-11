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
        Route::resource('plan-prise', 'PlanPriseController')->except(['create']);

        Route::middleware(['admin'])->group(function () {
          Route::get('/users', 'UsersController@index')->name('admin.users.index');
          Route::get('/users/{user_id}/approve', 'UsersController@approve')->name('admin.users.approve');
          Route::get('medicament/import', 'MedicamentController@importFromOldDatabase');
          Route::get('medicament/import/{id}', 'MedicamentController@showImportFormByID');
          Route::post('medicament/import/{id}', 'MedicamentController@showImportFormByID');
          Route::resource('medicament', 'MedicamentController');
        });
    });
});
