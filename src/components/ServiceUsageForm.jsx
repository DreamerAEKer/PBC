import React, { useState, useEffect } from 'react';
import { X, Save, Calculator } from 'lucide-react';
import { SERVICE_CATALOG } from '../data/ServiceCatalog';

export default function ServiceUsageForm({ customer, onSubmit, onCancel }) {
    // Store values as a map: { "1.1": { revenue: 0, qty: 0, discount: 0, total: 0 } }
    const [values, setValues] = useState({});
    const [grandTotal, setGrandTotal] = useState(0);

    // Initialize values
    useEffect(() => {
        const initial = {};
        SERVICE_CATALOG.forEach(group => {
            group.items.forEach(item => {
                initial[item.code] = { revenue: '', qty: '', discount: '', total: 0 };
            });
        });
        setValues(initial);
    }, []);

    // Calculate Grand Total whenever values change
    useEffect(() => {
        const total = Object.values(values).reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        setGrandTotal(total);
    }, [values]);

    const handleChange = (code, field, value) => {
        setValues(prev => {
            const currentItem = prev[code] || { revenue: 0, qty: 0, discount: 0, total: 0 };
            const newValue = value === '' ? '' : parseFloat(value);

            const updatedItem = { ...currentItem, [field]: newValue };

            // Auto-calculate total: Revenue - Discount
            if (field === 'revenue' || field === 'discount') {
                const rev = field === 'revenue' ? (newValue || 0) : (currentItem.revenue || 0);
                const disc = field === 'discount' ? (newValue || 0) : (currentItem.discount || 0);
                updatedItem.total = rev - disc;
            }

            return { ...prev, [code]: updatedItem };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filter only items with usage
        const usedItems = Object.entries(values)
            .filter(([_, val]) => val.qty > 0 || val.revenue > 0)
            .map(([code, val]) => {
                // Find item name
                let name = code;
                SERVICE_CATALOG.forEach(g => {
                    const found = g.items.find(i => i.code === code);
                    if (found) name = found.name;
                });

                return {
                    code,
                    name,
                    ...val,
                    revenue: Number(val.revenue) || 0,
                    qty: Number(val.qty) || 0,
                    discount: Number(val.discount) || 0,
                    total: Number(val.total) || 0
                };
            });

        if (usedItems.length === 0) {
            alert("กรุณากรอกข้อมูลอย่างน้อย 1 รายการ");
            return;
        }

        onSubmit({
            date: new Date().toISOString(),
            grandTotal,
            items: usedItems
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-2xl z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">บันทึกการใช้บริการ (Service Usage Log)</h2>
                        <p className="text-sm text-gray-500">ลูกค้า: {customer.data.name} ({customer.customerType})</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                            <span className="text-gray-500 text-xs uppercase font-bold">ยอดรวมทั้งหมด</span>
                            <p className="text-xl font-bold text-thp-red">฿{grandTotal.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <form id="usage-form" onSubmit={handleSubmit} className="space-y-8">
                        {SERVICE_CATALOG.map(group => (
                            <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-thp-blue/5 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="font-bold text-thp-blue text-sm uppercase">{group.title}</h3>
                                </div>

                                {/* Grid Header */}
                                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-100">
                                    <div className="col-span-5 md:col-span-4">รายการ (Service)</div>
                                    <div className="col-span-2 text-right">รายได้ (บาท)</div>
                                    <div className="col-span-2 text-right">จำนวน (ชิ้น)</div>
                                    <div className="col-span-2 text-right">ส่วนลด (บาท)</div>
                                    <div className="col-span-1 md:col-span-2 text-right">รวม (บาท)</div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {group.items.map(item => {
                                        const val = values[item.code] || {};
                                        return (
                                            <div key={item.code} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-50 transition-colors">
                                                <div className="col-span-5 md:col-span-4 flex flex-col justify-center">
                                                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                                    <span className="text-xs text-gray-400">{item.code}</span>
                                                </div>

                                                <div className="col-span-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        value={val.revenue}
                                                        onChange={(e) => handleChange(item.code, 'revenue', e.target.value)}
                                                        className="w-full text-right px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-thp-blue outline-none text-sm"
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        value={val.qty}
                                                        onChange={(e) => handleChange(item.code, 'qty', e.target.value)}
                                                        className="w-full text-right px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-thp-blue outline-none text-sm bg-gray-50"
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        value={val.discount}
                                                        onChange={(e) => handleChange(item.code, 'discount', e.target.value)}
                                                        className="w-full text-right px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-thp-blue outline-none text-sm text-red-500"
                                                    />
                                                </div>

                                                <div className="col-span-1 md:col-span-2 text-right">
                                                    <span className={`font-bold text-sm ${val.total > 0 ? 'text-thp-blue' : 'text-gray-300'}`}>
                                                        {val.total ? val.total.toLocaleString() : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        ยกเลิก (Cancel)
                    </button>
                    <button
                        type="submit"
                        form="usage-form"
                        className="px-8 py-2 rounded-lg font-bold bg-thp-red text-white hover:bg-red-700 shadow-xl shadow-red-200 transition-all flex items-center gap-2 transform active:scale-95"
                    >
                        <Save size={20} />
                        บันทึกข้อมูล (Save Record)
                    </button>
                </div>
            </div>
        </div>
    );
}
