# PHASE 1: SVG Import & Display

**Status**: ⏳ Planned  
**Goal**: Users can import and view SVG files in a 2D workspace  
**Timeline**: Week 1 (7 days estimated)  
**Next Phase**: [PHASE_2_ANIMATION_TARGETING.md](PHASE_2_ANIMATION_TARGETING.md)

## Overview
Build the foundation for SVG animation by creating a robust import and display system. Users should be able to drag & drop SVG files and see them rendered in a clean 2D workspace with proper navigation controls.

## Technical Requirements

### Camera System
- Switch from PerspectiveCamera to OrthographicCamera for true 2D view
- Position camera looking down at XY plane (Z=10, lookAt(0,0,0))
- Set orthographic bounds based on viewport dimensions
- Maintain proper aspect ratio handling

### SVG Processing Pipeline
- Use Three.js SVGLoader for robust SVG parsing
- Support common SVG elements: `<path>`, `<circle>`, `<rect>`, `<polygon>`
- Maintain original styling (fill, stroke, opacity, transforms)
- Handle nested groups and coordinate transformations
- Convert to Three.js geometries positioned at Z=0

### File Import System
- Drag & drop functionality with visual feedback
- File type validation (only .svg files)
- Fallback file input button for accessibility
- Error handling for malformed SVG files

## Detailed Tasks

### Camera Setup
- [ ] **Replace PerspectiveCamera with OrthographicCamera**
  - Update camera initialization in App.tsx
  - Position camera at (0, 0, 10) looking down at XY plane
  - Set orthographic bounds: left/right based on aspect ratio
  - Ensure proper zoom and aspect ratio calculations

### File Import Implementation
- [ ] **Add drag & drop event handlers**
  - Implement dragover, dragenter, dragleave, drop events
  - Prevent default browser behavior for file drops
  - Add visual feedback during drag operations
  - Style drop zone with border/background changes

- [ ] **Create file input fallback**
  - Hidden file input with .svg filter
  - Custom button to trigger file selection
  - Handle FileReader for both drag/drop and input

- [ ] **Add file validation**
  - Check file extension (.svg)
  - Validate file size (warn if > 1MB)
  - Basic SVG structure validation

### SVG Processing
- [ ] **Integrate Three.js SVGLoader**
  - Import SVGLoader from three/examples/jsm/loaders/SVGLoader
  - Set up loader with proper configuration
  - Handle loader success and error callbacks

- [ ] **Convert SVG to Three.js geometry**
  - Parse SVG paths and convert to ShapeGeometry
  - Create materials matching original SVG styling
  - Handle fill, stroke, opacity, and transform properties
  - Group related elements for easier management

- [ ] **Position elements in 3D space**
  - Ensure all SVG elements are positioned at Z=0
  - Handle SVG coordinate system vs Three.js coordinates
  - Maintain proper scaling and positioning

### Workspace Features
- [ ] **Add grid helper**
  - Create GridHelper for visual reference
  - Set grid size and divisions appropriately
  - Make grid toggleable and adjust opacity (0.1)

- [ ] **Implement navigation controls**
  - Mouse wheel zoom in/out with smooth transitions
  - Right-click + drag to pan around canvas
  - Keyboard shortcut to reset view (spacebar)
  - Constrain zoom limits (min/max)

- [ ] **Auto-fit SVG to viewport**
  - Calculate SVG bounding box after import
  - Adjust camera position and zoom to fit SVG
  - Center SVG in viewport
  - Maintain aspect ratio

## Technical Decisions

### Why OrthographicCamera?
- Provides true 2D view without perspective distortion
- Consistent scaling across the entire viewport
- Better for precise SVG work and measurements
- Simpler coordinate mapping between SVG and Three.js

### Why Three.js SVGLoader?
- Robust parsing of complex SVG files
- Handles transforms, groups, and advanced styling
- Maintained by Three.js team with regular updates
- Better performance than manual DOM parsing

### Performance Considerations
- Large SVG files may contain thousands of path elements
- Consider geometry instancing for repeated elements
- Implement efficient memory cleanup when switching files
- Monitor performance with files > 500KB

## Definition of Done
- [ ] User can drag & drop SVG file onto canvas
- [ ] SVG renders correctly with original colors and styling
- [ ] User can zoom in/out with mouse wheel
- [ ] User can pan around with right-click + drag
- [ ] Grid provides visual reference without distraction
- [ ] Reset view function works correctly
- [ ] Performance remains smooth with typical SVG files
- [ ] Error handling works for invalid files

## Testing Requirements
- Test with various SVG files (simple shapes, complex illustrations)
- Verify styling preservation (colors, strokes, opacity, gradients)
- Test performance with large files (500KB+)
- Ensure proper cleanup when loading new files
- Test drag & drop vs file input methods
- Verify navigation controls work smoothly

## Notes & Decisions
- Grid opacity set to 0.1 for subtle reference
- SVG coordinate system requires Y-axis flip for Three.js
- File size warning at 1MB to prevent performance issues
- Right-click for pan to avoid conflicts with selection later

## Lessons Learned
*(To be filled as phase progresses)*

## Next Phase Preview
Phase 2 will build on this foundation by adding element selection and interaction capabilities, preparing for animation targeting.
