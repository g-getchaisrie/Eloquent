<?php

namespace Database\Factories;

use App\Models\CustomerHotel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CustomerHotel>
 */
class CustomerHotelFactory extends Factory
{
    protected $model = CustomerHotel::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->regexify('[0-9]{10}'),
            'address' => $this->faker->address()
        ];
    }
}
