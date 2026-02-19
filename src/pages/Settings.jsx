import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash, Save } from 'lucide-react';

export default function Settings() {
    const { appConfig, updateConfig } = useAppContext();
    const [config, setConfig] = useState(appConfig);

    // Sync state if context changes (though usually verify sync on unmount/save)

    const handleLabelChange = (sectionIndex, fieldIndex, newLabel) => {
        const newConfig = { ...config };
        newConfig.sections[sectionIndex].fields[fieldIndex].label = newLabel;
        setConfig(newConfig);
    };

    const handleAddField = (sectionIndex) => {
        const newConfig = { ...config };
        newConfig.sections[sectionIndex].fields.push({
            key: `custom_field_${Date.now()}`,
            label: 'หัวข้อใหม่ (New Field)',
            type: 'text',
            required: false
        });
        setConfig(newConfig);
    };

    const handleDeleteField = (sectionIndex, fieldIndex) => {
        const newConfig = { ...config };
        newConfig.sections[sectionIndex].fields.splice(fieldIndex, 1);
        setConfig(newConfig);
    };

    const saveSettings = () => {
        updateConfig(config);
        alert('บันทึกการตั้งค่าเรียบร้อยแล้ว (Settings Saved)');
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">ตั้งค่าหัวข้อข้อมูล (Field Configuration)</h1>
                    <p className="text-gray-500">ปรับเปลี่ยนชื่อหัวข้อ หรือเพิ่มหัวข้อใหม่ได้ตามต้องการ</p>
                </div>
                <button
                    onClick={saveSettings}
                    className="bg-thp-blue text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-900 shadow-lg shadow-blue-200 transition-all"
                >
                    <Save size={20} />
                    บันทึกการตั้งค่า
                </button>
            </div>

            <div className="space-y-8">
                {config.sections.map((section, sIndex) => (
                    <div key={section.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-red-50 text-thp-red flex items-center justify-center text-sm">{sIndex + 1}</span>
                            {section.title}
                        </h2>

                        <div className="space-y-4">
                            {section.fields.map((field, fIndex) => (
                                <div key={field.key} className="flex items-center gap-4 group">
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-400 mb-1 block">ชื่อหัวข้อ (Label)</label>
                                        <input
                                            type="text"
                                            value={field.label}
                                            onChange={(e) => handleLabelChange(sIndex, fIndex, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-thp-blue focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <label className="text-xs text-gray-400 mb-1 block">ประเภท (Type)</label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-500 text-sm border border-gray-100">
                                            {field.type}
                                        </div>
                                    </div>
                                    {/* Prevent deleting core fields if needed, but for now allow strict flexibility */}
                                    <button
                                        onClick={() => handleDeleteField(sIndex, fIndex)}
                                        className="p-2 mt-5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="ลบหัวข้อ"
                                    >
                                        <Trash size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => handleAddField(sIndex)}
                            className="mt-6 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-medium hover:border-thp-blue hover:text-thp-blue hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            เพิ่มหัวข้อในส่วนนี้
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
