import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { ParkingStats, ParkingSpot, SpotStatus, VehicleType } from '../types';
import { getManagerInsights } from '../services/geminiService';
import { Sparkles, TrendingUp, DollarSign, Car, AlertCircle, Plus, Trash2, Save } from 'lucide-react';

interface DashboardProps {
  stats: ParkingStats;
  spots: ParkingSpot[];
  onAddSlot: (section: string, count: number) => void;
  onDeleteSlot: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, spots, onAddSlot, onDeleteSlot }) => {
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Admin Form States
  const [newSection, setNewSection] = useState('C');
  const [newCount, setNewCount] = useState(5);
  const [deleteId, setDeleteId] = useState('');

  // Mock data for charts
  const occupancyData = [
    { time: '08:00', occupancy: 20 },
    { time: '10:00', occupancy: 45 },
    { time: '12:00', occupancy: 95 },
    { time: '14:00', occupancy: 85 },
    { time: '16:00', occupancy: 60 },
    { time: '18:00', occupancy: 75 },
    { time: '20:00', occupancy: 40 },
  ];

  const revenueData = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 1350 },
    { day: 'Wed', amount: 1500 },
    { day: 'Thu', amount: 1400 },
    { day: 'Fri', amount: 2100 },
    { day: 'Sat', amount: 2400 },
    { day: 'Sun', amount: 1800 },
  ];

  const generateReport = async () => {
    setLoadingAi(true);
    const insight = await getManagerInsights(stats);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">Total Occupancy</p>
              <h3 className="text-2xl font-bold text-slate-800">{Math.round(stats.occupancyRate * 100)}%</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Car size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">{stats.occupiedSpots} / {stats.totalSpots} spots</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">Real-time Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800">${stats.revenue}</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> +12% vs last hour
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">Peak Hours</p>
              <h3 className="text-2xl font-bold text-slate-800">12PM - 2PM</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">High congestion expected</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-xl shadow-sm text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 text-sm">AI Optimization</p>
              <button 
                onClick={generateReport}
                disabled={loadingAi}
                className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors flex items-center gap-2"
              >
                <Sparkles size={12} />
                {loadingAi ? 'Analyzing...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Slot Management Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-indigo-600" /> Add Parking Zone
          </h3>
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Section</label>
              <select 
                value={newSection} 
                onChange={(e) => setNewSection(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm bg-slate-50"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C (New)</option>
                <option value="VIP">VIP Zone</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Slots to Add</label>
              <input 
                type="number" 
                min="1" 
                max="50"
                value={newCount}
                onChange={(e) => setNewCount(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-lg text-sm w-24"
              />
            </div>
            <button 
              onClick={() => onAddSlot(newSection, newCount)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Add Slots
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Trash2 size={18} className="text-rose-600" /> Remove Slot
          </h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Slot ID (e.g. 005)</label>
              <input 
                type="text" 
                placeholder="001"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <button 
              onClick={() => { onDeleteSlot(deleteId); setDeleteId(''); }}
              className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-medium hover:bg-rose-100"
            >
              Delete Slot
            </button>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
          <h3 className="font-semibold text-slate-800 mb-4">Occupancy Trends (Today)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" fontSize={12} stroke="#64748b" />
              <YAxis fontSize={12} stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="occupancy" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
          <h3 className="font-semibold text-slate-800 mb-4">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" fontSize={12} stroke="#64748b" />
              <YAxis fontSize={12} stroke="#64748b" />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insight Result */}
      {aiInsight && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex items-center gap-3 mb-3">
             <Sparkles className="text-indigo-600" size={24} />
             <h3 className="text-lg font-semibold text-indigo-900">Optimization Recommendations</h3>
           </div>
           <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
             {aiInsight}
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;