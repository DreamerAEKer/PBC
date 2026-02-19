import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// Initial Configuration
const INITIAL_CONFIG = {
    sections: [
        {
            id: "basic_info",
            title: "ข้อมูลพื้นฐาน (Basic Info)",
            fields: [
                { key: "name", label: "ชื่อลูกค้า/บริษัท", type: "text", required: true },
                { key: "contact_person", label: "ชื่อผู้ติดต่อ", type: "text" },
                { key: "phone", label: "เบอร์โทรศัพท์", type: "text" },
            ]
        },
        {
            id: "address_info",
            title: "ข้อมูลการจัดส่ง (Delivery Info)",
            fields: [
                { key: "address", label: "ที่อยู่", type: "textarea" },
                { key: "sub_district", label: "แขวง/ตำบล", type: "text" },
                { key: "district", label: "เขต/อำเภอ", type: "text" },
                { key: "province", label: "จังหวัด", type: "text" },
                { key: "zipcode", label: "รหัสไปรษณีย์", type: "text" },
            ]
        },
        {
            id: "business_info",
            title: "ข้อมูลธุรกิจ (Business Info)",
            fields: [
                { key: "route", label: "เส้นทางขนส่ง", type: "text" },
                { key: "sales_rep", label: "ผู้รับผิดชอบ", type: "text" }
            ]
        }
    ]
};

// Initial Mock Customers
const INITIAL_CUSTOMERS = [
    {
        id: "CUST-001",
        group: "E-Commerce",
        data: {
            name: "บริษัท แฟชั่นออนไลน์ จำกัด",
            contact_person: "คุณสุดสวย",
            phone: "081-234-5678",
            address: "123 ถ.สุขุมวิท",
            sub_district: "คลองตัน",
            district: "คลองเตย",
            province: "กรุงเทพฯ",
            zipcode: "10110",
            route: "สาย 1 (สุขุมวิท)",
            sales_rep: "สมชาย"
        },
        usageHistory: [
            { id: 101, date: "2024-02-15", service: "EMS", quantity: 200, amount: 8000 },
            { id: 102, date: "2024-02-18", service: "EMS", quantity: 150, amount: 6000 }
        ],
        createdAt: new Date().toISOString()
    }
];

export const AppProvider = ({ children }) => {
    const [appConfig, setAppConfig] = useState(() => {
        const saved = localStorage.getItem('thp_crm_config');
        return saved ? JSON.parse(saved) : INITIAL_CONFIG;
    });

    const [customers, setCustomers] = useState(() => {
        const saved = localStorage.getItem('thp_crm_customers');
        return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    });

    useEffect(() => {
        localStorage.setItem('thp_crm_config', JSON.stringify(appConfig));
    }, [appConfig]);

    useEffect(() => {
        localStorage.setItem('thp_crm_customers', JSON.stringify(customers));
    }, [customers]);

    const addCustomer = (customerData, group) => {
        const newCustomer = {
            id: `CUST-${Date.now().toString().slice(-4)}`,
            group,
            data: customerData,
            usageHistory: [],
            createdAt: new Date().toISOString()
        };
        setCustomers(prev => [newCustomer, ...prev]);
    };

    const updateCustomer = (id, updatedData) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, data: { ...c.data, ...updatedData } } : c));
    };

    const addUsageRecord = (customerId, record) => {
        setCustomers(prev => prev.map(c => {
            if (c.id === customerId) {
                const newRecord = { ...record, id: Date.now() };
                return { ...c, usageHistory: [newRecord, ...c.usageHistory] };
            }
            return c;
        }));
    };

    const updateConfig = (newConfig) => {
        setAppConfig(newConfig);
    };

    return (
        <AppContext.Provider value={{
            appConfig,
            customers,
            addCustomer,
            updateCustomer,
            updateConfig,
            addUsageRecord
        }}>
            {children}
        </AppContext.Provider>
    );
};
