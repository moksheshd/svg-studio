# PHASE 2: Animation Targeting

**Status**: ⏳ Planned  
**Goal**: Users can select SVG elements for animation targeting  
**Timeline**: Week 2 (5 days estimated)  
**Previous Phase**: [PHASE_1_SVG_IMPORT.md](PHASE_1_SVG_IMPORT.md)  
**Next Phase**: [PHASE_3_EFFECTS_LIBRARY.md](PHASE_3_EFFECTS_LIBRARY.md)

## Overview
Build element selection and interaction capabilities on top of the SVG import foundation. Users should be able to click on individual SVG elements, see visual feedback, and prepare elements for animation targeting.

## Technical Requirements

### Selection System
- Raycasting for precise element selection in 3D space
- Visual highlighting of selected elements
- Multi-select capability with Ctrl+click
- Selection state management and persistence

### UI Components
- SVG structure panel showing element hierarchy
- Element properties display for selected items
- Selection tools and controls
- Clear visual feedback for interaction states

### Element Management
- Maintain SVG element relationships and hierarchy
- Handle grouped elements and nested structures
- Preserve original SVG IDs and classes for reference
- Efficient selection performance with large SVG files

## Detailed Tasks

### Selection Implementation
- [ ] **Set up raycasting for element selection**
  - Create Raycaster instance for mouse interaction
  - Convert mouse coordinates to 3D world coordinates
  - Implement click detection on SVG geometries
  - Handle selection of overlapping elements

- [ ] **Add visual selection feedback**
  - Create selection highlight material/outline
  - Apply highlight to selected elements
  - Different visual states for hover vs selected
  - Clear selection indicators

- [ ] **Implement multi-select functionality**
  - Ctrl+click to add/remove from selection
  - Shift+click for range selection (if applicable)
  - Click empty space to clear selection
  - Visual indication of multiple selected elements

### UI Panel Development
- [ ] **Create SVG structure panel**
  - Display hierarchical tree of SVG elements
  - Show element types (path, circle, rect, etc.)
  - Display element IDs and classes from original SVG
  - Clickable items to select elements from panel

- [ ] **Build element properties display**
  - Show selected element's basic properties
  - Display fill, stroke, opacity values
  - Show element dimensions and position
  - Path data preview for path elements

- [ ] **Add selection tools**
  - Select all button/shortcut (Ctrl+A)
  - Clear selection button/shortcut (Escape)
  - Invert selection functionality
  - Selection count indicator

### Element Management System
- [ ] **Maintain element hierarchy**
  - Preserve parent-child relationships from SVG
  - Handle group selections appropriately
  - Respect SVG transform inheritance
  - Efficient data structure for element lookup

- [ ] **Implement selection state management**
  - Track selected elements across interactions
  - Persist selection during view changes
  - Handle selection with undo/redo preparation
  - Memory-efficient selection tracking

## Technical Decisions

### Why Raycasting?
- Precise selection in 3D space even with overlapping elements
- Handles complex geometries and transforms correctly
- Integrates well with Three.js rendering pipeline
- Supports future 3D animation capabilities

### Selection Visual Feedback
- Outline/border highlight to avoid obscuring original styling
- Consistent highlight color across all element types
- Hover state different from selection state
- Performance-optimized highlight rendering

### UI Panel Architecture
- React components for panel UI
- Separate state management for UI vs Three.js scene
- Efficient updates when selection changes
- Responsive design for different screen sizes

## Definition of Done
- [ ] User can click on SVG elements to select them
- [ ] Selected elements show clear visual feedback
- [ ] User can select multiple elements with Ctrl+click
- [ ] SVG structure panel displays element hierarchy
- [ ] Clicking panel items selects corresponding elements
- [ ] Element properties display for selected items
- [ ] Selection tools (select all, clear) work correctly
- [ ] Performance remains smooth with complex SVG files

## Testing Requirements
- Test selection with various SVG element types
- Verify multi-select functionality works correctly
- Test panel synchronization with scene selection
- Ensure selection works with nested/grouped elements
- Test performance with large SVG files (many elements)
- Verify selection state persistence during navigation

## Performance Considerations
- Efficient raycasting with large numbers of elements
- Optimize highlight rendering for multiple selections
- Lazy loading of element properties
- Debounced updates for real-time selection feedback

## Notes & Decisions
- Right-click reserved for pan, left-click for selection
- Ctrl+click standard for multi-select across platforms
- Element IDs from SVG preserved for animation targeting
- Selection state separate from animation state

## Lessons Learned
*(To be filled as phase progresses)*

## Next Phase Preview
Phase 3 will use the selection system to apply animation effects to targeted elements, building the core animation functionality.
