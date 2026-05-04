import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { getDatabase, JournalEvent } from '../lib/db';
import { supabase } from '../lib/supabase';

export type PoultryEvent = 'death' | 'sale' | 'treatment' | 'other';

export interface DailyRecord {
  date: string;
  eggs: number;
  feedAmount: number;
  events: {
    type: PoultryEvent;
    count: number;
    notes?: string;
    time: string;
  }[];
}

export function useFarmData() {
  const { user } = useAuth();
  const [records, setRecords] = useState<Record<string, DailyRecord>>({});
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending'>('synced');
  const [license, setLicense] = useState<{ status: 'active' | 'expired'; tier: string; expiry: string }>({
    status: 'active',
    tier: 'Pro Plan',
    expiry: '2026-12-31'
  });

  const db = useMemo(() => user ? getDatabase(user.id) : null, [user]);

  // Load initial data from Dexie
  useEffect(() => {
    if (!db || !user) {
      setRecords({});
      setPendingCount(0);
      return;
    }

    const loadData = async () => {
      const allEvents = await db.events.toArray();
      const newRecords: Record<string, DailyRecord> = {};
      
      allEvents
        .sort((a, b) => a.device_timestamp - b.device_timestamp)
        .forEach(ev => {
          const date = ev.payload.date;
          if (!newRecords[date]) {
            newRecords[date] = { date, eggs: 0, feedAmount: 0, events: [] };
          }
          
          if (ev.event_type === 'UPDATE_RECORDS') {
            newRecords[date] = { ...newRecords[date], ...ev.payload.updates };
          } else if (ev.event_type === 'ADD_EVENT') {
            newRecords[date].events.push(ev.payload.event);
          }
        });
      
      setRecords(newRecords);
      setPendingCount(allEvents.filter(e => e.status === 'pending').length);
    };

    loadData();
  }, [db, user]);

  const syncJournal = async () => {
    if (!db || !user || !isOnline || syncStatus === 'pending') return;
    
    const pendingEvents = await db.events.where('status').equals('pending').toArray();
    if (pendingEvents.length === 0) return;

    setSyncStatus('pending');
    try {
      // Sync to Supabase
      const { error } = await supabase
        .from('journal')
        .insert(pendingEvents.map(e => ({
          id: e.id,
          user_id: user.id,
          event_type: e.event_type,
          payload: e.payload,
          device_timestamp: e.device_timestamp,
          device_id: e.device_id
        })));

      if (error) throw error;
      
      // Mark as synced in local DB
      await db.events.where('id').anyOf(pendingEvents.map(e => e.id)).modify({ status: 'synced' });
      setPendingCount(prev => prev - pendingEvents.length);
    } catch (error) {
      console.error('Sync failed', error);
    } finally {
      setSyncStatus('synced');
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      syncJournal();
    }
  }, [isOnline, pendingCount, syncStatus]);

  const todayStr = new Date().toISOString().split('T')[0];

  const addToLocalJournal = async (event_type: string, payload: any) => {
    if (!db || !user) return;

    const newEvent: JournalEvent = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      event_type,
      payload,
      device_timestamp: Date.now(),
      device_id: 'default', // Fingerprinting would go here
      status: 'pending'
    };

    await db.events.add(newEvent);
    setPendingCount(prev => prev + 1);
  };

  const getToday = (): DailyRecord => records[todayStr] || {
    date: todayStr,
    eggs: 0,
    feedAmount: 0,
    events: []
  };

  const updateToday = async (updates: Partial<DailyRecord>) => {
    const current = getToday();
    const updated = { ...current, ...updates };
    setRecords(prev => ({
      ...prev,
      [todayStr]: updated
    }));
    await addToLocalJournal('UPDATE_RECORDS', { date: todayStr, updates });
  };

  const addEvent = async (event: DailyRecord['events'][0]) => {
    const today = getToday();
    const updatedEvents = [...today.events, event];
    setRecords(prev => ({
      ...prev,
      [todayStr]: {
        ...today,
        events: updatedEvents
      }
    }));
    await addToLocalJournal('ADD_EVENT', { date: todayStr, event });
  };

  const totals = useMemo(() => {
    const recordList = Object.values(records) as DailyRecord[];
    return {
      eggs: recordList.reduce((sum, r) => sum + r.eggs, 0),
      feed: recordList.reduce((sum, r) => sum + r.feedAmount, 0),
      mortality: recordList.reduce((sum, r) => {
        return sum + r.events.filter(e => e.type === 'death').reduce((s, e) => s + e.count, 0);
      }, 0),
      sales: recordList.reduce((sum, r) => {
        return sum + r.events.filter(e => e.type === 'sale').reduce((s, e) => s + (e.count * 5), 0); // Assuming 5 per unit
      }, 0)
    };
  }, [records]);

  const insights = useMemo(() => {
    const today = getToday();
    const flockSize = 1000; // Hardcoded for demo, should come from flocks table
    const eggRate = (today.eggs / flockSize) * 100;
    const feedEfficiency = today.eggs > 0 ? (today.feedAmount / today.eggs).toFixed(2) : '0';

    return {
      eggRate: eggRate.toFixed(1),
      feedEfficiency,
      isHealthy: eggRate > 70
    };
  }, [records, todayStr]);

  return { 
    records, 
    totals,
    insights,
    getToday, 
    updateToday, 
    addEvent, 
    isOnline, 
    syncStatus, 
    pendingCount, 
    license 
  };
}
