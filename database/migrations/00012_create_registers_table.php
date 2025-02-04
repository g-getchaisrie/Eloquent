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
        Schema::create('registers', function (Blueprint $table) {
            $table->bigIncrements('register_id')->primary()->autoIncrement(); //primary key
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('course_id');
            $table->dateTime('register_date');
            $table->string('grade',2);
            $table->timestamps();

            $table->foreign('student_id')
            ->references('student_id')
            ->on('students')
            ->onDelete('cascade');

            $table->foreign('course_id')
            ->references('course_id')
            ->on('courses')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registers');
    }
};
