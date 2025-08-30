import * as THREE from 'three'

export interface ResizeHandle {
  mesh: THREE.Mesh
  position: 'nw' | 'ne' | 'se' | 'sw'
  cursor: string
}

export class ResizeHandles {
  private handles: ResizeHandle[] = []
  private handleSize = 0.3  // Increased size for easier clicking
  private activeHandle: ResizeHandle | null = null
  private boundingBox: THREE.Box3 | null = null
  private targetGroup: THREE.Group | null = null
  private originalScale: THREE.Vector3 = new THREE.Vector3(1, 1, 1)
  private originalMousePos: THREE.Vector2 = new THREE.Vector2()
  private aspectRatio: number = 1
  private boundingBoxLines: THREE.LineSegments | null = null
  
  constructor() {
    this.createHandles()
  }

  private createHandles(): void {
    const geometry = new THREE.BoxGeometry(this.handleSize, this.handleSize, 0.2)
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4a90e2,
      transparent: false,
      depthTest: false,  // Always render on top
      depthWrite: false
    })

    const positions: Array<{ pos: 'nw' | 'ne' | 'se' | 'sw', cursor: string }> = [
      { pos: 'nw', cursor: 'nw-resize' },
      { pos: 'ne', cursor: 'ne-resize' },
      { pos: 'se', cursor: 'se-resize' },
      { pos: 'sw', cursor: 'sw-resize' }
    ]

    positions.forEach(({ pos, cursor }) => {
      const mesh = new THREE.Mesh(geometry.clone(), material.clone())
      mesh.name = `resize-handle-${pos}`
      mesh.visible = false
      mesh.renderOrder = 999 // Render on top
      this.handles.push({ mesh, position: pos, cursor })
    })
  }

  private createBoundingBox(): void {
    // No longer creating bounding box lines - only corner handles are shown
    // This method is kept for compatibility but does nothing
    return
  }
  
  private calculateTightBoundingBox(group: THREE.Group): THREE.Box3 | null {
    const box = new THREE.Box3()
    let hasGeometry = false
    
    // Force update world matrices
    group.updateMatrixWorld(true)
    
    group.traverse((child) => {
      // Only include visible meshes and lines with actual geometry
      if ((child instanceof THREE.Mesh || child instanceof THREE.Line) && child.visible) {
        const geometry = child.geometry
        
        // Check if geometry has actual content
        if (geometry && geometry.attributes.position && geometry.attributes.position.count > 0) {
          // Compute bounding box in world space
          geometry.computeBoundingBox()
          if (geometry.boundingBox && !geometry.boundingBox.isEmpty()) {
            // Clone the geometry's bounding box
            const geomBox = geometry.boundingBox.clone()
            
            // Apply the object's world transform to the box
            geomBox.applyMatrix4(child.matrixWorld)
            
            // Check if box is valid
            const size = new THREE.Vector3()
            geomBox.getSize(size)
            
            // Filter out very small or degenerate geometries
            if (size.x > 0.001 && size.y > 0.001) {
              if (!hasGeometry) {
                box.copy(geomBox)
                hasGeometry = true
              } else {
                box.union(geomBox)
              }
            }
          }
        }
      }
    })
    
    // If we found geometry, add a small padding to ensure handles are visible
    if (hasGeometry && !box.isEmpty()) {
      const padding = 0.1
      box.min.x -= padding
      box.min.y -= padding
      box.max.x += padding
      box.max.y += padding
    }
    
    return hasGeometry ? box : null
  }

  public attachToGroup(group: THREE.Group): void {
    if (!group) return
    
    this.targetGroup = group
    
    // Calculate tight bounding box from visible geometry only
    this.boundingBox = this.calculateTightBoundingBox(group)
    
    if (!this.boundingBox) {
      console.warn('No visible geometry found in group')
      return
    }
    
    // Calculate aspect ratio
    const size = new THREE.Vector3()
    this.boundingBox.getSize(size)
    this.aspectRatio = size.x / size.y
    
    // Store the current scale (including any existing transforms like Y-flip)
    this.originalScale.copy(group.scale)
    
    // No longer creating bounding box lines - only show handles
    this.updateHandlePositions()
    this.showHandles()
  }

  public detach(): void {
    this.hideHandles()
    
    // Remove bounding box lines
    if (this.boundingBoxLines) {
      this.boundingBoxLines.geometry.dispose()
      if (this.boundingBoxLines.material instanceof THREE.Material) {
        this.boundingBoxLines.material.dispose()
      }
      this.boundingBoxLines = null
    }
    
    this.targetGroup = null
    this.boundingBox = null
    this.activeHandle = null
  }

  private updateHandlePositions(): void {
    if (!this.targetGroup) return

    // Calculate tight bounding box for current state
    const tempBox = this.calculateTightBoundingBox(this.targetGroup)
    if (!tempBox) return
    
    const min = tempBox.min
    const max = tempBox.max
    
    this.handles.forEach(handle => {
      let x = 0, y = 0
      
      switch (handle.position) {
        case 'nw':
          x = min.x
          y = max.y
          break
        case 'ne':
          x = max.x
          y = max.y
          break
        case 'se':
          x = max.x
          y = min.y
          break
        case 'sw':
          x = min.x
          y = min.y
          break
      }
      
      handle.mesh.position.set(x, y, 1)  // Higher Z to ensure it's in front
    })
    
    // No longer updating bounding box lines
  }

  public showHandles(): void {
    this.handles.forEach(handle => {
      handle.mesh.visible = true
    })
  }

  public hideHandles(): void {
    this.handles.forEach(handle => {
      handle.mesh.visible = false
    })
  }

  public getHandles(): THREE.Mesh[] {
    return this.handles.map(h => h.mesh)
  }
  
  public getBoundingBoxLines(): THREE.LineSegments | null {
    // No longer using bounding box lines
    return null
  }
  
  public isActive(): boolean {
    return this.targetGroup !== null
  }

  public startResize(handle: THREE.Mesh, mousePos: THREE.Vector2): void {
    const resizeHandle = this.handles.find(h => h.mesh === handle)
    if (!resizeHandle || !this.targetGroup) return
    
    console.log('Starting resize with handle:', resizeHandle.position, 'at position:', mousePos)
    this.activeHandle = resizeHandle
    this.originalMousePos.copy(mousePos)
    
    // IMPORTANT: Store the CURRENT scale, not reset it
    // The SVG already has scale.y = -1 from the initial flip
    this.originalScale.copy(this.targetGroup.scale)
    
    // Don't recalculate bounding box here - use the one from attachToGroup
    // This prevents the flip issue
  }

  public updateResize(mousePos: THREE.Vector2, maintainAspectRatio: boolean = true): void {
    if (!this.activeHandle || !this.targetGroup || !this.boundingBox) return
    
    // Simple delta-based resize
    const deltaX = mousePos.x - this.originalMousePos.x
    const deltaY = mousePos.y - this.originalMousePos.y
    
    // Get the size of the original bounding box
    const size = new THREE.Vector3()
    this.boundingBox.getSize(size)
    
    // Sensitivity factor for resize
    const sensitivity = 1.0
    
    let scaleX = this.originalScale.x
    let scaleY = this.originalScale.y
    
    if (maintainAspectRatio) {
      // For aspect ratio, use diagonal movement
      let scaleDelta = 0
      
      switch (this.activeHandle.position) {
        case 'se': // Bottom-right: positive X and negative Y increase size
          scaleDelta = (deltaX - deltaY) * sensitivity / Math.max(size.x, size.y)
          break
        case 'nw': // Top-left: negative X and positive Y increase size
          scaleDelta = (-deltaX + deltaY) * sensitivity / Math.max(size.x, size.y)
          break
        case 'ne': // Top-right: positive X and positive Y increase size
          scaleDelta = (deltaX + deltaY) * sensitivity / Math.max(size.x, size.y)
          break
        case 'sw': // Bottom-left: negative X and negative Y increase size
          scaleDelta = (-deltaX - deltaY) * sensitivity / Math.max(size.x, size.y)
          break
      }
      
      // Apply scale delta to both axes, preserving the sign of the original scale
      // This is crucial for maintaining the Y-flip from SVG import
      const absScaleX = Math.abs(this.originalScale.x) * (1 + scaleDelta)
      const absScaleY = Math.abs(this.originalScale.y) * (1 + scaleDelta)
      
      scaleX = absScaleX * Math.sign(this.originalScale.x)
      scaleY = absScaleY * Math.sign(this.originalScale.y)
    } else {
      // Free resize - each axis independently
      let scaleFactorX = 1
      let scaleFactorY = 1
      
      switch (this.activeHandle.position) {
        case 'se':
          scaleFactorX = 1 + deltaX * sensitivity / size.x
          scaleFactorY = 1 - deltaY * sensitivity / size.y
          break
        case 'nw':
          scaleFactorX = 1 - deltaX * sensitivity / size.x
          scaleFactorY = 1 + deltaY * sensitivity / size.y
          break
        case 'ne':
          scaleFactorX = 1 + deltaX * sensitivity / size.x
          scaleFactorY = 1 + deltaY * sensitivity / size.y
          break
        case 'sw':
          scaleFactorX = 1 - deltaX * sensitivity / size.x
          scaleFactorY = 1 - deltaY * sensitivity / size.y
          break
      }
      
      // Apply scale factors while preserving the sign (for Y-flip)
      scaleX = Math.abs(this.originalScale.x) * scaleFactorX * Math.sign(this.originalScale.x)
      scaleY = Math.abs(this.originalScale.y) * scaleFactorY * Math.sign(this.originalScale.y)
    }
    
    // Apply minimum and maximum scale limits (to absolute values)
    const absScaleX = Math.max(0.1, Math.min(10, Math.abs(scaleX)))
    const absScaleY = Math.max(0.1, Math.min(10, Math.abs(scaleY)))
    
    // Restore the sign
    scaleX = absScaleX * Math.sign(this.originalScale.x)
    scaleY = absScaleY * Math.sign(this.originalScale.y)
    
    // Apply the scale
    this.targetGroup.scale.set(scaleX, scaleY, 1)
    
    // Update handle positions
    this.updateHandlePositions()
  }

  public endResize(): void {
    this.activeHandle = null
  }

  public isResizing(): boolean {
    return this.activeHandle !== null
  }

  public getActiveHandleCursor(): string | null {
    return this.activeHandle?.cursor || null
  }

  public highlightHandle(handle: THREE.Mesh | null): void {
    this.handles.forEach(h => {
      const material = h.mesh.material as THREE.MeshBasicMaterial
      if (h.mesh === handle) {
        material.color.setHex(0x2563eb)
        h.mesh.scale.set(1.2, 1.2, 1)
      } else {
        material.color.setHex(0x4a90e2)
        h.mesh.scale.set(1, 1, 1)
      }
    })
  }

  public dispose(): void {
    this.handles.forEach(handle => {
      handle.mesh.geometry.dispose()
      if (handle.mesh.material instanceof THREE.Material) {
        handle.mesh.material.dispose()
      }
    })
    this.handles = []
    
    if (this.boundingBoxLines) {
      this.boundingBoxLines.geometry.dispose()
      if (this.boundingBoxLines.material instanceof THREE.Material) {
        this.boundingBoxLines.material.dispose()
      }
      this.boundingBoxLines = null
    }
  }
}
