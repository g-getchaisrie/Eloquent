<?php

namespace Database\Factories;

use App\Models\Register;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Register>
 */
class RegisterFactory extends Factory
{
    protected $model = Register::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'register_date' => $this->faker->dateTime(),
            'grade' => $this->faker->randomElement(['1', '2', '3', '4', '5']),
            'course_id' => Course::factory(),
            'student_id' => Student::factory()
        ];
    }
}
