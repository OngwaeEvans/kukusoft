# Kukusoft Offline-First License System Specification

## 1. Zero-Trust Offline Architecture
Kukusoft uses a **Cryptographic Lease** model. The license is not just a boolean "active" flag; it is a signed JSON Web Token (JWT) or similar signed structure that contains enforcement metadata.

## 2. License Token Structure
The server issues a token containing:
- `ownerId`: Unique ID of the farm owner.
- `deviceId`: Binding key for the primary device (prevents one license used on 100 phones).
- `tier`: 'Starter', 'Pro', or 'Enterprise'.
- `expiry`: Unix timestamp of subscription end.
- `gracePeriod`: Extra days allowed offline before lockdown.
- `signature`: Server-side HMAC/RSA signature.

## 3. Enforcement Logic
The client performs a **Three-Stage Check**:

### Stage A: Cryptographic Integrity (Instant)
- The app checks if the token signature matches the public key.
- If the token is tampered with (e.g., manually changing `expiry` in `localStorage`), the app immediately locks.

### Stage B: Temporal Validity (Offline)
- If `now() < expiry`, access is **Granted**.
- If `expiry < now() < expiry + gracePeriod`, access is **Granted** with a "Past Due" warning.
- If `now() > expiry + gracePeriod`, access is **Revoked**.

### Stage C: Sync Recency (Security)
- To prevent someone from setting their phone clock back forever, the app tracks `lastSyncTimestamp`.
- If `now() - lastSyncTimestamp > 30 days`, the app requires a "Security Check-in" (briefly going online to re-validate time and signature).

## 4. Degraded States
- **Expired/Invalid**:
  - View historical records: **ENABLED** (READ-ONLY).
  - Add new production records: **DISABLED**.
  - Cloud Sync: **DISABLED**.
- **Valid**: Full access.

## 5. Security Measures
- **Clock Skew Detection**: App compares `Date.now()` with the latest `JournalEntry.timestamp`. If the system clock is older than the last recorded data point, a "Time Paradox" error is triggered, preventing users from rewinding time to bypass expiry.
- **Fingerprinting**: Small hardware identifiers (screen res, language, OS version) are bundled into the license to detect mass-cloning of a single license file.
