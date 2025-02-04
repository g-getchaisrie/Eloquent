import React, { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react"; // ใช้ hook จาก Inertia.js เพื่อดึงข้อมูลที่ส่งมาจาก server
import { Chart, registerables } from "chart.js"; // ใช้ chart.js สำหรับการแสดงกราฟ
import { InertiaLink } from '@inertiajs/inertia-react'; // ใช้ InertiaLink เพื่อทำการลิงก์ไปยังหน้าอื่นโดยไม่รีเฟรชหน้า
import { Inertia } from '@inertiajs/inertia'; // ใช้ Inertia สำหรับการเรียก API
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // ใช้ layout สำหรับหน้าเว็บที่ต้องการการยืนยันตัวตน

Chart.register(...registerables); // ลงทะเบียนตัว chart.js ที่จะใช้

const Index = () => {
    // ดึงข้อมูลผลิตภัณฑ์จาก props
    const { products = [] } = usePage().props;
    const [currentPage, setCurrentPage] = useState(1); // กำหนดสถานะสำหรับหน้าแสดงผล
    const [perPage] = useState(5); // กำหนดจำนวนผลิตภัณฑ์ที่จะแสดงต่อหน้า
    const [isModalOpen, setIsModalOpen] = useState(false); // กำหนดสถานะของ modal การลบผลิตภัณฑ์
    const [productToDelete, setProductToDelete] = useState(null); // เก็บข้อมูลของผลิตภัณฑ์ที่ต้องการลบ
    const [message, setMessage] = useState(""); // ใช้สำหรับแสดงข้อความสถานะ
    const [isDeleting, setIsDeleting] = useState(false); // กำหนดสถานะเมื่อกำลังลบผลิตภัณฑ์
    const chartRef = useRef(null); // ใช้ ref สำหรับการอ้างอิงไปยัง canvas ที่จะแสดงกราฟ

    // คำนวณช่วงของผลิตภัณฑ์ที่จะแสดงในหน้าปัจจุบัน
    const indexOfLastProduct = currentPage * perPage;
    const indexOfFirstProduct = indexOfLastProduct - perPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // ฟังก์ชันสำหรับเปิด modal ลบผลิตภัณฑ์
    const handleDeleteProduct = (productId) => {
        setProductToDelete(productId);
        setIsModalOpen(true);
    };

    // ฟังก์ชันสำหรับยืนยันการลบผลิตภัณฑ์
    const handleConfirmDelete = async () => {
        if (productToDelete && !isDeleting) {
            setIsDeleting(true); // ตั้งค่าสถานะการลบ
            try {
                await Inertia.delete(`/products/${productToDelete}`); // เรียก API เพื่อทำการลบผลิตภัณฑ์
                setMessage("Product deleted successfully!"); // แสดงข้อความสำเร็จ
                setIsModalOpen(false); // ปิด modal
                setProductToDelete(null); // รีเซ็ตข้อมูลผลิตภัณฑ์ที่ต้องการลบ
                setTimeout(() => setMessage(""), 3000); // ลบข้อความสถานะหลังจาก 3 วินาที
            } catch (error) {
                setMessage("Error occurred while deleting product!"); // หากเกิดข้อผิดพลาดในการลบ
                setTimeout(() => setMessage(""), 3000); // ลบข้อความสถานะหลังจาก 3 วินาที
            } finally {
                setIsDeleting(false); // ปิดสถานะการลบ
            }
        }
    };

    // ใช้ useEffect สำหรับการแสดงกราฟเมื่อข้อมูลผลิตภัณฑ์เปลี่ยนแปลง
    useEffect(() => {
        if (!chartRef.current || products.length === 0) return;

        const chartData = {
            labels: products.map((p) => p.name), // ใช้ชื่อผลิตภัณฑ์เป็น label
            datasets: [
                {
                    label: "Stock", // ชื่อ dataset
                    data: products.map((p) => p.stock), // ใช้จำนวนสินค้าคงคลังเป็นข้อมูล
                    backgroundColor: "rgba(54, 162, 235, 0.6)", // สีพื้นหลังของแท่ง
                    borderColor: "rgba(54, 162, 235, 1)", // สีขอบของแท่ง
                    borderWidth: 2,
                    borderRadius: 5,
                },
            ],
        };

        // หากมีกราฟที่แสดงอยู่แล้ว ให้ทำการทำลายกราฟเดิมก่อนแล้วสร้างใหม่
        if (chartRef.current.chartInstance) {
            chartRef.current.chartInstance.destroy();
        }

        // สร้างกราฟใหม่
        chartRef.current.chartInstance = new Chart(chartRef.current, {
            type: "bar", // ใช้กราฟแท่ง
            data: chartData, // ข้อมูลของกราฟ
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }, // ไม่แสดงตำนาน
                },
                scales: { y: { beginAtZero: true } }, // ตั้งค่าการแสดงแกน Y เริ่มจาก 0
                animation: {
                    duration: 1000, // ระยะเวลาในการแสดงผลกราฟ
                    easing: 'easeOutBounce', // รูปแบบการเคลื่อนไหวของกราฟ
                }
            },
        });
    }, [products]);

    // คำนวณจำนวนหน้าทั้งหมดสำหรับการแบ่งหน้า
    const totalPages = Math.ceil(products.length / perPage);

    return (
        <AuthenticatedLayout header="Product Dashboard">
            {/* โครงสร้างหลักของหน้าจอ */}
            <div className="container mx-auto px-6 py-12 bg-gray-100 font-roboto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {/* Data Cards สำหรับแสดงข้อมูลเกี่ยวกับผลิตภัณฑ์ */}
                    <DataCard title="Total Products" value={`${products.length} Items`} color="blue" />
                    <DataCard title="Stock Available" value={`${products.reduce((sum, p) => sum + p.stock, 0)} Pieces`} color="green" />
                    <DataCard title="Average Price" value={`${(products.length > 0 ? (products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length).toFixed(2) : "0.00")} Baht`} color="yellow" />
                </div>

                {/* ปุ่มสำหรับไปยังหน้าสร้างผลิตภัณฑ์ใหม่ */}
                <div className="flex justify-center mb-10">
                    <InertiaLink
                        href="/products/create"
                        className="bg-green-600 text-white py-3 px-6 rounded-xl shadow-lg hover:bg-green-700 transition duration-300"
                    >
                        Create Product
                    </InertiaLink>
                </div>

                {/* แสดงข้อความสถานะการลบผลิตภัณฑ์ */}
                {message && (
                    <div className="text-center text-lg font-semibold text-green-600 mb-4 animate-pulse">
                        {message}
                    </div>
                )}

                {/* ตารางแสดงผลิตภัณฑ์ */}
                <div className="overflow-x-auto mb-8 bg-white rounded-xl shadow-lg">
                    <table className="min-w-full">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-6 text-center">#</th>
                                <th className="py-3 px-6 text-center">Product Name</th>
                                <th className="py-3 px-6 text-center">Price</th>
                                <th className="py-3 px-6 text-center">Stock</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {currentProducts.map((product, index) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition duration-300">
                                    <td className="py-4 px-6 text-center">{indexOfFirstProduct + index + 1}</td>
                                    <td className="py-4 px-6 text-center font-semibold">{product.name}</td>
                                    <td className="py-4 px-6 text-center">{(parseFloat(product.price) || 0).toFixed(2)} Baht</td>
                                    <td className="py-4 px-6 text-center">{product.stock}</td>
                                    <td className="py-4 px-6 text-center">
                                        <InertiaLink
                                            href={`/products/${product.id}/edit`}
                                            className="inline-block text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-xl transition-colors duration-300"
                                        >
                                            Edit
                                        </InertiaLink>

                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="inline-block ml-2 text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded-xl transition-colors duration-300"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? (
                                                <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full border-t-transparent border-white"></div>
                                            ) : (
                                                'Delete'
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* การแบ่งหน้า */}
                <div className="flex justify-center mt-8">
                    <nav>
                        <ul className="flex space-x-3">
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

                {/* กราฟแสดงข้อมูลสินค้า */}
                <canvas ref={chartRef} className="mt-10 max-w-full rounded-xl shadow-xl"></canvas>

                {/* Modal สำหรับยืนยันการลบผลิตภัณฑ์ */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-xl shadow-xl w-1/3">
                            <div className="text-xl font-semibold mb-6 text-center">Are you sure you want to delete this product?</div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-6 rounded-xl hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="bg-red-600 text-white py-2 px-6 rounded-xl hover:bg-red-700 transition-colors"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

// คอมโพเนนต์ DataCard สำหรับแสดงข้อมูลในรูปแบบการ์ด
const DataCard = ({ title, value, color }) => {
    return (
        <div className={`bg-blue-500 text-white py-6 px-8 rounded-xl shadow-lg`}>
            <h3 className="text-2xl font-semibold mb-4">{title}</h3>
            <p className="text-lg">{value}</p>
        </div>
    );
};

// คอมโพเนนต์ PageButton สำหรับสร้างปุ่มแบ่งหน้า
const PageButton = ({ label, onClick, active, disabled }) => {
    return (
        <li>
            <button
                onClick={onClick}
                className={`px-4 py-2 rounded-lg ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                            ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600 hover:text-white'}
                            transition duration-300`}
                disabled={disabled}
            >
                {label}
            </button>
        </li>
    );
};

export default Index;
