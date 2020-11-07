<?php

use App\Models\PlanPrise;
use App\Models\User;
use Illuminate\Database\Seeder;

class FakeDataSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    User::factory()
      ->count(5)
      ->has(PlanPrise::factory()->count(3), 'plans_prise')
      ->create();
  }
}
