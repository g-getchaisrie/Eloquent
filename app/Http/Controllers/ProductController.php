<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\ProductRequest; // ใช้ FormRequest สำหรับตรวจสอบข้อมูลที่ได้รับ
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * ดึงข้อมูลสินค้าทั้งหมด
     */
    public function index()
    {
        // ดึงข้อมูลสินค้าทั้งหมดจากฐานข้อมูล
        $products = Product::all();

        // ส่งข้อมูลสินค้าไปยังหน้า Products/Index ผ่าน Inertia.js
        return inertia('Products/Index', [
            'products' => $products,
        ]);
    }

    /**
     * แสดงข้อมูลสินค้าตาม ID
     */
    public function show(Product $product)
    {
        // ส่งข้อมูลสินค้าที่เลือกไปยังหน้า Products/Show ผ่าน Inertia.js
        return inertia('Products/Show', [
            'product' => $product,
        ]);
    }

    /**
     * แสดงฟอร์มสร้างสินค้า
     */
    public function create()
    {
        // แสดงฟอร์มสำหรับการสร้างสินค้า
        return inertia('Products/Create');
    }

    /**
     * สร้างสินค้าใหม่
     */
    public function store(ProductRequest $request)
    {
        try {
            // ใช้ข้อมูลที่ได้รับจากฟอร์มที่ผ่านการตรวจสอบแล้ว
            // เพื่อสร้างสินค้าใหม่ในฐานข้อมูล
            Product::create($request->validated());

            // ถ้าสร้างสินค้าสำเร็จ ให้รีไดเรกไปยังหน้ารายการสินค้าพร้อมแสดงข้อความ
            return redirect()->route('products.index')->with('message', 'สร้างสินค้าสำเร็จ');
        } catch (\Exception $e) {
            // หากเกิดข้อผิดพลาด ให้แสดงข้อความข้อผิดพลาดและรีไดเรกกลับ
            return redirect()->back()->with('error', 'เกิดข้อผิดพลาดในการสร้างสินค้า: ' . $e->getMessage());
        }
    }

    /**
     * แสดงฟอร์มแก้ไขสินค้า
     */
    public function edit(Product $product)
    {
        // ส่งข้อมูลสินค้าไปยังหน้า Products/Edit เพื่อให้สามารถแก้ไขได้
        return inertia('Products/Edit', [
            'product' => $product,
        ]);
    }

    /**
     * อัปเดตข้อมูลสินค้า
     */
    public function update(ProductRequest $request, Product $product)
    {
        try {
            // ใช้ข้อมูลที่ได้รับจากฟอร์มที่ผ่านการตรวจสอบแล้ว
            // เพื่ออัปเดตข้อมูลสินค้าในฐานข้อมูล
            $product->update($request->validated());

            // ถ้าอัปเดตสินค้าสำเร็จ ให้รีไดเรกไปยังหน้ารายการสินค้าพร้อมแสดงข้อความ
            return redirect()->route('products.index')->with('message', 'อัปเดตสินค้าสำเร็จ');
        } catch (\Exception $e) {
            // หากเกิดข้อผิดพลาด ให้แสดงข้อความข้อผิดพลาดและรีไดเรกกลับ
            return redirect()->back()->with('error', 'เกิดข้อผิดพลาดในการอัปเดตสินค้า: ' . $e->getMessage());
        }
    }

    /**
     * ลบสินค้า
     */
    public function destroy(Product $product)
    {
        try {
            // ลบสินค้าจากฐานข้อมูล
            $product->delete();

            // ถ้าลบสินค้าสำเร็จ ให้รีไดเรกไปยังหน้ารายการสินค้าพร้อมแสดงข้อความ
            return redirect()->route('products.index')->with('message', 'ลบสินค้าสำเร็จ');
        } catch (\Exception $e) {
            // หากเกิดข้อผิดพลาดในการลบ ให้รีไดเรกไปที่หน้ารายการสินค้าพร้อมแสดงข้อความข้อผิดพลาด
            return redirect()->route('products.index')->with('error', 'เกิดข้อผิดพลาดในการลบสินค้า: ' . $e->getMessage());
        }
    }
}
