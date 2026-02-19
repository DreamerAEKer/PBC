import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function DynamicForm({ config, initialData = {}, onSubmit, onCancel, title }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Initialize form data with keys from config, preserving initialData if present
        const initial = {};
        config.sections.forEach(section => {
            section.fields.forEach(field => {
                initial[field.key] = initialData[field.key] || '';
            });
        });
        setFormData(initial);
    }, [config, initialData]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                        {config.sections.map(section => (
                            <div key={section.id} className="space-y-4">
                                <h3 className="text-sm font-bold text-thp-blue uppercase tracking-wider border-b border-gray-100 pb-2">
                                    {section.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.fields.map(field => (
                                        <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    required={field.required}
                                                    value={formData[field.key] || ''}
                                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-thp-red focus:border-transparent outline-none transition-all resize-none h-24"
                                                />
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    required={field.required}
                                                    value={formData[field.key] || ''}
                                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-thp-red focus:border-transparent outline-none transition-all"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            ยกเลิก (Cancel)
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg font-medium bg-thp-red text-white hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center gap-2"
                        >
                            <Save size={18} />
                            บันทึก (Save)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
