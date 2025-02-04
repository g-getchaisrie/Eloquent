<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\CustomerHotel;
use App\Models\Booking;
use App\Models\Course;
use App\Models\ProdCustomers;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Register;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Student;
use App\Models\Teacher;

class ProductSeeder extends Seeder
{
    public function run()
    {
        Product::factory(10)->create(); // สร้างสินค้า 50 รายการ
        Order::factory(30)->create();
        OrderDetail::factory(30)->create();

        Teacher::factory(30)->create();
        Student::factory(30)->create();
        Course::factory(30)->create();
        Register::factory(30)->create();

        CustomerHotel::factory(100)->create();
        RoomType::factory(5)->create();
        Room::factory(30)->create();
        Booking::factory(150)->create();
    }
}
