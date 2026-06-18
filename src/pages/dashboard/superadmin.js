import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import api from '../../services/api';
import { FaUsers, FaDollarSign, FaBolt, FaCog, FaDatabase, FaShieldAlt, FaCrown, FaChartLine } from 'react-icons/fa';
import { formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, logsRes, revenueRes] = await Promise.all([
          api.get('/superadmin/stats'),
          api.get('/superadmin/audit-logs'),
          api.get('/superadmin/revenue'),
        ]);
        if (statsRes.success) setStats(statsRes.stats);
        if (logsRes.success) setLogs(logsRes.logs || []);
        if (revenueRes.success) setRevenue(revenueRes.report || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <DashboardLayout title="SuperAdmin Dashboard">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaCrown className="text-amber-400" size={24} />
          <h1 className="text-2xl font-bold text-white">SuperAdmin Control Panel</h1>
        </div>
        <p className="text-slate-400">Complete platform management and oversight</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Users" value={stats?.totalUsers || '—'} icon={FaUsers} iconBg="bg-blue-500/20" loading={loading} />
        <StatsCard title="Active Subscriptions" value={stats?.activeSubscriptions || '—'} icon={FaChartLine} iconBg="bg-emerald-500/20" loading={loading} />
        <StatsCard title="Total Revenue" value={stats?.totalRevenue || '—'} icon={FaDollarSign} iconBg="bg-amber-500/20" loading={loading} />
        <StatsCard title="AI Requests Today" value={stats?.todayAIRequests || '—'} icon={FaBolt} iconBg="bg-purple-500/20" loading={loading} />
      </div>

      {/* Subscription breakdown */}
      {stats?.subscriptions && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card text-center">
            <p className="text-slate-400 text-sm mb-1">Monthly Subscriptions</p>
            <p className="text-3xl font-bold text-white">{stats.subscriptions.monthly}</p>
          </div>
          <div className="card text-center">
            <p className="text-slate-400 text-sm mb-1">Yearly Subscriptions</p>
            <p className="text-3xl font-bold text-amber-400">{stats.subscriptions.yearly}</p>
          </div>
          <div className="card text-center">
            <p className="text-slate-400 text-sm mb-1">AI Requests</p>
            <p className="text-3xl font-bold text-cyan-400">{stats.todayAIRequests || 0}</p>
          </div>
        </div>
      )}

      {/* Revenue table */}
      {revenue.length > 0 && (
        <div className="card mb-8">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FaDollarSign className="text-emerald-400" /> Revenue Report
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="text-left py-2 px-3">Period</th>
                  <th className="text-left py-2 px-3">Total Revenue</th>
                  <th className="text-left py-2 px-3">Subscriptions</th>
                  <th className="text-left py-2 px-3">Credits</th>
                  <th className="text-left py-2 px-3">Transactions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {revenue.slice(0, 12).map(r => (
                  <tr key={r.period} className="hover:bg-white/2">
                    <td className="py-2 px-3 text-white font-medium">{r.period}</td>
                    <td className="py-2 px-3 text-emerald-400 font-semibold">{r.total}</td>
                    <td className="py-2 px-3 text-slate-300">GHS {r.subscriptions?.toFixed(2) || '0.00'}</td>
                    <td className="py-2 px-3 text-slate-300">GHS {r.credits?.toFixed(2) || '0.00'}</td>
                    <td className="py-2 px-3 text-slate-400">{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit logs */}
      {logs.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FaShieldAlt className="text-primary-400" /> Audit Logs
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {logs.slice(0, 30).map((l, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5">
                <span className={`badge ${l.type === 'superadmin' ? 'badge-warning' : 'badge-primary'} text-xs flex-shrink-0`}>{l.type}</span>
                <span className="text-sm text-slate-300 flex-1">{l.action}: {l.details}</span>
                <span className="text-xs text-slate-500">{formatRelativeTime(l.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
