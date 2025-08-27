# SVG Studio - Task List

## Project Overview
Building a plugin-based SVG Studio using React + Three.js + GSAP. A extensible platform for SVG creation, animation, and manipulation with a powerful plugin architecture that allows for unlimited feature expansion.

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

- [x] **Organize project documentation**
  - Created docs/ directory for project documentation
  - Moved task list to docs/TASK_LIST.md for better organization

### 🔄 Remaining Tasks

- [ ] **Design plugin architecture system**
  - Define plugin interface and lifecycle (init, activate, deactivate, destroy)
  - Create plugin registration and discovery system
  - Design plugin communication and event system
  - Plan plugin types (Tools, Panels, Exporters, Themes, Animations)
  - Define core API that plugins can access
  - Set up plugin sandboxing and security model

- [ ] **Implement hybrid state management architecture**
  - Build CanvasStateManager for high-performance Three.js object state
  - Create PluginStateManager for plugin-to-plugin communication
  - Implement UIStateManager using React state for UI components
  - Design StateBridge for selective synchronization between state layers
  - Add performance monitoring for state updates and FPS tracking
  - Implement event-driven updates without React re-render overhead
  - Create state isolation system to prevent plugin interference
  - Add memory-efficient object pooling for canvas objects

- [ ] **Create core engine foundation**
  - Build Canvas Manager (Three.js scene, camera, rendering pipeline)
  - Implement Event System (unified event handling across plugins)
  - Integrate with hybrid state management system
  - Set up Resource Manager (assets, textures, geometries)
  - Build Performance Monitor (FPS, memory usage tracking)

- [ ] **Implement plugin manager and core API**
  - Build PluginManager class (load, unload, lifecycle management)
  - Create Core API layer (canvas access, event system, state management)
  - Implement plugin communication system (inter-plugin messaging)
  - Add plugin dependency resolution
  - Create plugin hot-reloading for development
  - Build plugin marketplace foundation

- [ ] **Set up 2D-focused Three.js scene with orthographic camera**
  - Replace PerspectiveCamera with OrthographicCamera for true 2D view
  - Position camera to look down at XY plane (camera.position.z = 10, lookAt(0,0,0))
  - Set orthographic camera bounds for optimal workspace view
  - Adjust lighting for 2D work (remove shadows, use flat lighting)
  - Implement viewport management and coordinate systems

- [ ] **Add grid helper and basic 2D plane setup**
  - Add GridHelper for visual reference and alignment
  - Create coordinate system indicators (X/Y axis lines)
  - Add snap-to-grid functionality for precise positioning
  - Constrain all interactions to Z=0 plane using raycasting
  - Add zoom and pan controls for navigation
  - Implement ruler and measurement tools

- [ ] **Implement Path Tool as first plugin**
  - Create PathToolPlugin class implementing base Plugin interface
  - Add plugin registration and activation system
  - Implement tool-specific cursor and visual feedback
  - Handle plugin-specific mouse event routing
  - Create plugin UI integration system
  - Add plugin settings and preferences

- [ ] **Add path point creation and manipulation**
  - Implement click-to-add path points on canvas
  - Create visual path points (small spheres/circles with hover effects)
  - Add drag-and-drop for existing points with raycasting selection
  - Implement point deletion (right-click or delete key)
  - Store path data as array of Vector2 coordinates
  - Add undo/redo functionality for path editing
  - Implement path point snapping and alignment

- [ ] **Create path visualization with connected lines**
  - Use Three.js LineGeometry to connect path points with smooth lines
  - Implement real-time path updates as points are added/moved
  - Add visual distinction between points and connecting lines
  - Create path direction indicators (arrows or gradient)
  - Add path styling options (color, thickness, line style)
  - Implement Bézier curve support for smooth paths

- [ ] **Implement export/import plugin system**
  - SVG Export Plugin - Native SVG file generation
  - JSON Export Plugin - Project file format
  - PNG/JPEG Export Plugin - Raster image export
  - Animation Export Plugin - GIF, MP4 generation
  - Import Plugin System - Load external files

- [ ] **Integrate GSAP animation plugin**
  - Create AnimationPlugin for GSAP integration
  - Convert path points to GSAP MotionPathPlugin compatible format
  - Create animated object (sphere/shape) that follows the path
  - Implement smooth path interpolation and timing
  - Add animation playback controls (play, pause, stop, restart)
  - Create speed and easing controls for animation customization
  - Support multiple animation engines through plugin system

- [ ] **Build plugin UI system and properties panels**
  - Create UI Plugin system for dynamic panel creation
  - Implement Properties Panel Plugin for tool-specific options
  - Add Toolbar Plugin for tool selection and management
  - Create Timeline Plugin for animation control
  - Implement Layers Panel Plugin for object management
  - Add Export Panel Plugin for file format handling
  - Create Theme Plugin system for UI customization

