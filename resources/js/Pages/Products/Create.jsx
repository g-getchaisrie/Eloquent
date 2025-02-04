import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';

const Create = () => {
    // กำหนดสถานะสำหรับการจัดการชื่อ, ราคา, จำนวนสินค้า, การโหลด, ข้อความแสดงข้อผิดพลาด และข้อความสำเร็จ
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // ฟังก์ชันจัดการการเปลี่ยนแปลงของ input
    const handleChange = (e, setter) => {
        const value = e.target.value;
        setter(value);
        // ถ้าค่าของราคา หรือ จำนวนสินค้าน้อยกว่าหรือเท่ากับศูนย์ ให้แสดงข้อความแสดงข้อผิดพลาด
        if (value <= 0 && e.target.name !== 'name') {
            setErrorMessage(`${e.target.name === 'price' ? 'Price' : 'Stock quantity'} must be greater than zero`);
        } else {
            setErrorMessage('');
        }
    };

    // ฟังก์ชันสำหรับส่งข้อมูลเมื่อผู้ใช้กดปุ่ม submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ตรวจสอบว่าได้กรอกข้อมูลครบทุกช่องหรือไม่
        if (!name || !price || !stock) {
            setErrorMessage('Please fill in all the fields');
            return;
        }

        // ตรวจสอบราคาว่ามากกว่าศูนย์
        if (price <= 0) {
            setErrorMessage('Price must be greater than zero');
            return;
        }

        // ตรวจสอบจำนวนสินค้าว่ามากกว่าศูนย์
        if (stock <= 0) {
            setErrorMessage('Stock quantity must be greater than zero');
            return;
        }

        // ตั้งค่าสถานะการโหลด
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // ส่งข้อมูลไปยังเซิร์ฟเวอร์เพื่อสร้างสินค้าใหม่
            await Inertia.post(route('products.store'), { name, price, stock });
            setSuccessMessage('Product created successfully!');
        } catch (error) {
            // หากเกิดข้อผิดพลาดในการสร้างสินค้าให้แสดงข้อความข้อผิดพลาด
            setErrorMessage(error.response?.data?.message || 'An error occurred while creating the product!');
        } finally {
            // ปิดสถานะการโหลด
            setIsLoading(false);
        }
    };

    // ใช้ useEffect เพื่อลบข้อความข้อผิดพลาดหรือข้อความสำเร็จหลังจาก 5 วินาที
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create New Product</h1>

            {/* แสดงข้อความข้อผิดพลาดถ้ามี */}
            {errorMessage && <div className="text-center text-lg font-semibold text-red-600 mb-4">{errorMessage}</div>}
            {/* แสดงข้อความสำเร็จถ้ามี */}
            {successMessage && <div className="text-center text-lg font-semibold text-green-600 mb-4">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-lg font-medium text-gray-700 mb-2">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={price}
                        onChange={(e) => handleChange(e, setPrice)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="stock" className="block text-lg font-medium text-gray-700 mb-2">Stock Quantity</label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={stock}
                        onChange={(e) => handleChange(e, setStock)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 text-lg font-semibold text-white rounded-md transition-all ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                    disabled={isLoading}
                >
                    <span className={`transition-all ${isLoading ? 'animate-spin' : ''}`}>
                        {isLoading ? 'Saving...' : 'Create Product'}
                    </span>
                </button>
            </form>
        </div>
    );
};

export default Create;
