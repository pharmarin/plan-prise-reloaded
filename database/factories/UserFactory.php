<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
  /**
   * The name of the factory's corresponding model.
   *
   * @var string
   */
  protected $model = User::class;

  /**
   * Define the model's default state.
   *
   * @return array
   */
  public function definition()
  {
    return [
      'last_name' => $this->faker->lastName,
      'first_name' => $this->faker->firstName,
      'display_name' => 'display_' . $this->faker->name,
      'email' => $this->faker->email,
      'password' => bcrypt('password'),
      'admin' => false,
      'status' => $this->faker->randomElement(['pharmacist', 'student']),
      'rpps' => '10101' . $this->faker->randomNumber(6),
      'email_verified_at' => now(),
      'approved_at' => now(),
    ];
  }
}
