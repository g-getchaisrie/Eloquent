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
        Schema::create('courses', function (Blueprint $table) {
            $table->bigIncrements('course_id')->primary()->autoIncrement(); //primary key
            $table->unsignedBigInteger('teacher_id');
            $table->string('name', 100);
            $table->integer('credits');
            $table->timestamps();

            $table->foreign('teacher_id')
            ->references('teacher_id')
            ->on('teachers')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
