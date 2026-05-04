# Kukusoft Reactive State & Data Flow

## 1. Centralized Store (Conceptual)
Kukusoft uses a **Hybrid Local Store** strategy. The source of truth is `IndexedDB` (via Dexie), and the in-memory state is managed by the `useFarmData` hook, which acts as a reactive layer.

### State Structure:
- `user`: Current authenticated farmer (ID, Farm Name).
- `records`: Map of `date -> DailyRecord` (In-memory cache for performance).
- `pendingCount`: Number of events waiting for cloud sync.
- `syncStatus`: Current network synchronization state ('synced' | 'pending').

## 2. The Interaction Loop (Zero-Latency)
1. **Trigger**: User enters 50 eggs and clicks "Save".
2. **Local Write (Async)**: An `UPDATE_RECORDS` event is pushed to IndexedDB immediately.
3. **Optimistic UI Update**: The `useFarmData` state (`records`) is updated instantly in memory.
4. **Reactive Re-render**: Transition animations trigger as numbers pulse to the new values.
5. **Background Sync**: If online, the Service Worker/Hook pushes the journal bundle to Supabase.

## 3. Derived Metrics (On-Device Compute)
We avoid storing redundant "Totals" in the database to prevent drift. Calculations happen on the fly or are memoized:

### Functions:
- `calcEggRate(records)`: (Total Eggs / Total Birds) * 100.
- `calcMortality(records)`: Count of 'death' events over time.
- `calcFinancials(records)`: 
  - `Revenue = sum(sale_events)`
  - `Expenses = sum(feed_costs + treatment_costs)`
  - `Profit = Revenue - Expenses`

## 4. Performance Guardrails
- **Memoized Selectors**: Components only re-render if their specific slice of data (e.g., `today.eggs`) changes.
- **Batched Updates**: Multiple rapid inputs (e.g., entering mortality for multiple flocks) are batched into a single IndexedDB transaction.
