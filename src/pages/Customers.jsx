import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, Edit2, Truck, MoreVertical } from 'lucide-react';
import DynamicForm from '../components/DynamicForm';

export default function Customers() {
    const { customers, appConfig, addCustomer, updateCustomer, addUsageRecord } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isUsageOpen, setIsUsageOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Filter Customers
    const filteredCustomers = customers.filter(c =>
        c.data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddSubmit = (data) => {
        addCustomer(data, 'General'); // Default group for now, could add selector
        setIsAddOpen(false);
    };

    const handleEditSubmit = (data) => {
        updateCustomer(selectedCustomer.id, data);
        setIsEditOpen(false);
        setSelectedCustomer(null);
    };

    const openUsageModal = (customer) => {
        setSelectedCustomer(customer);
        setIsUsageOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ข้อมูลลูกค้า (Customers)</h1>
                    <p className="text-gray-500">จัดการรายชื่อและข้อมูลการจัดส่ง</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-thp-red text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    เพิ่มลูกค้าใหม่
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="ค้นหาชื่อลูกค้า, รหัส..."
                    className="flex-1 outline-none text-gray-600 placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Customer List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map(customer => (
                    <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 text-thp-blue flex items-center justify-center font-bold text-lg">
                                    {customer.data.name?.charAt(0) || '?'}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openUsageModal(customer)}
                                        className="p-2 text-gray-400 hover:text-thp-blue hover:bg-blue-50 rounded-full transition-colors"
                                        title="Record Usage"
                                    >
                                        <Truck size={18} />
                                    </button>
                                    <button
                                        onClick={() => { setSelectedCustomer(customer); setIsEditOpen(true); }}
                                        className="p-2 text-gray-400 hover:text-thp-red hover:bg-red-50 rounded-full transition-colors"
                                        title="Edit Info"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{customer.data.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{customer.id}</p>

                            <div className="space-y-2">
                                {appConfig.sections[0].fields.slice(1, 3).map(field => (
                                    <div key={field.key} className="flex gap-2 text-sm">
                                        <span className="text-gray-400 min-w-[80px]">{field.label}:</span>
                                        <span className="text-gray-700 font-medium truncate">{customer.data[field.key] || '-'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                            <span>Added: {new Date(customer.createdAt).toLocaleDateString('th-TH')}</span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Active
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Customer Modal */}
            {isAddOpen && (
                <DynamicForm
                    title="เพิ่มลูกค้าใหม่ (New Customer)"
                    config={appConfig}
                    onSubmit={handleAddSubmit}
                    onCancel={() => setIsAddOpen(false)}
                />
            )}

            {/* Edit Customer Modal */}
            {isEditOpen && selectedCustomer && (
                <DynamicForm
                    title="แก้ไขข้อมูลลูกค้า (Edit Customer)"
                    config={appConfig}
                    initialData={selectedCustomer.data}
                    onSubmit={handleEditSubmit}
                    onCancel={() => { setIsEditOpen(false); setSelectedCustomer(null); }}
                />
            )}

            {/* Usage Record Modal (Simple Manual Implementation) */}
            {isUsageOpen && selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">บันทึกการส่งของ (Log Usage)</h2>
                        <p className="text-sm text-gray-500 mb-6">ลูกค้า: {selectedCustomer.data.name}</p>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            addUsageRecord(selectedCustomer.id, {
                                date: new Date().toISOString(),
                                service: formData.get('service'),
                                quantity: parseInt(formData.get('quantity')),
                                amount: parseFloat(formData.get('amount'))
                            });
                            setIsUsageOpen(false);
                            setSelectedCustomer(null);
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">ประเภทบริการ (Service)</label>
                                    <select name="service" className="w-full border rounded-lg p-2" required>
                                        <option value="EMS">EMS</option>
                                        <option value="Registered">ลงทะเบียน (Registered)</option>
                                        <option value="Parcel">พัสดุ (Parcel)</option>
                                        <option value="Other">อื่นๆ (Other)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">จำนวนชิ้น (Quantity)</label>
                                    <input type="number" name="quantity" className="w-full border rounded-lg p-2" required min="1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">ยอดเงินรวม (Total Amount)</label>
                                    <input type="number" name="amount" className="w-full border rounded-lg p-2" required min="0" step="0.01" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsUsageOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button>
                                <button type="submit" className="px-4 py-2 bg-thp-red text-white rounded-lg hover:bg-red-700">บันทึก</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
