// resources/js/Pages/Product/Create.jsx
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const Create = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        Inertia.post(route('products.store'), {
            name,
            price,
            stock,
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">สร้างสินค้าใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block">ชื่อสินค้า</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block">ราคา</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="stock" className="block">จำนวนสินค้า</label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">สร้างสินค้า</button>
            </form>
        </div>
    );
};

export default Create;
