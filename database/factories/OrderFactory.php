<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'customer_id' => Customer::factory(),
            'total_price' => $this->faker->randomFloat(2, 10, 1000), // Random price between 10 and 1000
            'status' => $this->faker->randomElement(['pending', 'completed', 'cancelled']),
        ];
    }
}
