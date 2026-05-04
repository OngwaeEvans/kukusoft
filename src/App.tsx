/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Egg, 
  Utensils, 
  AlertTriangle, 
  ChevronRight, 
  Plus, 
  Minus, 
  X,
  TrendingUp,
  Activity,
  History,
  LayoutDashboard,
  Bird,
  ClipboardList,
  Lightbulb,
  Settings as SettingsIcon,
  Search,
  Globe,
  Moon,
  CloudCheck,
  CloudOff,
  RefreshCw,
  Shield,
  DollarSign
} from 'lucide-react';
import { useFarmData, PoultryEvent, DailyRecord } from './hooks/useFarmData';
import { ActionCard } from './components/ActionCard';

import { AdminDashboard } from './components/AdminDashboard';

import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { useTheme } from './hooks/useTheme';
import { useLanguage, translations } from './hooks/useLanguage';

type ModalType = 'eggs' | 'feed' | 'health' | 'growth' | 'finance' | 'flock';
type ViewType = 'home' | 'flocks' | 'records' | 'insights' | 'settings' | 'admin';

export default function App() {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { 
    getToday, 
    updateToday, 
    addEvent, 
    records, 
    isOnline, 
    syncStatus,
    pendingCount,
    license,
    totals,
    insights
  } = useFarmData();

  if (!isAuthenticated) {
    return <Login />;
  }
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [activeTab, setActiveTab] = useState<ViewType>('home');
  const today = getToday();

  const handleEggUpdate = (amount: number) => {
    updateToday({ eggs: Math.max(0, today.eggs + amount) });
  };

  const handleFeedUpdate = (amount: number) => {
    updateToday({ feedAmount: Math.max(0, today.feedAmount + amount) });
  };

  const handleQuickLog = (type: string, count: number, notes?: string) => {
    addEvent({ type: type as any, count, notes, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    setActiveModal(null);
  };

  const renderHome = () => (
    <div className="space-y-10">
      <section className="px-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-display text-ink">{t('overview')}</h2>
          <div className="flex items-center gap-2 px-3 py-1.5 glass-button rounded-full">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isOnline ? t('active') : t('offline')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">{t('eggsToday')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-ink tracking-tighter tabular-nums">{today.eggs}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">{t('totalEggs')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-emerald-600 tracking-tighter tabular-nums">{totals.eggs}</span>
            </div>
          </div>
          <div className="col-span-2 space-y-1 pt-6 border-t border-slate-50">
            <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">{t('revenue')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-emerald-600 tracking-tighter tabular-nums">
                Ksh {totals.sales.toLocaleString()}
              </span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest pl-1">{t('currentPeriod')}</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-6 px-2">
          <h3 className="text-xl font-bold text-ink">{t('quickActions')}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('tapToLog')}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ActionCard 
            id="action-eggs"
            title={t('eggs')} 
            subtitle={t('eggsTodayCount')}
            icon={Egg} 
            onClick={() => setActiveModal('eggs')} 
            variant="primary"
          />
          <ActionCard 
            id="action-feed"
            title={t('feed')} 
            subtitle={t('feedUsage')}
            icon={Utensils} 
            onClick={() => setActiveModal('feed')} 
            variant="secondary"
          />
          <ActionCard 
            id="action-health"
            title={t('health')} 
            subtitle={t('healthMeds')}
            icon={Shield} 
            onClick={() => setActiveModal('health')} 
            variant="secondary"
          />
          <ActionCard 
            id="action-finance"
            title={t('finance')} 
            subtitle={t('salesExpenses')}
            icon={DollarSign} 
            onClick={() => setActiveModal('finance')} 
            variant="secondary"
          />
          <ActionCard 
            id="action-growth"
            title={t('growth')} 
            subtitle={t('birdWeights')}
            icon={TrendingUp} 
            onClick={() => setActiveModal('growth')} 
            variant="secondary"
          />
          <ActionCard 
            id="action-flock"
            title={t('flock')} 
            subtitle={t('newBatch')}
            icon={Plus} 
            onClick={() => setActiveModal('flock')} 
            variant="secondary"
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-xl font-bold text-ink">{t('todayActivity')}</h3>
          <span className="text-[10px] font-black bg-slate-900 dark:bg-slate-700 text-white px-2 py-1 rounded-lg uppercase tracking-widest">
            {today.events.length} {t('logs')}
          </span>
        </div>
        <div className="space-y-3">
          {today.events.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <ClipboardList className="text-slate-200" size={32} />
              </div>
              <p className="text-slate-400 font-medium italic">{t('noActivity')}</p>
            </div>
          ) : (
            today.events.map((event, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index} 
                className="glass-card p-5 flex items-center justify-between group hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-slate-50 text-slate-600`}>
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-ink capitalize">{translations[language][event.type] || event.type}</p>
                    <p className="text-xs text-slate-400 font-medium">
                      {event.count} {t('units')} {event.notes ? `• ${event.notes}` : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{event.time}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );

  const renderFlocks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl text-display">{t('birdBatches')}</h2>
        <button className="glass-button p-3 rounded-xl text-emerald-600">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {[
          { name: 'Batch A - Layers', count: 482, status: t('healthy'), performance: '92%' },
          { name: 'Batch B - Chicks', count: 215, status: t('brooding'), performance: '-' }
        ].map((flock, i) => (
          <motion.div 
            key={i}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-6 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Bird size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{flock.name}</h3>
                <p className="text-sm text-slate-400">{flock.count} {t('birds')} • {flock.status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-emerald-600">{flock.performance}</p>
              <p className="text-[10px] uppercase font-bold text-slate-300">{t('rate')}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-8 bg-slate-900 overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">{t('inventorySummary')}</p>
          <p className="text-2xl text-white text-display tracking-tight">{t('totalBirdsAcrossFlocks', { count: 697 })}</p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
      </div>
    </div>
  );

  const renderRecords = () => (
    <div className="space-y-6">
      <div className="glass-button p-4 rounded-2xl flex items-center gap-3 text-slate-400 focus-within:text-emerald-500 transition-colors">
        <Search size={20} />
        <input type="text" placeholder={t('searchHistory')} className="bg-transparent border-none outline-none w-full font-medium" />
      </div>

      <div className="space-y-2">
        {(Object.values(records) as DailyRecord[])
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((record, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2" />
              <div className="w-px flex-1 bg-slate-200 my-1" />
            </div>
            <div className="flex-1 pb-8">
              <p className="text-xs font-extrabold text-slate-400 mb-2">
                {new Date(record.date).toLocaleDateString(language === 'EN' ? 'en-US' : 'sw-KE', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <div className="glass-card p-4 flex justify-between items-center">
                <div className="flex gap-6">
                  <div>
                    <p className="text-lg font-bold tabular-nums text-ink">{record.eggs}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{t('eggs')}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold tabular-nums text-ink">{record.feedAmount}kg</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{t('feed')}</p>
                  </div>
                </div>
                {record.events.length > 0 && (
                  <div className="flex -space-x-1">
                    {record.events.map((_, j) => (
                      <div key={j} className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-white" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-8">
      <div className="text-center px-4 pt-4">
        <h2 className="text-3xl text-display text-ink">{t('intelligence')}</h2>
        <p className="text-slate-400 font-medium mt-1">{t('smartOptimizations', { count: Object.keys(records).length })}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="glass-card p-6 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20">
           <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">{t('efficiency')}</p>
           <p className="text-2xl font-black text-ink">{insights.feedEfficiency}kg</p>
           <p className="text-[10px] font-bold text-emerald-600/60 uppercase">{t('perEgg')}</p>
        </div>
        <div className="glass-card p-6 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20">
           <p className="text-[10px] font-black text-rose-600 uppercase mb-2">{t('losses')}</p>
           <p className="text-2xl font-black text-ink">{totals.mortality}</p>
           <p className="text-[10px] font-bold text-rose-600/60 uppercase">{t('totalDeaths')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { 
            title: insights.isHealthy ? t('maintainProduction') : t('lowProductionAlert'), 
            desc: insights.isHealthy 
              ? t('maintainProductionDesc')
              : t('lowProductionAlertDesc'), 
            icon: Lightbulb, 
            color: insights.isHealthy ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50' 
          },
          { title: t('feedOptimization'), desc: t('feedOptimizationDesc', { val: insights.feedEfficiency }), icon: Utensils, color: 'text-sky-600 bg-sky-50' },
          { title: t('projectedSales'), desc: t('projectedSalesDesc', { count: totals.eggs, amount: totals.sales.toLocaleString() }), icon: TrendingUp, color: 'text-violet-600 bg-violet-50' }
        ].map((tip, i) => (
          <div key={i} className="glass-card p-6 flex gap-5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tip.color}`}>
              <tip.icon size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-display text-lg tracking-normal">{tip.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
       <div className="px-2">
        <h2 className="text-3xl text-display mb-1">{t('settings')}</h2>
        <p className="text-slate-400 font-medium">{t('personalPreferences')}</p>
      </div>

      <section className="space-y-3">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2">{t('language')}</p>
        <div className="glass-card overflow-hidden">
          <button 
            onClick={toggleLanguage}
            className="w-full p-6 flex items-center justify-between border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <Globe size={20} />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200">{t('language')}</span>
            </div>
            <span className="text-sm font-bold text-emerald-600">{language === 'EN' ? 'English (US)' : 'Kiswahili'}</span>
          </button>
          <button 
            onClick={toggleTheme}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                <Moon size={20} className={theme === 'dark' ? 'text-amber-500' : ''} />
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200">{t('darkMode')}</span>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
              <motion.div 
                animate={{ x: theme === 'dark' ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
              />
            </div>
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2">{t('subscription')}</p>
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">{license.tier}</h3>
            <p className="text-xs text-slate-400 font-medium">{t('expires')} {new Date(license.expiry).toLocaleDateString()}</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">
            {license.status}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2">{t('system')}</p>
        <div className={`glass-card p-6 flex items-center justify-between ${
          !isOnline ? 'bg-rose-50/50' : 
          syncStatus === 'pending' ? 'bg-amber-50/50' : 'bg-emerald-50/50'
        }`}>
          <div className="flex items-center gap-4">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors ${
               !isOnline ? 'bg-rose-500 text-white shadow-rose-500/20' : 
               syncStatus === 'pending' ? 'bg-amber-500 text-white shadow-amber-500/20' : 
               'bg-emerald-500 text-white shadow-emerald-500/20'
             }`}>
                {!isOnline ? <CloudOff size={20} /> : 
                 syncStatus === 'pending' ? <RefreshCw size={20} className="animate-spin" /> : 
                 <CloudCheck size={20} />}
              </div>
              <div>
                <p className={`font-bold ${!isOnline ? 'text-rose-950' : syncStatus === 'pending' ? 'text-amber-950' : 'text-emerald-950'}`}>
                  {!isOnline ? t('workingOffline') : syncStatus === 'pending' ? t('syncingRecords') : t('cloudSyncActive')}
                </p>
                <p className={`text-xs font-semibold ${!isOnline ? 'text-rose-600/70' : syncStatus === 'pending' ? 'text-amber-600/70' : 'text-emerald-600/70'}`}>
                  {!isOnline ? t('changesWaiting', { count: pendingCount }) : syncStatus === 'pending' ? t('finalizingBackup') : t('protectedBackedUp')}
                </p>
              </div>
          </div>
          <button className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-3 py-1.5 glass-button rounded-lg">{t('check')}</button>
        </div>
      </section>

      <button 
        onClick={logout}
        className="w-full py-5 rounded-3xl bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-sm uppercase tracking-widest hover:bg-rose-100 transition-colors"
      >
        {t('signOut')} ({user?.email})
      </button>
    </div>
  );

  const getHeader = () => {
    switch(activeTab) {
      case 'home': return { title: user?.farm_name || 'Kukusoft', subtitle: new Date().toLocaleDateString(language === 'EN' ? 'en-US' : 'sw-KE', { weekday: 'long', month: 'short', day: 'numeric' }) };
      case 'flocks': return { title: t('flocks'), subtitle: t('farmOverview') };
      case 'records': return { title: t('records'), subtitle: t('archiveProduction') };
      case 'insights': return { title: t('insights'), subtitle: t('optimizationTips') };
      case 'settings': return { title: t('settings'), subtitle: t('personalPreferences') };
      case 'admin': return { title: t('admin'), subtitle: t('globalSystemHealth') };
    }
  };

  const currentHeader = getHeader();

  return (
    <div className="min-h-screen text-ink selection:bg-emerald-100 bg-slate-50/30">
      <header className="px-6 pt-12 pb-8 flex justify-between items-start max-w-2xl mx-auto relative z-10">
        <div>
          <motion.h1 
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl text-display text-ink"
          >
            {currentHeader.title}
          </motion.h1>
          <motion.p 
            key={`${activeTab}-sub`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-400 font-medium mt-1"
          >
            {currentHeader.subtitle}
          </motion.p>
        </div>
        {activeTab === 'home' && (
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 glass-button rounded-2xl flex items-center justify-center text-slate-400 relative"
            aria-label="View history"
          >
            <History size={22} />
            <motion.div 
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"
            />
          </motion.button>
        )}
      </header>

      <main className="px-6 pb-32 max-w-2xl mx-auto min-h-[70vh] relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && renderHome()}
            {activeTab === 'flocks' && renderFlocks()}
            {activeTab === 'records' && renderRecords()}
            {activeTab === 'insights' && renderInsights()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'admin' && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-6 left-6 right-6 z-40 flex items-center justify-center">
        <div className="glass-card max-w-lg w-full flex justify-between items-center p-2 rounded-full shadow-2xl">
            {[
              { id: 'home' as ViewType, icon: LayoutDashboard, label: t('dashboard') },
              { id: 'flocks' as ViewType, icon: Bird, label: t('flocks') },
              { id: 'records' as ViewType, icon: ClipboardList, label: t('records') },
              { id: 'insights' as ViewType, icon: Lightbulb, label: t('insights') },
              { id: 'settings' as ViewType, icon: SettingsIcon, label: t('settings') },
              { id: 'admin' as ViewType, icon: History, label: t('admin') }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative group p-3 rounded-full outline-none"
                aria-label={tab.label}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <div className={`relative z-10 transition-colors duration-300 ${activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  <tab.icon size={24} />
                </div>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-tab"
                  className="absolute inset-0 bg-emerald-50 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            
            <motion.div 
              layoutId={`modal-${activeModal}`}
              initial={{ y: '100%', scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: '100%', scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-t-[3rem] sm:rounded-[3rem] p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full sm:hidden" />
              
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveModal(null)}
                className="absolute right-8 top-8 w-11 h-11 glass-button rounded-2xl flex items-center justify-center text-slate-400"
                aria-label="Close modal"
              >
                <X size={22} />
              </motion.button>

              {activeModal === 'eggs' && (
                <div className="space-y-10">
                  <div className="text-center pt-2">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Egg size={40} />
                    </div>
                    <h3 className="text-3xl text-display">{t('recordEggs')}</h3>
                    <p className="text-slate-400 font-medium mt-1">{t('foundInNests')}</p>
                  </div>

                  <div className="flex items-center justify-center gap-12">
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleEggUpdate(-1)}
                      className="w-16 h-16 glass-button rounded-full flex items-center justify-center text-slate-400 border-2"
                    >
                      <Minus size={24} />
                    </motion.button>
                    <motion.span 
                      key={today.eggs}
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-7xl font-black tabular-nums tracking-tighter text-slate-900 leading-none"
                    >
                      {today.eggs}
                    </motion.span>
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleEggUpdate(1)}
                      className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_12px_24px_rgba(16,185,129,0.3)]"
                    >
                      <Plus size={24} />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[5, 10, 30].map(val => (
                      <button 
                        key={val}
                        onClick={() => handleEggUpdate(val)}
                        className="py-4 glass-button rounded-2xl text-lg font-black text-slate-600"
                      >
                        +{val}
                      </button>
                    ))}
                    <button 
                       onClick={() => setActiveModal(null)}
                       className="col-span-3 py-5 bg-slate-900 text-white rounded-3xl text-display"
                    >
                      {t('confirmHarvest')}
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'feed' && (
                <div className="space-y-10">
                  <div className="text-center pt-2">
                    <div className="w-20 h-20 bg-amber-500/10 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Utensils size={40} />
                    </div>
                    <h3 className="text-3xl text-display">{t('logFeed')}</h3>
                    <p className="text-slate-400 font-medium mt-1">{t('amountDispensed')}</p>
                  </div>

                  <div className="flex items-center justify-center gap-12">
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleFeedUpdate(-5)}
                      className="w-16 h-16 glass-button rounded-full flex items-center justify-center text-slate-400 border-2"
                    >
                      <Minus size={24} />
                    </motion.button>
                    <motion.span 
                      key={today.feedAmount}
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-7xl font-black tabular-nums tracking-tighter text-slate-900 leading-none"
                    >
                      {today.feedAmount}
                    </motion.span>
                    <motion.button 
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleFeedUpdate(5)}
                      className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white"
                    >
                      <Plus size={24} />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[10, 25, 50].map(val => (
                      <button 
                        key={val}
                        onClick={() => handleFeedUpdate(val)}
                        className="py-4 glass-button rounded-2xl text-lg font-black text-slate-600"
                      >
                        +{val}kg
                      </button>
                    ))}
                    <button 
                       onClick={() => setActiveModal(null)}
                       className="col-span-3 py-5 bg-slate-900 text-white rounded-3xl text-display"
                    >
                      {t('saveFeeding')}
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'health' && (
                <div className="space-y-8">
                  <div className="text-center pt-2">
                    <div className="w-20 h-20 bg-rose-500/10 text-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Shield size={40} />
                    </div>
                    <h3 className="text-3xl text-display">{t('healthLog')}</h3>
                    <p className="text-slate-400 font-medium mt-1">{t('selectActionType')}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'vaccine', label: t('vaccination'), color: 'bg-emerald-50 text-emerald-600' },
                      { id: 'treatment', label: t('treatment'), color: 'bg-amber-50 text-amber-600' },
                      { id: 'death', label: t('mortality'), color: 'bg-rose-50 text-rose-600' }
                    ].map(type => (
                      <button 
                        key={type.id}
                        onClick={() => handleQuickLog(type.id, 1)}
                        className={`w-full p-6 ${type.color} rounded-3xl flex items-center justify-between group transition-all active:scale-95`}
                      >
                        <span className="text-lg font-black">{type.label}</span>
                        <Plus size={20} className="opacity-40 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'finance' && (
                <div className="space-y-8">
                  <div className="text-center pt-2">
                    <div className="w-20 h-20 bg-violet-500/10 text-violet-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <DollarSign size={40} />
                    </div>
                    <h3 className="text-3xl text-display">{t('cashFlow')}</h3>
                    <p className="text-slate-400 font-medium mt-1">{t('quickEntry')}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleQuickLog('sale', 30, t('oneTraySold'))}
                      className="p-8 bg-emerald-50 text-emerald-600 rounded-[2.5rem] text-center space-y-2 active:scale-95 transition-transform"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest">{t('revenueLabel')}</p>
                      <p className="text-2xl font-black">+ Ksh 450</p>
                      <p className="text-xs font-bold opacity-60">{t('oneTraySold')}</p>
                    </button>
                    <button 
                      onClick={() => handleQuickLog('expense', 1, t('generalMisc'))}
                      className="p-8 bg-rose-50 text-rose-600 rounded-[2.5rem] text-center space-y-2 active:scale-95 transition-transform"
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest">{t('expenseLabel')}</p>
                      <p className="text-2xl font-black">- Ksh 200</p>
                      <p className="text-xs font-bold opacity-60">{t('generalMisc')}</p>
                    </button>
                    <button className="col-span-2 py-5 glass-button rounded-3xl text-sm font-black text-slate-400 uppercase tracking-widest">
                      {t('customAmount')}
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'growth' && (
                <div className="space-y-10">
                   <div className="text-center pt-2">
                    <div className="w-20 h-20 bg-sky-500/10 text-sky-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <TrendingUp size={40} />
                    </div>
                    <h3 className="text-3xl text-display">{t('birdWeight')}</h3>
                    <p className="text-slate-400 font-medium mt-1">{t('avgGramsPerBird')}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-8xl font-black text-slate-900 dark:text-slate-200 tracking-tighter tabular-nums">1.45</p>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">{t('kgPerBird')}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '<'].map(k => (
                      <button key={k} className="h-16 glass-button rounded-2xl text-xl font-black text-slate-800">
                        {k}
                      </button>
                    ))}
                    <button 
                      onClick={() => handleQuickLog('weight', 1.45)}
                      className="col-span-3 py-5 bg-slate-900 text-white rounded-3xl text-display mt-4"
                    >
                      {t('logWeight')}
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'flock' && (
                <div className="space-y-8">
                  <div className="text-center pt-2">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Plus size={40} />
                    </div>
                    <h3 className="text-3xl text-display">{t('newFlock')}</h3>
                    <p className="text-slate-400 font-medium mt-1">{t('startNewCycle')}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('flockName')}</label>
                      <input type="text" placeholder="e.g. Batch C - April" className="w-full text-sm font-bold p-5 glass-button rounded-2xl outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('count')}</label>
                          <input type="number" placeholder="500" className="w-full text-sm font-bold p-5 glass-button rounded-2xl outline-none" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('category')}</label>
                          <select className="w-full text-sm font-bold p-5 glass-button rounded-2xl outline-none appearance-none">
                             <option>Layers</option>
                             <option>Broilers</option>
                             <option>Chicks</option>
                          </select>
                       </div>
                    </div>
                    <button 
                      onClick={() => setActiveModal(null)}
                      className="w-full py-5 bg-slate-900 text-white rounded-3xl text-display mt-4"
                    >
                      {t('createBatch')}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
