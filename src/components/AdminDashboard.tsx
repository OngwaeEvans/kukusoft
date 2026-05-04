import React from 'react';
import { Users, Layout, Activity, Shield, ArrowUpRight, Filter } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export function AdminDashboard() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-ink tracking-tight">{t('admin')}</h1>
          <p className="text-slate-500 font-medium mt-1">{t('globalOversight')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 glass-button rounded-xl text-xs font-bold text-slate-600">
            <Filter size={14} />
            {t('filterView')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
            <ArrowUpRight size={14} />
            {t('exportData')}
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: t('activeUsers'), value: '1,284', icon: Users, trend: '+12%', color: 'text-indigo-600' },
          { label: t('totalFlocks'), value: '3,492', icon: Layout, trend: '+8%', color: 'text-emerald-600' },
          { label: t('syncVelocity'), value: '84/min', icon: Activity, trend: t('optimal'), color: 'text-blue-600' },
          { label: t('licenseRevenue'), value: '$24.8k', icon: Shield, trend: '+15%', color: 'text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {stat.trend}
              </span>
            </div>
            <p className="text-3xl font-black text-ink leading-none">{stat.value}</p>
            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="font-bold text-ink">{t('recentUserGrowth')}</h3>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-200"></span>
              </div>
            </div>
            <div className="p-8 h-64 flex items-end justify-between gap-2">
              {[40, 70, 45, 90, 65, 80, 100, 85, 60, 75, 95, 110].map((h, i) => (
                <div 
                  key={i} 
                  className="w-full bg-indigo-500/20 rounded-t-lg transition-all hover:bg-indigo-500" 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          
          <div className="glass-card p-0">
             <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-ink">{t('criticalAlerts')}</h3>
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full uppercase">{t('newAlerts', { count: 3 })}</span>
             </div>
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { user: 'Farm Alpha', issue: 'Subscription Expired', time: t('ago', { time: '12m' }), severity: 'High' },
                  { user: 'Bento Poultry', issue: 'Abnormal Mortality Spike', time: t('ago', { time: '1h' }), severity: 'Critical' },
                  { user: 'Global Ag', issue: 'Sync Conflict (LWW)', time: t('ago', { time: '3h' }), severity: 'Medium' },
                ].map((alert, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${alert.severity === 'Critical' ? 'bg-rose-500 animate-pulse' : alert.severity === 'High' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                      <div>
                        <p className="font-bold text-sm text-ink">{alert.user}</p>
                        <p className="text-xs text-slate-500 font-medium">{alert.issue}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{alert.time}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-6 bg-slate-900 text-white border-0">
             <h3 className="font-bold mb-4">{t('systemHealth')}</h3>
             <div className="space-y-4">
                {[
                  { label: t('database'), status: t('healthyStatus'), val: 98 },
                  { label: t('authService'), status: t('healthyStatus'), val: 100 },
                  { label: t('edgeRuntime'), status: t('laggingStatus'), val: 72 },
                ].map((s, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">{s.label}</span>
                      <span className={s.val < 80 ? 'text-amber-400' : 'text-emerald-400'}>{s.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${s.val < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${s.val}%` }} 
                      />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-ink mb-4">{t('productionReadiness')}</h3>
            <div className="space-y-4">
               {[
                 { label: 'PWA Service Worker', val: 100, color: 'bg-emerald-500' },
                 { label: 'Signed License Engine', val: 100, color: 'bg-emerald-500' },
                 { label: 'Event Journaling', val: 100, color: 'bg-emerald-500' },
                 { label: 'Supabase RLS Rules', val: 100, color: 'bg-emerald-500' },
                 { label: 'Mobile Optimization', val: 100, color: 'bg-emerald-500' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <div className={`w-4 h-4 rounded-full ${item.color} flex items-center justify-center`}>
                     <div className="w-1.5 h-1.5 rounded-full bg-white" />
                   </div>
                   <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                   <span className="ml-auto text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">{t('activeStatus')}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{t('quickLinks')}</h3>
            <div className="grid grid-cols-1 gap-2">
               {[
                 { label: t('billingDashboard'), key: 'billing' },
                 { label: t('cloudConsole'), key: 'cloud' },
                 { label: t('supportTickets'), key: 'support' },
                 { label: t('auditLogs'), key: 'audit' }
               ].map((link) => (
                 <button key={link.key} className="w-full text-left p-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl border border-slate-100/50 dark:border-slate-800 transition-colors">
                   {link.label}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
