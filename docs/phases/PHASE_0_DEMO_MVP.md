# PHASE 0: Demo MVP

**Status**: 🔄 IN PROGRESS  
**Goal**: Create working demo with core path animation functionality  
**Timeline**: Week 0 (5-7 days estimated)  
**Started**: August 30, 2025  
**Next Phase**: [PHASE_1_SVG_IMPORT.md](PHASE_1_SVG_IMPORT.md)

## Overview
Build a minimal viable demo that showcases the core concept of SVG Studio: importing an SVG, drawing a path, and animating the SVG along that path. This phase establishes the foundation for all subsequent development while delivering immediate value.

## Demo Requirements
The demo must demonstrate this complete workflow:
1. **Import SVG** - User drags & drops an SVG file
2. **Resize SVG** - User can resize the imported SVG
3. **Draw Path** - User clicks to create animation path points
4. **Play Animation** - User clicks play and SVG follows the path

## Technical Requirements

### Camera System (Simplified)
- OrthographicCamera for true 2D view
- Position camera at (0, 0, 10) looking down at XY plane
- Basic zoom and pan functionality
- No advanced grid or navigation features yet

### SVG Import (Simplified)
- Basic drag & drop functionality
- File type validation (.svg only)
- Simple error handling
- Auto-center imported SVG in viewport

### SVG Processing
- Use Three.js SVGLoader for parsing
- Convert to single mesh/group for easier animation
- Maintain basic styling (fill, stroke)
- Position at Z=0 for 2D workspace

### Resize Functionality
- Corner drag handles for resize
- Maintain aspect ratio during resize
- Visual feedback during resize operation
- Update bounding box calculations

### Path Drawing System
- Click-to-add-point interface
- Visual path line connecting points
- Ability to add/remove points
- Convert path to format compatible with GSAP

### Animation Engine
- GSAP MotionPathPlugin integration
- Smooth path following animation
- Configurable animation speed
- Reset to start position functionality

## Detailed Tasks

### Phase 0.1: Foundation Setup (Days 1-2) ✅ COMPLETED
- [x] **Update camera system** ✅ Completed August 30, 2025
  - Replace PerspectiveCamera with OrthographicCamera
  - Set proper orthographic bounds
  - Add basic zoom (mouse wheel) and pan (right-click drag)

- [x] **Implement basic SVG import** ✅ Completed August 30, 2025
  - Add drag & drop event handlers
  - File validation for .svg files
  - Basic error handling and user feedback
  - Auto-center imported SVG
  - Added upload button as alternative to drag & drop

- [x] **SVG processing and display** ✅ Completed August 30, 2025
  - Integrate Three.js SVGLoader
  - Convert SVG to Three.js geometry
  - Display in scene at Z=0
  - Basic styling preservation
  - Fixed scaling issues for large SVGs

### Phase 0.2: Interaction Tools (Days 3-4)
- [ ] **Add resize functionality**
  - Create corner resize handles
  - Implement drag-to-resize logic
  - Maintain aspect ratio
  - Visual feedback during resize

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

## Technical Decisions

### Camera Implementation (Completed)
- **OrthographicCamera**: Implemented with frustum size 10 for proper 2D workspace
- **Zoom Control**: Mouse wheel with smooth scaling (0.1x to 10x range)
- **Pan Control**: Right-click drag with zoom-adjusted pan speed
- **State Management**: Using useRef hooks to avoid React re-renders
- **Event Handling**: Proper cleanup on component unmount

### Architecture Implementation (Completed)
- **SceneManager Class**: Handles Three.js scene, camera, and renderer
- **SVGProcessor Class**: Manages SVG loading, parsing, and conversion
- **Separation of Concerns**: Clean architecture with modular design
- **Error Handling**: Comprehensive error messages and user feedback

### SVG Import Implementation (Completed)
- **Drag & Drop**: Full drag & drop functionality with visual feedback
- **Upload Button**: Alternative import method via file picker
- **SVGLoader Integration**: Correct import path for Three.js r179
- **Auto-scaling**: SVGs automatically scale to fit viewport
- **Coordinate System**: Proper Y-axis flip for SVG to Three.js conversion

### Animation Approach
- Animate entire SVG as single unit (not individual elements)
- Use GSAP MotionPathPlugin for smooth path following
- Simple linear path interpolation
- No complex easing or timing controls yet

### Path System
- Store path as array of Vector2 points
- Convert to SVG path string for GSAP compatibility
- Visual representation using Three.js LineGeometry
- Simple point-to-point linear interpolation

### UI/UX Simplifications
- Minimal UI - focus on core functionality
- Click-based interactions (no complex gestures)
- Basic visual feedback
- No advanced tools or options yet

## Definition of Done
- [ ] User can drag & drop SVG file and see it displayed
- [ ] User can resize SVG using corner handles
- [ ] User can enter path drawing mode and click to add points
- [ ] User can see visual path connecting the points
- [ ] User can click play and watch SVG smoothly follow the path
- [ ] User can reset animation to start position
- [ ] Demo workflow completes in under 30 seconds
- [ ] Works with common SVG files (icons, simple illustrations)

## Performance Requirements
- Smooth 60fps animation playback
- Responsive interactions (resize, path drawing)
- Fast SVG import and processing (< 2 seconds for typical files)
- Memory efficient (no memory leaks during repeated use)

## Testing Requirements
- Test with various SVG file types and sizes
- Verify animation smoothness across different path complexities
- Test resize functionality with different aspect ratios
- Ensure proper cleanup when importing new files
- Cross-browser compatibility (Chrome, Firefox, Safari)

## Known Limitations (To Address in Later Phases)
- Single SVG animation only (no multiple objects)
- Simple linear path interpolation (no curves)
- Basic resize only (no rotation or advanced transforms)
- No timeline controls or keyframe editing
- No element-level selection or animation
- No save/load project functionality

## Dependencies
- Three.js 0.179.1 (already installed)
- GSAP 3.13.0 (already installed)
- GSAP MotionPathPlugin (may need license for advanced features)

## Success Metrics
- Complete demo workflow in < 30 seconds
- Smooth animation playback (60fps)
- Intuitive user interactions
- Stable performance with typical SVG files
- Foundation ready for Phase 1 enhancements

## Next Phase Integration
Phase 0 establishes the foundation that Phase 1 will enhance:
- Basic SVG import → Advanced import with validation
- Simple resize → Full transform controls
- Basic path drawing → Advanced path editing tools
- Simple animation → Multiple animation types
- Minimal UI → Complete workspace interface

## Implementation Notes

### Phase 0.1 Completion (August 30, 2025)
- **Camera System**: Successfully implemented OrthographicCamera with zoom and pan
- **Architecture Refactor**: Created SceneManager and SVGProcessor classes
- **SVG Import**: Both drag & drop and upload button working perfectly
- **Scaling Fix**: Resolved issue where large SVGs appeared outside viewport
- **File Structure**: Organized code into core, components, effects, and utils directories

### Commits Made:
1. `103ce8b` - feat: switch to orthographic camera for 2D workspace
2. `6d935e2` - feat: add camera zoom and pan controls
3. `78a8804` - feat: refactor architecture and implement SVG import
4. `bc92738` - fix: correct SVGLoader import path for Three.js r179
5. `367c3dd` - fix: improve SVG scaling to ensure visibility

---

*Phase created: August 27, 2025*  
*Phase started: August 30, 2025*  
*Phase 0.1 completed: August 30, 2025*  
*Last updated: August 30, 2025*  
*Target completion: September 5, 2025 (estimated)*
