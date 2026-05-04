# Kukusoft Animation & Interaction Specification

## 1. Core Philosophy: "Kinetic Utility"
Animations in Kukusoft are not decorations; they are feedback mechanisms. Every movement must confirm a state change or guide the user's eye to the next logical step.

## 2. Timing & Easing
- **Quick Snap**: 150ms - Used for toggle states and hover effects.
- **Natural Slide**: 300ms - Used for entrance/exit transitions.
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (Standard) or Spring for physical objects.

## 3. Feedback States

### A. Haptic Simulation (Touch)
- **Action**: All buttons and interactive cards.
- **Effect**: `scale: 0.96` or `0.98`.
- **Duration**: 100ms response time.

### B. Glass Transitions (Layers)
- **Modal Entrance**: Slide from bottom (`y: 100% -> 0`) with a scale-up (`scale: 0.95 -> 1`).
- **Physics**: Spring (Stiffness: 300, Damping: 30).

### C. Tab Navigation (Fluidity)
- **Shared Element**: The active indicator pill uses `layoutId` to "flow" between icons.
- **Content View**: Staggered fade-in (`opacity: 0 -> 1`) + slight vertical drift (`y: 10 -> 0`).

### D. Data Entry (Confirmation)
- **Numeric Update**: Large counters should have a subtle "pulse" on increment.
- **Success Log**: The "Confirm" button provides a scale-up pop before the modal dismisses.

## 4. Performance Optimizations
- **GPU Acceleration**: Only animate `transform` and `opacity`.
- **Reduced Motion**: Respect system-level "Reduce Motion" settings by defaulting to simple fades.
- **Hardware Agnostic**: No complex blur animations during the transition (blur is fixed post-animation).
