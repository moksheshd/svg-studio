# Technical Notes & Implementation Decisions

This document captures technical decisions, patterns, and architectural notes that guide implementation across all phases.

## 🏗️ Architecture Overview

### Core Technology Stack
- **React 19.1**: UI framework with modern features and concurrent rendering
- **Three.js 0.179.1**: Native 3D graphics library for SVG rendering
- **GSAP 3.13.0**: Animation engine with MotionPathPlugin for smooth animations
- **TypeScript 5.9.2**: Type safety and enhanced developer experience
- **Vite 7.0.6**: Fast build tool with HMR and optimized bundling

### Key Architectural Decisions

#### Why Native Three.js (Not React-Three-Fiber)?
- **Direct Control**: Full access to Three.js APIs without abstractions
- **Performance**: No React reconciliation overhead for 3D scene updates
- **SVG Focus**: Better suited for 2D SVG manipulation in 3D space
- **Animation Integration**: Cleaner GSAP integration without React state conflicts

#### Why OrthographicCamera for 2D SVG Work?
- **True 2D View**: No perspective distortion for accurate SVG representation
- **Consistent Scaling**: Objects maintain size regardless of distance
- **Precise Measurements**: Better for design work requiring accuracy
- **Simpler Coordinates**: Direct mapping between SVG and screen coordinates

## 🎨 SVG Processing Pipeline

### SVG Import Strategy
```typescript
// Preferred approach using Three.js SVGLoader
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

const loader = new SVGLoader()
loader.load(svgUrl, (data) => {
  const paths = data.paths
  // Process paths into Three.js geometries
})
```

### Coordinate System Handling
- **SVG Coordinates**: Origin top-left, Y-axis down
- **Three.js Coordinates**: Origin center, Y-axis up
- **Transformation Required**: Flip Y-axis and center origin
- **Implementation**: Apply transform matrix during geometry creation

### Styling Preservation
- **Fill Colors**: Convert SVG fill to Three.js MeshBasicMaterial
- **Stroke Properties**: Use LineBasicMaterial for stroke rendering
- **Opacity**: Maintain transparency through material.transparent
- **Transforms**: Apply SVG transforms to Three.js object matrices

## 🎬 Animation Architecture

### GSAP Integration Pattern
```typescript
// Animation manager structure
class AnimationManager {
  private masterTimeline: gsap.core.Timeline
  private effectTimelines: Map<string, gsap.core.Timeline>
  
  createEffect(element: Object3D, effectType: string, params: EffectParams) {
    // Create isolated timeline for effect
    // Add to master timeline for coordination
  }
}
```

### Effect System Design
- **Base Effect Class**: Common interface for all animation effects
- **Effect Categories**: Entrance, Motion, Transform, Continuous
- **Parameter System**: Standardized configuration interface
- **Timeline Integration**: Each effect creates isolated GSAP timeline

### Performance Considerations
- **Object Pooling**: Reuse geometries and materials where possible
- **Efficient Updates**: Batch Three.js scene updates
- **Memory Management**: Dispose of unused resources promptly
- **Animation Optimization**: Use GSAP's performance features

## 🖱️ Interaction System

### Raycasting for Selection
```typescript
// Selection implementation pattern
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function onMouseClick(event: MouseEvent) {
  // Convert mouse coordinates to normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(selectableObjects)
  // Handle selection
}
```

### Navigation Controls
- **Zoom**: Mouse wheel with smooth transitions
- **Pan**: Right-click + drag (preserves left-click for selection)
- **Reset**: Spacebar to return to default view
- **Constraints**: Limit zoom and pan to reasonable bounds

## 📊 State Management

### Separation of Concerns
- **Three.js Scene State**: Managed directly in Three.js objects
- **UI State**: React state for interface components
- **Animation State**: GSAP timelines and effect parameters
- **Selection State**: Hybrid approach with React state + Three.js references

