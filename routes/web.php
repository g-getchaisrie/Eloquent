<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route หน้าแรก
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'), // เช็คว่า route สำหรับ login มีหรือไม่
        'canRegister' => Route::has('register'), // เช็คว่า route สำหรับ register มีหรือไม่
        'laravelVersion' => Application::VERSION, // ส่งเวอร์ชันของ Laravel
        'phpVersion' => PHP_VERSION, // ส่งเวอร์ชันของ PHP
    ]);
});

// Route สำหรับ dashboard ที่ต้องผ่านการยืนยันตัวตนและอีเมล
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard'); // ตรวจสอบผู้ใช้ที่ล็อกอินแล้วและยืนยันอีเมล

// กลุ่ม Route สำหรับผู้ใช้ที่ล็อกอินแล้ว
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit'); // ฟอร์มแก้ไขโปรไฟล์
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update'); // อัปเดตโปรไฟล์
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy'); // ลบโปรไฟล์

    // Routes สำหรับการจัดการสินค้า
    Route::get('/products', [ProductController::class, 'index'])->name('products.index'); // แสดงสินค้าทั้งหมด
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create'); // ฟอร์มสำหรับสร้างสินค้า
    Route::post('/products', [ProductController::class, 'store'])->name('products.store'); // สร้างสินค้าใหม่
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit'); // ฟอร์มแก้ไขสินค้า
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update'); // อัปเดตสินค้าที่แก้ไข
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy'); // ลบสินค้า
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show'); // แสดงรายละเอียดสินค้ารายการเดียว
});

// รวมไฟล์สำหรับการจัดการการเข้าสู่ระบบและการยืนยันอีเมล
require __DIR__.'/auth.php';
