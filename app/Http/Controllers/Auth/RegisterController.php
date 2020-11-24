<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RegisterController extends Controller
{
  /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

  use RegistersUsers;

  /**
   * Where to redirect users after registration.
   *
   * @var string
   */
  protected $redirectTo = RouteServiceProvider::HOME;

  public function showRegistrationForm()
  {
    return view('app');
  }

  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {
    $this->middleware('guest');
  }

  /**
   * Get a validator for an incoming registration request.
   *
   * @param  array  $data
   * @return \Illuminate\Contracts\Validation\Validator
   */
  protected function validator(array $data)
  {
    return Validator::make($data, [
      'recaptcha' => ['required', 'captcha'],
      'name' => ['required', 'string', 'min:3', 'max:50'],
      'status' => ['required', Rule::in(['pharmacist', 'student'])],
      'rpps' => [
        'required_if:status,pharmacist',
        'integer',
        'digits:11',
        'nullable',
      ],
      'certificate' => [
        'required_if:status,student',
        'file',
        'mimes:png,jpg,jpeg,pdf',
        'nullable',
      ],
      'display_name' => ['string', 'min:3', 'max:50'],
      'email' => ['required', 'string', 'email', 'unique:users'],
      'password' => ['required', 'confirmed', 'min:8', 'max:20'],
    ]);
  }

  /**
   * Create a new user instance after a valid registration.
   *
   * @param  array  $data
   * @return \App\User
   */
  protected function create(array $data)
  {
    $user = User::create([
      'name' => $data['name'],
      'display_name' => $data['display_name'],
      'email' => $data['email'],
      'password' => Hash::make($data['password']),
      'status' => $data['status'],
      'rpps' => $data['status'] === 'pharmacist' ? $data['rpps'] : null,
    ]);

    if ($data['status'] === 'student') {
      request()
        ->file('certificate')
        ->storeAs('school_certs', $user->id);
    }

    return $user;
  }

  public function registered(Request $request, User $user)
  {
    Auth::logout();
    return new JsonResponse('success', 201);
  }
}
