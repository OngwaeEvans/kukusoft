# Kukusoft UI Specification

## 1. Global Visual Language
- **Surface**: `rgba(255, 255, 255, 0.6)` with `backdrop-filter: blur(12px)`.
- **Primary Color**: Emerald 500 (#10B981) - Represents health and growth.
- **Secondary Color**: Amber 500 (#F59E0B) - Represents resources and harvest.
- **Radius**: `2.5rem (40px)` for main containers; `1.5rem (24px)` for internal elements.

## 2. Screen Anatomy

### Home (The Command Center)
- **Top Bar**: Minimal brand logo + Date stamp + History quick-access.
- **Hero Card**: Morning Brief using "Display" typography (Tabular numbers, font-black).
- **Bento Grid**: Action cards with 24px Lucide icons and brief 2-word descriptions.
- **Insight Banner**: Deep Slate (900) background with high-contrast emerald highlights for urgency.

### Record Modals (The Input Engine)
- **Layout**: Center-aligned hero icon + Title + "Focus Indicator" (the large number).
- **Control Cluster**: Large circular buttons (80px x 80px) flanking the primary value.
- **Submission Barrier**: A single high-contrast footer button that changes color based on the context (Growth Green for eggs, Harvest Gold for feed).

### Records (The Archive)
- **Timeline Rail**: A thin 1px vertical line connecting production days.
- **Dynamic Summaries**: Cards that collapse complexity, showing only the "Big Three" numbers (Eggs, Feed, Events).

## 3. Motion Principles
- **Modal Entrance**: `y: 100% -> 0` using Spring physics (Stiffness: 300, Damping: 30).
- **Tab Switching**: Shared element transition on the active background pill for a "fluid" menu feel.
- **Haptic Simulation**: `scale: 0.95` on tap for physical button feedback.
