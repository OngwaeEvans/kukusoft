# Kukusoft Supabase Backend Specification

## 1. Core Architecture
- **Provider**: Supabase (PostgreSQL + Auth + Edge Functions).
- **Primary Pattern**: Event Sourcing. We store every change as an immutable record in the `journal` table.

## 2. Database Schema (Postgres)

### users
- `id`: uuid (references auth.users, primary key)
- `email`: text
- `farm_name`: text
- `phone`: text
- `is_active`: boolean
- `created_at`: timestamp

### farms
- `id`: uuid (primary key)
- `user_id`: uuid (references users.id)
- `name`: text
- `location`: text
- `created_at`: timestamp

### flocks
- `id`: uuid (primary key)
- `user_id`: uuid (references users.id)
- `farm_id`: uuid (references farms.id)
- `name`: text
- `breed`: text
- `initial_count`: integer
- `current_count`: integer
- `status`: text ('active', 'archived')
- `updated_at`: timestamp

### journal (The Heart of Sync)
- `id`: uuid (primary key)
- `user_id`: uuid (references users.id)
- `farm_id`: uuid (references farms.id)
- `flock_id`: uuid (references flocks.id)
- `event_type`: text
- `payload`: jsonb
- `device_timestamp`: bigint
- `server_timestamp`: timestamp
- `device_id`: text

### licenses
- `id`: uuid (primary key)
- `user_id`: uuid (references users.id)
- `tier`: text
- `expiry_date`: timestamp
- `signed_token`: text

## 3. Strict Row Level Security (RLS)
All tables must enforce tenant isolation:
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE flocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant Policies
CREATE POLICY "Users can only manage their own profile" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can only manage their own farms" ON farms FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only manage their own flocks" ON flocks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only manage their own journal" ON journal FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only manage their own licenses" ON licenses FOR ALL USING (auth.uid() = user_id);
```

## 4. Sync Edge Function: `process_journal`
This function handles incoming bundles of events from the `useFarmData.ts` hook.
- **Input**: Array of `JournalEntry`.
- **Logic**:
  1. Verify Auth.
  2. Map entries to `journal` table.
  3. Update aggregate tables (`flocks`, current day summaries) using a Postgres Trigger based on new journal entries.

## 5. License Enforcement Function: `validate_license`
- Invoked on app-start or once every 24 hours.
- Signs a new license token if the subscription is valid.
- Injects `gracePeriod` based on user profile.
