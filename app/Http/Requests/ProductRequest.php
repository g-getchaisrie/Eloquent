<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * กำหนดว่าใครสามารถใช้ request นี้ได้หรือไม่
     * ถ้าคืนค่า true จะอนุญาตให้ใช้ request นี้
     */
    public function authorize()
    {
        return true; // เปลี่ยนตามระบบสิทธิ์ที่คุณใช้งาน เช่น เช็คสิทธิ์ของผู้ใช้ก่อน
    }

    /**
     * กำหนดกฎเกณฑ์การตรวจสอบข้อมูลที่ได้รับจากฟอร์ม
     */
    public function rules()
    {
        return [
            // กฎการตรวจสอบสำหรับชื่อสินค้า
            'name' => 'required|string|max:255', // ชื่อสินค้าต้องเป็นสตริงและไม่เกิน 255 ตัวอักษร

            // กฎการตรวจสอบสำหรับราคา
            'price' => 'required|numeric|min:0', // ราคาต้องเป็นตัวเลขและไม่ต่ำกว่า 0

            // กฎการตรวจสอบสำหรับสต็อกสินค้า
            'stock' => 'required|integer|min:0', // สต็อกต้องเป็นจำนวนเต็มและไม่ต่ำกว่า 0
        ];
    }
}
