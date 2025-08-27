# Path Animation Tool - Task List

## Project Overview
Building a toolbar-based 2D path animation tool using React + Three.js + GSAP for creating animation paths and animating objects along them.

## Task Progress

### ✅ Completed Tasks
- [x] **Clear homepage and remove cube demo**
  - Removed rotating cubes from App.tsx
  - Set up clean Three.js scene with basic lighting
  - Fixed TypeScript errors with proper useRef typing

- [x] **Make canvas fullscreen**
  - Updated App.tsx to use full viewport (100vw x 100vh)
  - Modified index.css to remove body centering and margins
  - Canvas now fills entire screen without scrollbars

### 🔄 Remaining Tasks

#### Phase 1: Foundation & Architecture

- [ ] **Design and implement toolbar system architecture**
  - Create Toolbar component with tool selection UI
  - Implement tool state management (active tool tracking)
  - Design toolbar layout (position: left vertical recommended)
  - Add tool switching mechanism with visual feedback
  - Set up keyboard shortcuts for tool switching

- [ ] **Create abstract tool interface/system**
  - Build base Tool class/interface with standard methods (activate, deactivate, onMouseDown, onMouseMove, onMouseUp)
  - Implement tool registration system for adding new tools
  - Create ToolManager class to handle tool switching and event delegation
  - Set up mouse event routing to active tool
  - Define tool lifecycle management

- [ ] **Set up 2D-focused Three.js scene with orthographic camera**
  - Replace PerspectiveCamera with OrthographicCamera for true 2D view
  - Position camera to look down at XY plane (camera.position.z = 10, lookAt(0,0,0))
  - Set orthographic camera bounds for optimal workspace view
  - Adjust lighting for 2D work (remove shadows, use flat lighting)

- [ ] **Add grid helper and basic 2D plane setup**
  - Add GridHelper for visual reference and alignment
  - Create coordinate system indicators (X/Y axis lines)
  - Add snap-to-grid functionality for precise positioning
  - Constrain all interactions to Z=0 plane using raycasting
  - Add zoom and pan controls for navigation

#### Phase 2: Path Tool Implementation

- [ ] **Implement Path Tool within toolbar system**
  - Create PathTool class extending base Tool interface
  - Add path tool icon and button to toolbar
  - Implement tool activation/deactivation states
  - Set up path-specific cursor and visual feedback
  - Handle tool-specific mouse event routing

- [ ] **Add path point creation and manipulation**
  - Implement click-to-add path points on canvas
  - Create visual path points (small spheres/circles with hover effects)
  - Add drag-and-drop for existing points with raycasting selection
  - Implement point deletion (right-click or delete key)
  - Store path data as array of Vector2 coordinates
  - Add undo/redo functionality for path editing

- [ ] **Create path visualization with connected lines**
  - Use Three.js LineGeometry to connect path points with smooth lines
  - Implement real-time path updates as points are added/moved
  - Add visual distinction between points and connecting lines
  - Create path direction indicators (arrows or gradient)
  - Add path styling options (color, thickness, line style)

#### Phase 3: Animation & Controls

- [ ] **Integrate GSAP for path animation**
  - Convert path points to GSAP MotionPathPlugin compatible format
  - Create animated object (sphere/shape) that follows the path
  - Implement smooth path interpolation and timing
  - Add animation playback controls (play, pause, stop, restart)
  - Create speed and easing controls for animation customization

- [ ] **Build tool properties panel**
  - Create properties panel component for tool-specific options
  - Add path tool properties (line color, thickness, point size)
  - Implement animation controls (speed slider, easing dropdown, loop toggle)
  - Add export/import functionality for path data
  - Create preset path templates for common animations

- [ ] **Add visual feedback and polish user experience**
  - Implement smooth tool transitions and state changes
  - Add clear visual states for different modes (creating, editing, animating)
  - Create user-friendly tooltips and instructions
  - Add keyboard shortcuts documentation
  - Optimize performance for smooth interactions
  - Add responsive design for different screen sizes

## Core Tools Architecture

### Tool System Design
- **Base Tool Interface**: Standard methods all tools must implement
- **Tool Manager**: Handles tool registration, switching, and event delegation
- **Tool State**: Tracks active tool and tool-specific state

### Planned Tools
- **Selection Tool** - Default cursor for selecting/moving objects (V key)
- **Path Tool** - Creating and editing animation paths (P key)
- **Pan Tool** - Navigate around canvas (H key)
- **Zoom Tool** - Zoom in/out functionality (Z key)

## Technical Implementation Notes

### File Structure
```
src/
├── components/
│   ├── Toolbar/
│   │   ├── Toolbar.tsx
│   │   ├── ToolButton.tsx
│   │   └── PropertiesPanel.tsx
│   └── Tools/
│       ├── BaseTool.ts
│       ├── ToolManager.ts
│       ├── SelectionTool.ts
│       ├── PathTool.ts
│       ├── PanTool.ts
│       └── ZoomTool.ts
├── hooks/
│   ├── useToolManager.ts
│   └── usePathAnimation.ts
└── utils/
    ├── pathUtils.ts
    └── animationUtils.ts
```

### Key Dependencies
- **Three.js**: 3D rendering and scene management
- **GSAP**: Animation engine with MotionPathPlugin
- **React**: UI framework and state management

### Performance Considerations
- Use object pooling for path points to avoid garbage collection
- Implement efficient raycasting for point selection
- Optimize line rendering for smooth real-time updates
- Use requestAnimationFrame for smooth animations

## Progress: 2/12 tasks completed (17%)

## Next Steps
1. Start with toolbar system architecture
2. Implement base tool interface
3. Set up 2D camera and grid system
4. Build path tool as first concrete tool implementation
