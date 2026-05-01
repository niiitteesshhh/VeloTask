# Lumina Task

**Lumina Task** is a sophisticated, glassmorphic productivity suite designed for modern teams who value both aesthetic precision and functional depth. Built with a "Swiss-meets-Cyberpunk" design philosophy, it transforms the mundane act of task management into an immersive, atmospheric experience.

---

## 🎨 Design Case Study: The "Atmosphere of Action"

### 1. Vision & Identity
The core vision for Lumina Task was to move away from the "sterile" look of traditional SaaS products. Instead of white backgrounds and flat cards, we embraced **Atmospheric Productivity**. The UI is designed to feel like a high-end command center—calm, deep, and focused.

### 2. Visual Language: Glassmorphism & Depth
The interface relies heavily on the **Glassmorphism** trend to create a sense of physical layering.
- **Translucency**: Cards use `backdrop-blur-xl` with high-opacity backgrounds (e.g., `bg-white/[0.03]`). This maintains readability while allowing the fluid mesh gradients to peek through.
- **Inner Glow & Borders**: Subtle, 1px white borders and "neon" shadows (e.g., `shadow-[0_0_15px_rgba(139,92,246,0.3)]`) give elements weight and presence.
- **Dynamic Interaction**: Every card responds to hover with scale transforms and opacity shifts, reinforcing the sense that the interface is "alive."

### 3. Typography & Hierarchy
We opted for a **high-contrast typographic system**:
- **Headings**: Extra-bold, tight-tracking sans-serif fonts for a brutalist, authoritative feel.
- **Micro-copy**: All-caps, tracked-out text for labels and status indicators, ensuring they remain legible even at minute sizes.
- **Intentional Density**: Information is packed tightly inside cards using a "Bento-grid" inspired layout, maximizing the visibility of subtasks, assignees, and tags without overwhelming the eye.

### 4. Behavioral UX
- **Progressive Disclosure**: Detailed subtasks are accessible via an overlay on each card, keeping the primary dashboard clean while allowing deep-dive interaction.
- **Spatial Grid**: The dashboard uses a responsive grid that shifts from 1 to 6 columns, ensuring the "card collection" feel is preserved across all device sizes.
- **Collaborative Visuals**: The Team Page uses circular progress visualizations and avatar stacks to represent workload as a "living" entity rather than just a list of names.

---

## 🚀 Key Features

- **Multi-Workspace Support**: Toggle between different environments (Design, Brand, Engineering) with ease.
- **Team Insights**: Dedicated collaboration view to monitor team workload and task completion rates.
- **Expressive Priorities**: Color-coded urgency levels with animated pulses for critical items.
- **Interactive Subtasks**: Visual progress tracking directly on task cards with deep-dive subtask management overlays.
- **Responsive Architecture**: Fully fluid layout optimized for everything from mobile phones to 4K monitors.

## 🛠️ Tech Stack

- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS (JIT Engine)
- **Animations**: Framer Motion (motion/react)
- **Icons**: Lucide React
- **State**: React Hooks (useState, useEffect, useMemo)

---

> *"Design is not just what it looks like and feels like. Design is how it works."* — Lumina Task focuses on the intersection where high-end aesthetic meets production-grade performance.
