# Kukusoft Product Vision & UX Principles

## 1. Product Vision
Kukusoft is the definitive operating system for the modern farmer. It bridges the gap between complex agricultural data and the intuitive reality of farm life. It is not a database; it is a digital companion that anticipates needs and minimizes friction.

## 2. Design System: Agricultural Glassmorphism
Designed for clarity outdoors and sophistication indoors.

### A. Color Palette
- **Light (Default)**: 
  - `Surface`: rgba(255, 255, 255, 0.7)
  - `Border`: rgba(255, 255, 255, 0.4)
  - `Growth`: #10B981 (Emerald 500)
  - `Harvest`: #F59E0B (Amber 500)
- **Dark**:
  - `Surface`: rgba(15, 23, 42, 0.7)
  - `Border`: rgba(255, 255, 255, 0.1)

### B. Typography
- **Primary**: Inter
- **Display**: Inter Tight (Semi-bold, -0.02em tracking)
- **Precision**: Tabular Numbers for all egg/feed counts.

### C. Glass Principles
- **Blur**: Fixed at 12px for optimal performance and legibility.
- **Layers**: Level 1 (Base) -> Level 2 (Section) -> Level 3 (Action Modal).
- **Contrast**: Text must always maintain 4.5:1 ratio against the blurred background.

## 3. UX Principles
- **The 10-Second Rule**: No core task (recording eggs, feed, or events) should take more than 10 seconds.
- **Haptic Clarity**: Interaction should feel physical. Buttons have weight; transitions have momentum.
- **Zero Instruction Policy**: If a feature needs a tooltip or a manual, it must be redesigned. The UI is its own documentation.
- **Offline Sovereignty**: Every action works completely offline. Data is stored locally first and synced to the cloud whenever a connection is detected.

## 4. Technical Constants
- **Primary Font**: Space Grotesk (Display) + Inter (UI).
- **Storage**: Local-First with Event Journaling.
- **Connectivity**: Graceful degradation to offline mode with sync-queueing.

## 5. Information Architecture (The "Two-Tap" Map)
Kukusoft uses a flat navigation structure to minimize cognitive load. Every core action is reachable within two taps from the launch screen.

### Screen Hierarchy
1. **Dashboard (Home)**: Real-time focus. Today's metrics + Action triggers.
2. **Flocks**: Resource focus. Management of bird batches, health status, and age.
3. **Records**: History focus. A readable archive of production over time.
4. **Insights**: Strategic focus. Simple recommendations to increase yield.
5. **Settings**: System focus. Localization (English/Swahili) and sync controls.

### Navigation Logic
- **Fixed Tab Bar**: Glassmorphic bottom bar for thumb-driven navigation.
- **Contextual Modals**: Actions use full-screen glass overlays to maintain focus.
- **No Sidebars**: All primary features are visible at all times.
