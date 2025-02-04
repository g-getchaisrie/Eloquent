<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->bigIncrements('booking_id'); // primary key
            $table->unsignedBigInteger('customer_hotel_id');
            $table->unsignedBigInteger('room_id');
            $table->dateTime('checkin_date');
            $table->dateTime('checkout_date');
            $table->dateTime('booking_date');
            $table->decimal('total', 10, 2); 
            $table->timestamps();

            // กำหนด foreign key สำหรับ customer_hotel_id
            $table->foreign('customer_hotel_id')
                ->references('customer_hotel_id')
                ->on('customer_hotels')
                ->onDelete('cascade');

            // กำหนด foreign key สำหรับ room_id
            $table->foreign('room_id')
                ->references('room_id')
                ->on('rooms')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
