import React, { useState, useEffect } from "react";
import { Inertia } from '@inertiajs/inertia';

const Edit = ({ product }) => {
    // กำหนด state สำหรับเก็บข้อมูลสินค้าใหม่ที่จะแก้ไข
    const [newProduct, setNewProduct] = useState({
        name: product.name,
        price: product.price,
        stock: product.stock,
    });
    // กำหนด state สำหรับสถานะการโหลด (กำลังอัปเดต)
    const [isLoading, setIsLoading] = useState(false);
    // กำหนด state สำหรับข้อความแสดงผล
    const [message, setMessage] = useState("");

    // ใช้ useEffect เพื่ออัปเดตข้อมูลใหม่เมื่อ props ของ product เปลี่ยนแปลง
    useEffect(() => {
        setNewProduct({
            name: product.name,
            price: product.price,
            stock: product.stock,
        });
    }, [product]);

    // ใช้ useEffect เพื่อลบข้อความหลังจาก 5 วินาที
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // ฟังก์ชันที่ใช้ในการจัดการการเปลี่ยนแปลงของ input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({ ...prevState, [name]: value }));
    };

    // ฟังก์ชันที่ใช้ในการอัปเดตสินค้าหลังจากกรอกข้อมูล
    const handleUpdateProduct = () => {
        // ตรวจสอบว่าได้กรอกชื่อสินค้าหรือไม่
        if (!newProduct.name.trim()) {
            setMessage("Please enter product name");
            return;
        }
        // ตรวจสอบราคาว่าเป็นตัวเลขและมากกว่าศูนย์หรือไม่
        if (isNaN(newProduct.price) || newProduct.price <= 0) {
            setMessage("Price must be a number greater than zero");
            return;
        }
        // ตรวจสอบจำนวนสต็อกว่าเป็นตัวเลขและมากกว่าหรือเท่ากับศูนย์หรือไม่
        if (isNaN(newProduct.stock) || newProduct.stock < 0) {
            setMessage("Stock must be a number greater than or equal to zero");
            return;
        }

        // ตั้งสถานะการโหลดเป็น true ก่อนที่จะเริ่มการอัปเดต
        setIsLoading(true);
        setMessage("");

        // ส่งคำขอ PUT ไปยัง API เพื่ออัปเดตข้อมูลสินค้า
        Inertia.put(`/products/${product.id}`, newProduct, {
            onSuccess: () => {
                setMessage("Product updated successfully!");
                setIsLoading(false);
                Inertia.get("/products");
            },
            onError: () => {
                setMessage("Error occurred while updating product");
                setIsLoading(false);
            }
        });
    };

    // ฟังก์ชันสำหรับยกเลิกการแก้ไขสินค้า
    const handleCancel = () => {
        if (isLoading) return;
        setMessage("You have canceled the product update");
        Inertia.get("/products");
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Product</h1>

            {message && (
                <div className={`text-center text-lg font-semibold mb-4 ${message.includes('successfully') ? 'text-green-600' : message.includes('canceled') ? 'text-yellow-600' : 'text-red-600'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-6">
                <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleChange}
                    placeholder="Price"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleChange}
                    placeholder="Stock Available"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={handleUpdateProduct}
                    className={`w-full mr-2 py-3 text-lg font-semibold text-white rounded-md transition-all ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    disabled={isLoading}
                >
                    <span className={`${isLoading ? 'animate-spin' : ''}`}>
                        {isLoading ? "Updating..." : "Update Product"}
                    </span>
                </button>
                <button
                    onClick={handleCancel}
                    className={`w-full ml-2 py-3 text-lg font-semibold text-white rounded-md bg-gray-600 hover:bg-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Edit;
