import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FaUsers, FaDollarSign, FaBolt, FaChartBar, FaBell, FaSearch } from 'react-icons/fa';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
        ]);
        if (statsRes.success) setStats(statsRes.stats);
        if (usersRes.success) setUsers(usersRes.users || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const handleBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    try {
      await api.post('/admin/broadcast', { message: broadcastMsg });
      toast.success('Notification broadcast sent!');
      setBroadcastMsg('');
    } catch { toast.error('Broadcast failed'); }
  };

  const handleUserStatus = async (userId, status) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
      toast.success('User status updated');
    } catch { toast.error('Update failed'); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Platform management and analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Users" value={stats?.totalUsers || '—'} icon={FaUsers} iconBg="bg-blue-500/20" loading={loading} />
        <StatsCard title="Active Subscriptions" value={stats?.activeSubscriptions || '—'} icon={FaChartBar} iconBg="bg-emerald-500/20" loading={loading} />
        <StatsCard title="Monthly Revenue" value={stats?.monthlyRevenue || '—'} icon={FaDollarSign} iconBg="bg-amber-500/20" loading={loading} />
        <StatsCard title="AI Requests Today" value={stats?.todayAIRequests || '—'} icon={FaBolt} iconBg="bg-purple-500/20" loading={loading} />
      </div>

      {/* Broadcast */}
      <div className="card mb-8">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><FaBell className="text-primary-400" size={16} /> Broadcast Notification</h3>
        <div className="flex gap-3">
          <input value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)}
            placeholder="Message to send to all users..."
            className="input-field flex-1" />
          <button onClick={handleBroadcast} className="btn-primary whitespace-nowrap">Send to All</button>
        </div>
      </div>

      {/* Users table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">All Users ({users.length})</h3>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
              className="input-field pl-9 py-2 text-sm w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="text-left py-2 px-3">Name</th>
                <th className="text-left py-2 px-3">Email</th>
                <th className="text-left py-2 px-3">Role</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Subscription</th>
                <th className="text-left py-2 px-3">Joined</th>
                <th className="text-left py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.slice(0, 50).map(u => (
                <tr key={u.id} className="hover:bg-white/2">
                  <td className="py-2.5 px-3 text-white font-medium">{u.name}</td>
                  <td className="py-2.5 px-3 text-slate-400">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <span className="badge-primary capitalize">{u.role?.replace('_', ' ')}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`badge ${u.status === 'active' ? 'badge-success' : u.status === 'suspended' ? 'badge-danger' : 'badge-warning'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 capitalize">{u.subscription || 'free'}</td>
                  <td className="py-2.5 px-3 text-slate-500">{formatRelativeTime(u.createdAt)}</td>
                  <td className="py-2.5 px-3">
                    <select onChange={e => handleUserStatus(u.id, e.target.value)} defaultValue={u.status}
                      className="bg-dark-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none">
                      <option value="active">Active</option>
                      <option value="suspended">Suspend</option>
                      <option value="deleted">Delete</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-slate-500">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
