<?php

namespace Database\Factories;

use App\Models\PlanPrise;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanPriseFactory extends Factory
{
  /**
   * The name of the factory's corresponding model.
   *
   * @var string
   */
  protected $model = PlanPrise::class;

  /**
   * Define the model's default state.
   *
   * @return array
   */
  public function definition()
  {
    return [
      'pp_id' => $this->faker->unique()->randomNumber(),
      'user_id' => User::factory(),
      'medic_data' => '[]',
      'custom_data' => '{}',
      'custom_settings' => '{}',
    ];
  }
}
