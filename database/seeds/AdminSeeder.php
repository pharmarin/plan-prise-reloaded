<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    User::create([
      'name' => 'Admin',
      'display_name' => 'Administrateur',
      'email' => 'admin@admin.com',
      'email_verified_at' => now(),
      'password' => bcrypt('verysafepassword'),
      'admin' => true,
      'approved_at' => now(),
    ]);
  }
}
