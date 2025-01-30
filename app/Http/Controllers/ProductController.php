<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

    /**
     * แสดงฟอร์มสร้างสินค้า
     */
    public function create()
    {
        return inertia('Products/Create');
    }

    /**
     * สร้างสินค้าใหม่
     */
    public function store(Request $request)
    {
        // ตรวจสอบข้อมูลที่ส่งมา
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        // สร้างสินค้าผ่านการส่งข้อมูล
        Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'stock' => $request->stock,
        ]);

        // ส่งการตอบกลับหลังการสร้างสินค้าเป็น Inertia response และทำการ redirect ไปที่หน้าหลัก
        return redirect()->route('products.index')->with('message', 'สร้างสินค้าสำเร็จ');
    }

    /**
     * แสดงฟอร์มแก้ไขสินค้า
     */
    public function edit(Product $product)
    {
        return inertia('Products/Edit', [
            'product' => $product,
        ]);
    }

    /**
     * อัปเดตข้อมูลสินค้า
     */
    public function update(Request $request, Product $product)
    {
        // ตรวจสอบข้อมูลที่ส่งมา
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        // อัปเดตข้อมูลสินค้า
        $product->update([
            'name' => $request->name,
            'price' => $request->price,
            'stock' => $request->stock,
        ]);

        // ส่งการตอบกลับหลังการอัปเดตเป็น Inertia response และทำการ redirect ไปที่หน้าหลัก
        return redirect()->route('products.index')->with('message', 'อัปเดตสินค้าสำเร็จ');
    }

    /**
     * ลบสินค้า
     */
    public function destroy(Product $product)
    {
        // ลบสินค้าจากฐานข้อมูล
        $product->delete();

        // ส่งการตอบกลับหลังการลบสินค้าเป็น Inertia response และทำการ redirect ไปที่หน้าหลัก
        return redirect()->route('products.index')->with('message', 'ลบสินค้าสำเร็จ');
    }
}
