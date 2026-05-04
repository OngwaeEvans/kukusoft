# Kukusoft Multi-Tenant Isolation Specification

## 1. Identity & Context
- **Primary Key**: `user_id` (UUID) from Supabase Auth.
- **Session Persistence**: JWT stored in encrypted browser cookies; `currentUser` profile cached in IndexedDB.
- **Context Hook**: `useAuth()` provides the current farmer's identity to all data hooks.

## 2. Strict Partitioning Strategy

### A. Cloud Isolation (Supabase RLS)
Row Level Security (RLS) is the "Hard Border". No query can resolve without an `auth.uid()` check.
```sql
-- Example for all production tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can only access their own events"
ON events FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

### B. Local Isolation (Dexie/IndexedDB)
We avoid a single massive "Globe" of data. Instead, we use **User-Scoped Stores**:
- The database name includes the `user_id` hash or prefix if needed, or more simply, every query in Dexie strictly filters by `user_id`.
- **Logout Logic**: 
  1. Clear in-memory state.
  2. Keep local DB (IndexedDB) for offline return, but encrypt the sensitive portions using a key derived from the user's session if extreme privacy is required.

## 3. Data Model (Isolated Schema)

| Table | Isolation Key | Description |
|-------|---------------|-------------|
| `users` | `id` | Profile, Phone, Farm Name. |
| `farms` | `user_id` | Physical locations owned by the farmer. |
| `flocks` | `user_id` | Groups of birds within a specific farm. |
| `events` | `user_id` | Chronological journal of records (Eggs, Feed, Mortal). |
| `licenses`| `user_id` | Cryptographic signature for that specific account. |
| `sync_queue`| `user_id` | Pending changes for this specific device/user combo. |

## 4. Conflict Resolution in Multi-Tenant
- **Device ID Binding**: Events include `device_id` to prevent circular sync if one farmer uses a tablet and a phone.
- **User-Locked LWW**: Last-Write-Wins only applies within a user's own data set. There is zero risk of a write from Farmer A overwriting Farmer B.
