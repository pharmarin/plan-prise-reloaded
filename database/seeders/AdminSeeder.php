<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    if (User::where('last_name', 'Admin')->count() === 0) {
      User::create([
        'last_name' => 'Admin',
        'first_name' => 'Admin',
        'display_name' => 'Administrateur',
        'email' => 'admin@admin.com',
        'email_verified_at' => now(),
        'password' => Hash::make('verysafepassword'),
        'admin' => true,
        'status' => 'pharmacist',
        'rpps' => 10101322476,
        'approved_at' => now(),
      ]);
    }
  }
}
