import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { Chart, registerables } from "chart.js";

// Register chart.js modules
Chart.register(...registerables);

const Index = () => {
    const { products } = usePage().props;
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(5);  // แสดง 5 รายการต่อหน้า
    const indexOfLastProduct = currentPage * perPage;
    const indexOfFirstProduct = indexOfLastProduct - perPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // UseEffect สำหรับสร้างกราฟ
    useEffect(() => {
        const ctx = document.getElementById("productChart");
        if (!ctx) return;  // ถ้าไม่เจอ canvas element ก็ไม่ต้องทำอะไร

        // สร้างกราฟเมื่อข้อมูลพร้อม
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: products.map((p) => p.name),
                datasets: [
                    {
                        label: "สินค้าคงเหลือ",
                        data: products.map((p) => p.stock),
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }, [products]);

    const totalPages = Math.ceil(products.length / perPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="my-6 text-4xl font-semibold text-gray-900 text-center">รายการสินค้า</h1>

            {/* Data Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                    <div className="card-header text-xl font-semibold text-center">สินค้าทั้งหมด</div>
                    <div className="card-body text-center">
                        <h5 className="text-3xl">{products.length} รายการ</h5>
                    </div>
                </div>
                <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                    <div className="card-header text-xl font-semibold text-center">สินค้าคงคลัง</div>
                    <div className="card-body text-center">
                        <h5 className="text-3xl">
                            {products.reduce((sum, p) => sum + p.stock, 0)} ชิ้น
                        </h5>
                    </div>
                </div>
                <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
                    <div className="card-header text-xl font-semibold text-center">ราคาสินค้าเฉลี่ย</div>
                    <div className="card-body text-center">
                        <h5 className="text-3xl">
                            {products.length > 0
                                ? (
                                    products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) /
                                    products.length
                                ).toFixed(2)
                                : "0.00"}{" "}
                            บาท
                        </h5>
                    </div>
                </div>
            </div>

            {/* Table */}
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead className="bg-gradient-to-r from-gray-300 to-gray-200 text-gray-800">
                    <tr>
                        <th className="py-3 px-6 text-center border-b border-gray-300">#</th>
                        <th className="py-3 px-6 text-center border-b border-gray-300">ชื่อสินค้า</th>
                        <th className="py-3 px-6 text-center border-b border-gray-300">ราคา</th>
                        <th className="py-3 px-6 text-center border-b border-gray-300">จำนวนคงเหลือ</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {currentProducts.map((product, index) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="py-3 px-6 text-center border-x border-b border-gray-300">{index + 1}</td>
                            <td className="py-3 px-6 text-center font-medium border-x border-b border-gray-300">{product.name}</td>
                            <td className="py-3 px-6 text-center border-x border-b border-gray-300">{(parseFloat(product.price) || 0).toFixed(2)} บาท</td>
                            <td className="py-3 px-6 text-center border-x border-b border-gray-300">{product.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-all"
                            >
                                Prev
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i}>
                                <button
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-5 py-3 rounded-lg text-lg font-semibold ${currentPage === i + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-blue-500 border border-blue-500"
                                    } hover:bg-blue-600 transition-all`}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-all"
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Chart */}
            <canvas id="productChart" className="mt-10 max-w-full rounded-lg shadow-lg"></canvas>
        </div>
    );
};

export default Index;
