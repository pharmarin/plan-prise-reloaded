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

use App\Mail\RegisteredAdmin;
use App\Models\User;

Route::get('test', function () {
  return new RegisteredAdmin(User::find(11));
  return Mail::to('rouxmarin@outlook.com')->queue(
    new RegisteredAdmin(User::find(11))
  );
});

Route::get('/{any?}', function () {
  return view('app');
})->name('home');
