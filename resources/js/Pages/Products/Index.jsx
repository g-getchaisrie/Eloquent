import React, { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { Chart, registerables } from "chart.js";
import { InertiaLink } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

// Register chart.js modules
Chart.register(...registerables);

const Index = () => {
    const { products = [] } = usePage().props; // กำหนดค่าเริ่มต้นให้เป็นอาร์เรย์ว่าง
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false); // เปิดปิด Modal
    const [productToDelete, setProductToDelete] = useState(null); // เก็บ id ของสินค้า
    const chartRef = useRef(null);
    const indexOfLastProduct = currentPage * perPage;
    const indexOfFirstProduct = indexOfLastProduct - perPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleDeleteProduct = (productId) => {
        setProductToDelete(productId); // เก็บ id ของสินค้าที่จะลบ
        setIsModalOpen(true); // เปิด Modal
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            Inertia.delete(`/products/${productToDelete}`, {
                onSuccess: () => {
                    alert("ลบสินค้า ID: " + productToDelete);
                    setIsModalOpen(false); // ปิด modal หลังจากลบ
                    setProductToDelete(null);
                }
            });
        }
    };

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartRef.current.chartInstance) {
            chartRef.current.chartInstance.destroy();
        }

        chartRef.current.chartInstance = new Chart(chartRef.current, {
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
                    legend: { display: false },
                },
                scales: { y: { beginAtZero: true } },
            },
        });
    }, [products]);

    const totalPages = Math.ceil(products.length / perPage);

    return (
        <div className="container mx-auto px-6 py-12">
            {/* Data Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <DataCard title="สินค้าทั้งหมด" value={`${products.length} รายการ`} color="blue" />
                <DataCard title="สินค้าคงคลัง" value={`${products.reduce((sum, p) => sum + p.stock, 0)} ชิ้น`} color="green" />
                <DataCard title="ราคาสินค้าเฉลี่ย" value={`${(products.length > 0 ? (products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length).toFixed(2) : "0.00")} บาท`} color="yellow" />
            </div>

            {/* ปุ่ม "สร้างสินค้า" อยู่ใต้ Data Card */}
            <div className="flex justify-center mb-10">
                <InertiaLink
                    href="/products/create"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                    สร้างสินค้า
                </InertiaLink>
            </div>

            {/* Table */}
            <div className="mb-4">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead className="bg-gray-200 text-gray-800">
                        <tr>
                            <th className="py-3 px-6 text-center border-b">#</th>
                            <th className="py-3 px-6 text-center border-b">ชื่อสินค้า</th>
                            <th className="py-3 px-6 text-center border-b">ราคา</th>
                            <th className="py-3 px-6 text-center border-b">จำนวนคงเหลือ</th>
                            <th className="py-3 px-6 text-center border-b">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {currentProducts.map((product, index) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="py-3 px-6 text-center border-x border-b">{indexOfFirstProduct + index + 1}</td>
                                <td className="py-3 px-6 text-center font-medium border-x border-b">{product.name}</td>
                                <td className="py-3 px-6 text-center border-x border-b">{(parseFloat(product.price) || 0).toFixed(2)} บาท</td>
                                <td className="py-3 px-6 text-center border-x border-b">{product.stock}</td>
                                <td className="py-3 px-6 text-center border-x border-b">
                                    {/* ปุ่ม "แก้ไข" */}
                                    <InertiaLink
                                        href={`/products/${product.id}/edit`}
                                        className="text-blue-500 bg-blue-400 hover:bg-blue-500 py-2 px-4 rounded-lg transition-colors"
                                    >
                                        แก้ไข
                                    </InertiaLink>

                                    {/* ปุ่ม "ลบ" */}
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="ml-2 text-white bg-red-400 hover:bg-red-500 py-2 px-4 rounded-lg transition-colors"
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                    <nav>
                        <ul className="flex space-x-2">
                            <PageButton label="« First" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                            <PageButton label="‹ Prev" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                            {[...Array(totalPages)].map((_, i) => (
                                <PageButton key={i} label={i + 1} onClick={() => setCurrentPage(i + 1)} active={currentPage === i + 1} />
                            ))}
                            <PageButton label="Next ›" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                            <PageButton label="Last »" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Chart */}
            <canvas ref={chartRef} className="mt-10 max-w-full rounded-lg shadow-lg"></canvas>

            {/* Modal Confirmation */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <div className="text-xl font-semibold mb-4">คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?</div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                            >
                                ลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DataCard = ({ title, value, color }) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        yellow: "from-yellow-500 to-yellow-600",
    };

    return (
        <div className={`bg-gradient-to-r ${colorClasses[color]} text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform`}>
            <div className="text-xl font-semibold text-center">{title}</div>
            <div className="text-center text-3xl">{value}</div>
        </div>
    );
};

const PageButton = ({ label, onClick, disabled, active }) => {
    return (
        <li>
            <button
                onClick={onClick}
                disabled={disabled}
                className={`px-5 py-3 rounded-lg text-lg font-semibold transition-all ${active ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500"} ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
            >
                {label}
            </button>
        </li>
    );
};

export default Index;
