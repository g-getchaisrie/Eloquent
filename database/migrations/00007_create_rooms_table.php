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
        Schema::create('rooms', function (Blueprint $table) {
            $table->bigIncrements('room_id')->primary()->autoIncrement(); //primary key
            $table->unsignedBigInteger('room_type_id');
            $table->string('number', 10);
            $table->string('status', 20);
            $table->timestamps();

            $table->foreign('room_type_id')
            ->references('room_type_id')
            ->on('room_types')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
