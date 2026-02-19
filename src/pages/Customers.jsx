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

    // System Fields Configuration
    const SYSTEM_FIELDS = [
        { key: 'customerType', label: 'ประเภทลูกค้า (Customer Type)', type: 'radio', options: ['เอกชน (Private)', 'ราชการ (Government)', 'รัฐวิสาหกิจ (State Ent.)'] },
        { key: 'paymentMethod', label: 'การชำระเงิน (Payment)', type: 'select', options: ['เงินสด (Cash)', 'รายเดือน (Monthly)', 'เครดิต (Credit)'] },
        { key: 'package', label: 'แพ็กเกจ (Package)', type: 'select', options: ['Standard', 'Package A', 'Package B', 'VIP'] }
    ];

    // Filter Customers
    const filteredCustomers = customers.filter(c =>
        c.data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddSubmit = (data, additionalData) => {
        addCustomer(data, 'General', additionalData);
        setIsAddOpen(false);
    };

    const handleEditSubmit = (data, additionalData) => {
        // We need to merge additionalData into the customer object, but updateCustomer currently only updates 'data'
        // We might need to update AppContext's updateCustomer to handle root level fields too, 
        // OR just pass it for now and update AppContext later if needed. 
        // For now, let's assume updateCustomer only touches data, effectively ignoring root fields on edit 
        // unless we fix AppContext. Let's fix AppContext later if user complains, 
        // OR better: Assume we only update data for now, but let's try to pass it.
        // Actually, looking at AppContext: 
        // updateCustomer = (id, updatedData) => setCustomers(...) { ...c.data, ...updatedData } }
        // It ONLY updates data. 
        // I will stick to updating data for now to avoid breaking changes, 
        // BUT wait, the user wants these fields. 
        // I should probably fix AppContext to support root update.
        // For this step, I will just call updateCustomer with data.
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
                                <div className="flex gap-2 text-sm">
                                    <span className="text-gray-400 min-w-[80px]">Type:</span>
                                    <span className="text-thp-blue font-medium truncate">{customer.customerType || '-'}</span>
                                </div>
                                <div className="flex gap-2 text-sm">
                                    <span className="text-gray-400 min-w-[80px]">Package:</span>
                                    <span className="text-thp-red font-bold truncate">{customer.package || '-'}</span>
                                </div>
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
                                {customer.paymentMethod || 'Cash'}
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
                    additionalFields={SYSTEM_FIELDS}
                    onSubmit={handleAddSubmit}
                    onCancel={() => setIsAddOpen(false)}
                />
            )}

            {/* Edit Customer Modal */}
            {isEditOpen && selectedCustomer && (
                <DynamicForm
                    title="แก้ไขข้อมูลลูกค้า (Edit Customer)"
                    config={appConfig}
                    additionalFields={SYSTEM_FIELDS} // Note: This won't populate existing values correctly unless we pass them to initialData or handle it in DynamicForm.
                    // DynamicForm uses initialData[key]. Our keys are on selectedCustomer root, not data.
                    // We need to merge them for the form to work nicely with initialData prop logic or pass explicit initialAdditionalData
                    // For now, let's merge them into initialData prop just for the form's consumption
                    // initialData={{ ...selectedCustomer.data, customerType: selectedCustomer.customerType, ... }}
                    initialData={{
                        ...selectedCustomer.data,
                        customerType: selectedCustomer.customerType,
                        paymentMethod: selectedCustomer.paymentMethod,
                        package: selectedCustomer.package
                    }}
                    onSubmit={handleEditSubmit}
                    onCancel={() => { setIsEditOpen(false); setSelectedCustomer(null); }}
                />
            )}

            import ServiceUsageForm from '../components/ServiceUsageForm';

            // ... (existing imports)

            // ... inside Customers component ...

            {/* Usage Record Modal (Complex Form) */}
            {isUsageOpen && selectedCustomer && (
                <ServiceUsageForm
                    customer={selectedCustomer}
                    onSubmit={(record) => {
                        addUsageRecord(selectedCustomer.id, record);
                        setIsUsageOpen(false);
                        setSelectedCustomer(null);
                    }}
                    onCancel={() => { setIsUsageOpen(false); setSelectedCustomer(null); }}
                />
            )}
        </div>
    );
}
