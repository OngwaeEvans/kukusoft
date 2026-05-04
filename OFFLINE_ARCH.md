# Kukusoft Offline-First Architecture

## 1. Data Strategy: "Local-As-Primary"
The application treats the local device as the source of truth. Every user interaction is an optimistic write to the local store.

## 2. Event-Based Storage
Data is not just a snapshot; it is a stream of events.
- **RecordCreated**: New egg/feed entry.
- **FlockUpdated**: Batch movement or count change.
- **EventLogged**: Mortality or sale record.

## 3. Sync Logic (The Queue)
1. **Queue Store**: Stores serialized change events in a `pending_sync` list.
2. **Connectivity Listener**: Watches `window.onLine`.
3. **Flush Process**: On restoration of signal, pushes the queue using a `Last-Write-Wins` strategy based on device timestamps.
4. **Collision Handling**: If the server has a newer timestamp for the same ID, the local event is merged or flagged for review.

## 4. Storage Tiers
- **Tier 1 (Core)**: `localStorage` for latest 30 days (fastest access).
- **Tier 2 (History)**: `IndexedDB` for full historical logs (scaleable storage).
- **Tier 3 (Cloud)**: Remote backup for multi-device sync and disaster recovery.
