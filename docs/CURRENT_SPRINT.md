# Current Sprint: Phase 0 - Demo MVP

**Status**: 🔄 IN PROGRESS  
**Goal**: Create working demo with core path animation functionality  
**Timeline**: Week 0 (5-7 days estimated)  
**Started**: August 30, 2025  
**Phase Details**: [docs/phases/PHASE_0_DEMO_MVP.md](phases/PHASE_0_DEMO_MVP.md)

## Sprint Objective
Build a minimal viable demo that showcases the core concept of SVG Studio: importing an SVG, drawing a path, and animating the SVG along that path. This establishes the foundation for all subsequent development while delivering immediate value.

## Demo Requirements
The demo must demonstrate this complete workflow:
1. **Import SVG** - User drags & drops an SVG file
2. **Resize SVG** - User can resize the imported SVG
3. **Draw Path** - User clicks to create animation path points
4. **Play Animation** - User clicks play and SVG follows the path

## Active Tasks

### Phase 0.1: Foundation Setup (Days 1-2)
- [x] **Update camera system** ✅
  - Replace PerspectiveCamera with OrthographicCamera in App.tsx
  - Position camera at (0, 0, 10) looking down at XY plane
  - Add basic zoom (mouse wheel) and pan (right-click drag)

- [x] **Implement basic SVG import** ✅
  - Add drag & drop event handlers to canvas
  - File validation for .svg files
  - Basic error handling and user feedback
  - Auto-center imported SVG in viewport

- [x] **SVG processing and display** ✅
  - Integrate Three.js SVGLoader
  - Convert SVG to Three.js geometry
  - Display in scene at Z=0
  - Basic styling preservation

### Phase 0.2: Interaction Tools (Days 3-4)
- [ ] **Add resize functionality**
  - Create corner resize handles
  - Implement drag-to-resize logic
  - Maintain aspect ratio during resize
  - Visual feedback during resize operation

- [ ] **Build path drawing tool**
  - Toggle between normal and path-drawing modes
  - Click-to-add-point functionality
  - Visual path representation (line geometry)
  - Path point editing (drag to move, click to remove)

### Phase 0.3: Animation & Controls (Days 5-7)
- [ ] **Integrate GSAP animation**
  - Set up GSAP MotionPathPlugin
  - Convert drawn path to GSAP-compatible format
  - Implement smooth path following animation
  - Handle animation timing and easing

- [ ] **Add playback controls**
  - Play/pause button
  - Reset to start position
  - Animation speed control (optional)
  - Progress indicator (optional)

- [ ] **Demo polish and testing**
  - Test with various SVG files
  - Smooth user experience flow
  - Error handling and edge cases
  - Performance optimization

## Definition of Done
- [ ] User can drag & drop SVG file and see it displayed
- [ ] User can resize SVG using corner handles
- [ ] User can enter path drawing mode and click to add points
- [ ] User can see visual path connecting the points
- [ ] User can click play and watch SVG smoothly follow the path
- [ ] User can reset animation to start position
- [ ] Demo workflow completes in under 30 seconds
- [ ] Works with common SVG files (icons, simple illustrations)

## Current Blockers
*None*

## Notes
- Focus on Three.js SVGLoader over manual DOM parsing for robustness
- OrthographicCamera essential for true 2D feel without perspective distortion ✅ Implemented
- Consider performance implications for large SVG files
- Camera controls implemented: Mouse wheel zoom (0.1x-10x), right-click pan

## Technical Decisions Made
- **OrthographicCamera**: Implemented with frustum size 10 for proper 2D workspace
- **Camera Controls**: Zoom with mouse wheel, pan with right-click drag
- **State Management**: Using useRef for camera control states to avoid React re-renders
- **Architecture Pattern**: Separated concerns with SceneManager and SVGProcessor classes
- **SVG Import**: Using Three.js SVGLoader from 'three/addons/loaders/SVGLoader.js'
- **Coordinate System**: Properly handling SVG Y-axis flip for Three.js compatibility

## Next Sprint Preview
Once Phase 1 is complete, Phase 2 will focus on element selection and interaction for animation targeting.

---

*Sprint started: August 30, 2025*  
*Last updated: August 30, 2025*
