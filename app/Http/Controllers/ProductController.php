<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * ดึงข้อมูลสินค้าทั้งหมด
     */
    public function index()
    {
        $products = Product::all();

        return inertia('Products/Index', [
            'products' => $products,
        ]);
    }

    /**
     * แสดงข้อมูลสินค้าตาม ID
     */
    public function show(Product $product)
    {
        return inertia('Products/Show', [
            'product' => $product,
        ]);
    }
}
