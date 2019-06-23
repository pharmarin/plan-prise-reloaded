<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class UsersController extends Controller
{
  public function index () {
    $users = User::orderBy('created_at', 'asc')->get();
    return view('admin.users', compact('users'));
  }

  public function approve($user_id) {
    $user = User::findOrFail($user_id);
    $user->update(['approved_at' => now()]);

    return redirect()->route('admin.users.index')->withMessage('User approved successfully');
  }
}
