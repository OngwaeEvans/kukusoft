# Kukusoft Smart Sync Engine (SSE) Specification

## 1. Principles
- **Event-Driven Architecture**: We don't sync state; we sync actions (events).
- **Delta-Only Transmission**: Only the changes (diffs) are sent to the cloud.
- **Optimistic UI**: The app reflects changes instantly; sync happens in the background.

## 2. The Atomic Event Model
Every change is captured as a "Journal Entry":
```json
{
  "eventId": "uuid-v4",
  "timestamp": 1714800000,
  "deviceId": "dev_001",
  "action": "UPDATE_DAILY_RECORD",
  "payload": {
    "date": "2026-05-04",
    "field": "eggs",
    "value": 42
  },
  "status": "pending" | "synced"
}
```

## 3. Conflict Resolution Strategy: LWW (Last-Write-Wins)
Since farm data is mostly chronological, we use **Temporal Convergence**:
- Each record tracks an `updatedAt` timestamp.
- If two devices update the same metric (e.g., total feed for Monday), the server accepts the event with the higher timestamp.
- For cumulative errors (e.g., two people recording eggs simultaneously), Kukusoft uses **Additive Commutation**: events are processed as `delta` changes (+10, +5) rather than absolute values (Total: 15) where possible.

## 4. Connectivity Adaptation
- **Poor Signal Mode**: If the connection is unstable (packet loss > 20%), the engine switches to "Single-Event Burst" mode instead of batching, ensuring at least one record gets through.
- **Backoff Logic**: 
  - Retry 1: 5 seconds
  - Retry 2: 30 seconds
  - Retry 3: 5 minutes
  - Subsequent: Exponential until 1 hour.

## 5. Sync Flow
1. **Local Journal**: Action saved to `localStorage/journal`.
2. **Connectivity Watcher**: Detects `online` + `low-data-mode` status.
3. **Chunking**: Up to 50 events are bundled into a single compressed JSON payload.
4. **Validation**: Server verifies `deviceId` and `token`.
5. **Marking**: Local DB marks events as `synced` and purges entries older than 90 days to save space.
