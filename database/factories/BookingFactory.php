<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Room;
use App\Models\CustomerHotel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'checkin_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'checkout_date' => $this->faker->dateTimeBetween('+1 month', '+2 month'),
            'booking_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'total' => $this->faker->randomFloat(2, 100, 1000),
            'room_id' => Room::factory(),
            'customer_hotel_id' => CustomerHotel::factory()
        ];
    }
}