### Data Flow Pattern
```typescript
// State synchronization pattern
interface ElementState {
  id: string
  threeObject: Object3D
  isSelected: boolean
  effects: EffectConfig[]
  animationState: AnimationParams
}

// React state holds references, Three.js holds visual state
const [elements, setElements] = useState<ElementState[]>([])
```

## 🎯 Performance Guidelines

### Three.js Optimization
- **Geometry Merging**: Combine static geometries where possible
- **Material Sharing**: Reuse materials for similar elements
- **Frustum Culling**: Let Three.js handle off-screen object culling
- **Level of Detail**: Consider LOD for complex SVGs

### Animation Performance
- **GPU Acceleration**: Use transform properties that trigger GPU acceleration
- **Timeline Optimization**: Minimize timeline complexity
- **Effect Batching**: Group similar animations for efficiency
- **Memory Cleanup**: Dispose of completed animation resources

### React Integration
- **Minimal Re-renders**: Keep Three.js updates outside React render cycle
- **Event Delegation**: Use single event listeners for canvas interactions
- **State Batching**: Batch React state updates where possible
- **Memoization**: Use React.memo and useMemo for expensive computations

## 🔧 Development Patterns

### File Organization
```
src/
├── components/          # React UI components
│   ├── Canvas/         # Three.js canvas wrapper
│   ├── Timeline/       # Animation timeline UI
│   └── Panels/         # Side panels and controls
├── core/               # Core Three.js and animation logic
│   ├── SceneManager.ts # Three.js scene setup and management
│   ├── SVGLoader.ts    # SVG import and processing
│   └── AnimationManager.ts # GSAP animation coordination
├── effects/            # Animation effect implementations
│   ├── base/          # Base effect classes
│   ├── entrance/      # Entrance effect implementations
│   └── motion/        # Motion effect implementations
└── utils/             # Utility functions and helpers
```

### TypeScript Patterns
- **Strict Types**: Enable strict mode for better type safety
- **Interface Definitions**: Clear interfaces for all major data structures
- **Generic Effects**: Use generics for reusable effect patterns
- **Type Guards**: Runtime type checking for external data (SVG files)

### Error Handling
- **SVG Validation**: Check file format and structure before processing
- **Animation Errors**: Graceful degradation for failed animations
- **Memory Limits**: Monitor and warn about resource usage
- **User Feedback**: Clear error messages for user-facing issues

## 🧪 Testing Strategy

### Unit Testing
- **Effect Logic**: Test animation parameter calculations
- **SVG Processing**: Verify coordinate transformations
- **State Management**: Test state synchronization
- **Utility Functions**: Comprehensive utility testing

### Integration Testing
- **SVG Import**: Test with various SVG file types
- **Animation Coordination**: Test multiple simultaneous effects
- **Performance**: Benchmark with large SVG files
- **Browser Compatibility**: Test across target browsers

### User Testing
- **Workflow Testing**: Complete user scenarios
- **Performance Testing**: Real-world usage patterns
- **Accessibility Testing**: Keyboard and screen reader support
- **Mobile Testing**: Touch interaction and performance

## 📝 Code Standards

### Naming Conventions
- **Components**: PascalCase (e.g., `TimelinePanel`)
- **Functions**: camelCase (e.g., `createEffect`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_DURATION`)
- **Types/Interfaces**: PascalCase with descriptive names

### Documentation Requirements
- **Public APIs**: JSDoc comments for all public functions
- **Complex Logic**: Inline comments explaining algorithms
- **Type Definitions**: Clear interface documentation
- **Examples**: Code examples for reusable patterns

### Git Workflow
- **Branch Naming**: `feature/phase-1-svg-import`, `fix/animation-memory-leak`
- **Commit Messages**: Conventional commits format
- **Pull Requests**: Require review for main branch
- **Testing**: All tests must pass before merge

---

*These technical notes are updated as implementation progresses and new patterns emerge.*

*Last updated: August 27, 2025*
