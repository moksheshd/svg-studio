# Current Sprint: Phase 1 - SVG Import & Display

**Status**: ⏳ Ready to Start  
**Goal**: Users can import and view SVG files in a 2D workspace  
**Timeline**: Week 1 (7 days estimated)  
**Started**: Not yet started  
**Phase Details**: [docs/phases/PHASE_1_SVG_IMPORT.md](phases/PHASE_1_SVG_IMPORT.md)

## Sprint Objective
Build the foundation for SVG animation by creating a robust import and display system. Users should be able to drag & drop SVG files and see them rendered in a clean 2D workspace with proper navigation.

## Active Tasks

### Camera & Scene Setup
- [ ] **Switch to orthographic camera for true 2D view**
  - Replace PerspectiveCamera with OrthographicCamera in App.tsx
  - Position camera at (0, 0, 10) looking down at XY plane
  - Set orthographic bounds based on viewport size

### File Import System
- [ ] **Implement SVG file import with drag & drop**
  - Add dragover, dragenter, drop event handlers to canvas
  - Prevent default browser behavior and show visual feedback
  - Validate file type (only .svg files)
  - Add file input button as fallback option

### SVG Processing
- [ ] **Parse and render SVG using Three.js**
  - Use Three.js SVGLoader for robust SVG parsing
  - Convert SVG paths to Three.js geometries
  - Maintain original styling (fill, stroke, opacity)
  - Position elements correctly in 3D space (Z=0)

### Workspace Features
- [ ] **Add visual workspace elements**
  - Grid helper for alignment and reference
  - Coordinate system indicators (X/Y axes)
  - Fit SVG to viewport on import

- [ ] **Implement basic navigation**
  - Mouse wheel zoom in/out functionality
  - Right-click + drag to pan around canvas
  - Reset view button/shortcut (spacebar)

## Definition of Done
- [ ] User can drag & drop SVG file onto canvas
- [ ] SVG renders correctly with original styling preserved
- [ ] User can zoom and pan around the imported SVG
- [ ] Grid provides visual reference for alignment
- [ ] Performance is smooth with typical SVG files (< 1MB)

## Current Blockers
*None - ready to start*

## Notes
- Focus on Three.js SVGLoader over manual DOM parsing for robustness
- OrthographicCamera essential for true 2D feel without perspective distortion
- Consider performance implications for large SVG files

## Next Sprint Preview
Once Phase 1 is complete, Phase 2 will focus on element selection and interaction for animation targeting.

---

*Sprint started: TBD*  
*Last updated: August 27, 2025*
