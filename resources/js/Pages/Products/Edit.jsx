import React, { useState, useEffect } from "react";
import { Inertia } from '@inertiajs/inertia';

const Edit = ({ product }) => {
    const [newProduct, setNewProduct] = useState({
        name: product.name,
        price: product.price,
        stock: product.stock,
    });

    // Update the newProduct state if the product prop changes
    useEffect(() => {
        setNewProduct({
            name: product.name,
            price: product.price,
            stock: product.stock,
        });
    }, [product]);

    const handleUpdateProduct = () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (newProduct.price <= 0 || newProduct.stock < 0) {
            alert("ราคาและจำนวนคงเหลือต้องเป็นค่าที่ถูกต้อง");
            return;
        }

        // ส่งข้อมูลไปที่ server
        Inertia.put(`/products/${product.id}`, newProduct, {
            onSuccess: () => {
                // รีเฟรชหน้าหลังจากอัปเดตสำเร็จ
                Inertia.get("/products"); // กลับไปยังหน้า products
            },
        });
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-semibold text-gray-900 text-center my-6">แก้ไขสินค้า</h1>
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
                <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="ชื่อสินค้า"
                    className="block w-full mt-2 p-2 border rounded"
                />
                <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="ราคา"
                    className="block w-full mt-2 p-2 border rounded"
                />
                <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="จำนวนคงเหลือ"
                    className="block w-full mt-2 p-2 border rounded"
                />
                <div className="flex justify-between mt-4">
                    <button
                        onClick={handleUpdateProduct}
                        className="px-6 py-2 bg-blue-500 text-white rounded"
                    >
                        อัปเดตสินค้า
                    </button>
                    <button
                        onClick={() => Inertia.get("/products")} // กลับไปที่หน้า products
                        className="px-6 py-2 bg-gray-500 text-white rounded"
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Edit;