- [ ] **Add visual feedback and polish user experience**
  - Implement smooth plugin transitions and state changes
  - Add clear visual states for different modes (creating, editing, animating)
  - Create user-friendly tooltips and instructions
  - Add keyboard shortcuts system for plugins
  - Optimize performance for smooth interactions
  - Add responsive design for different screen sizes
  - Implement accessibility features

- [ ] **Create additional core plugins**
  - Selection Tool Plugin - Default cursor for selecting/moving objects
  - Pan Tool Plugin - Navigate around canvas
  - Zoom Tool Plugin - Zoom in/out functionality
  - Shape Tool Plugins - Rectangle, circle, polygon creation
  - Text Tool Plugin - Adding and editing text elements

- [ ] **Add collaboration and sharing features**
  - Real-time Collaboration Plugin - Multi-user editing
  - Cloud Storage Plugin - Save/load from cloud services
  - Version Control Plugin - Project history and branching
  - Sharing Plugin - Public project sharing and embedding

## Plugin Architecture Design

### Core System Components
- **Canvas Engine** - Three.js scene management, rendering pipeline
- **Plugin Manager** - Plugin lifecycle, registration, communication
- **Event System** - Unified event handling across all plugins
- **State Manager** - Global application state and plugin state isolation
- **API Layer** - Standardized plugin interface and core functionality access

### Plugin Types
- **Tool Plugins** - Interactive canvas tools (Path, Selection, Shapes, etc.)
- **Panel Plugins** - UI panels (Properties, Timeline, Layers, etc.)
- **Export Plugins** - File format handlers (SVG, PNG, JSON, etc.)
- **Animation Plugins** - Different animation engines (GSAP, CSS, WebGL, etc.)
- **Theme Plugins** - UI customization and branding
- **Integration Plugins** - External service connectors (Cloud storage, APIs, etc.)

### Plugin Communication
- **Event Bus** - Plugin-to-plugin messaging system
- **Shared State** - Controlled access to global application state
- **API Hooks** - Core functionality exposure to plugins
- **Resource Sharing** - Asset and utility sharing between plugins

## Technical Implementation Notes

### File Structure
```
src/
├── core/
│   ├── CanvasEngine.ts
│   ├── PluginManager.ts
│   ├── EventSystem.ts
│   ├── StateManager.ts
│   └── CoreAPI.ts
├── plugins/
│   ├── base/
│   │   ├── BasePlugin.ts
│   │   ├── ToolPlugin.ts
│   │   ├── PanelPlugin.ts
│   │   └── ExportPlugin.ts
│   ├── tools/
│   │   ├── PathToolPlugin.ts
│   │   ├── SelectionToolPlugin.ts
│   │   └── ShapeToolPlugin.ts
│   ├── panels/
│   │   ├── PropertiesPanelPlugin.ts
│   │   ├── TimelinePanelPlugin.ts
│   │   └── LayersPanelPlugin.ts
│   └── exporters/
│       ├── SVGExportPlugin.ts
│       └── JSONExportPlugin.ts
├── components/
│   ├── Canvas/
│   │   ├── Canvas.tsx
│   │   └── CanvasContainer.tsx
│   ├── UI/
│   │   ├── PluginUI.tsx
│   │   └── PluginContainer.tsx
│   └── Layout/
│       ├── MainLayout.tsx
│       └── PluginLayout.tsx
├── hooks/
│   ├── usePluginManager.ts
│   ├── useCanvasEngine.ts
│   └── usePluginState.ts
└── utils/
    ├── pluginUtils.ts
    ├── canvasUtils.ts
    └── mathUtils.ts
```

### Key Dependencies
- **Three.js**: 3D rendering and scene management
- **GSAP**: Animation engine with MotionPathPlugin
- **React**: UI framework and state management
- **TypeScript**: Type safety for plugin interfaces

### Plugin Development Guidelines
- All plugins must implement BasePlugin interface
- Plugins should be self-contained with minimal dependencies
- Use event system for plugin communication
- Follow naming conventions for plugin discovery
- Include plugin metadata for marketplace integration

### Performance Considerations
- Lazy loading of plugins to reduce initial bundle size
- Plugin sandboxing to prevent performance degradation
- Efficient event system to minimize overhead
- Resource pooling for graphics objects
- Optimized rendering pipeline for smooth interactions

## Progress: 3/19 tasks completed (16%)

## Next Steps
1. Design comprehensive plugin architecture
2. Build core engine and plugin manager
3. Implement first tool plugin (Path Tool)
4. Create UI plugin system
5. Establish plugin marketplace foundation

## Vision
Transform SVG Studio into a comprehensive, extensible platform for SVG creation and animation that can compete with professional tools while maintaining simplicity and performance. The plugin architecture will enable unlimited feature expansion and community-driven development.
