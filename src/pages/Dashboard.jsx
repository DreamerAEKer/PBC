import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, Truck, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
    </div>
);

export default function Dashboard() {
    const { customers } = useAppContext();

    // Calculate Stats
    const totalCustomers = customers.length;
    const totalUsageCount = customers.reduce((sum, c) => sum + (c.usageHistory?.reduce((s, r) => s + Number(r.quantity), 0) || 0), 0);
    const totalRevenue = customers.reduce((sum, c) => sum + (c.usageHistory?.reduce((s, r) => s + Number(r.amount), 0) || 0), 0);

    // Group Stats by Group
    const groupStats = customers.reduce((acc, curr) => {
        const group = curr.group || 'General';
        acc[group] = (acc[group] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(groupStats).map(key => ({
        name: key,
        value: groupStats[key]
    }));

    const COLORS = ['#1F2060', '#ED1C24', '#FF8042', '#00C49F'];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">ภาพรวมธุรกิจ (Business Overview)</h1>
                <p className="text-gray-500">สรุปข้อมูลลูกค้าและการใช้บริการ</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="ลูกค้าทั้งหมด" value={totalCustomers} color="bg-thp-blue" />
                <StatCard icon={Truck} label="ยอดส่งรวม (ชิ้น)" value={totalUsageCount.toLocaleString()} color="bg-thp-red" />
                <StatCard icon={DollarSign} label="รายได้รวม (บาท)" value={`฿${totalRevenue.toLocaleString()}`} color="bg-green-500" />
                <StatCard icon={TrendingUp} label="กลุ่มลูกค้าหลัก" value={chartData.sort((a, b) => b.value - a.value)[0]?.name || '-'} color="bg-orange-400" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Groups Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">สัดส่วนลูกค้าแยกตามกลุ่ม</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity / Top Customers */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">ลูกค้าล่าสุด</h3>
                    <div className="space-y-4">
                        {customers.slice(0, 5).map(customer => (
                            <div key={customer.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                        {customer.data.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{customer.data.name}</p>
                                        <p className="text-xs text-gray-500">{customer.data.contact_person}</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                                    {customer.group || 'General'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
