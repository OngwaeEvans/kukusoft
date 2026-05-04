# Kukusoft Command Center (Admin Dashboard)

## 1. Architectural Role
The Admin Dashboard is a restricted view designed for internal operations. It interfaces directly with the Supabase Management API and Edge Functions to oversee the health of the entire ecosystem.

## 2. Information Architecture

### A. Dashboard Overview (The Pulse)
- **Total active farms**: Active data-producing units in the last 24h.
- **Sync Velocity**: Number of journal entries processed per minute.
- **Revenue status**: Active vs. Expiring licenses.

### B. User Management
- **Table**: User ID, Email, Farm Name, Region, Status.
- **Actions**: Reset Password, Flag for Review, Impersonate View (Read-Only).

### C. Farm Monitor
- **Details**: Flock size, Breed distribution, Mortality trends.
- **Objective**: Identifying high-performing farms vs. struggling ones for support.

### D. Sync & Health Logs
- **System Journal**: Real-time stream of incoming events.
- **Conflict Monitor**: Log of LWW (Last-Write-Wins) overrides to detect logic drifts.
- **Error Rates**: Tracking failed sync attempts due to schema mismatches.

### E. License Factory
- **Generation**: Manual override to grant / revoke licenses.
- **Plans**: Create new tiers (e.g., 'Co-op Platinum').

## 3. Design Principles: "Data Without Noise"
- **Density**: High-density tables for scanning large sets of users.
- **Filters**: Instant server-side filtering by date, region, and tier.
- **Status Indicators**: Minimal dots (Green/Amber/Red) for status instead of wordy banners.
