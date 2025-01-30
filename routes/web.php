<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Routes สำหรับสินค้า
    Route::get('/products', [ProductController::class, 'index'])->name('products.index'); // แสดงสินค้าทั้งหมด
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create'); // ฟอร์มสร้างสินค้า
    Route::post('/products', [ProductController::class, 'store'])->name('products.store'); // สร้างสินค้าใหม่
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit'); // ฟอร์มแก้ไขสินค้า
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update'); // อัปเดตสินค้าที่แก้ไข
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy'); // ลบสินค้า
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show'); // แสดงสินค้ารายการเดียว
});

require __DIR__.'/auth.php';
