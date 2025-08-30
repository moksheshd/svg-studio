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
    if (!this.boundingBox || !this.targetGroup) return
    
    // Remove old bounding box lines if they exist
    if (this.boundingBoxLines) {
      this.boundingBoxLines.geometry.dispose()
      if (this.boundingBoxLines.material instanceof THREE.Material) {
        this.boundingBoxLines.material.dispose()
      }
      this.boundingBoxLines = null
    }
    
    // Get the actual bounding box of the scaled object
    const tempBox = new THREE.Box3().setFromObject(this.targetGroup)
    const min = tempBox.min
    const max = tempBox.max
    
    // Create line geometry for the bounding box
    const points = []
    
    // Create a closed rectangle
    points.push(new THREE.Vector3(min.x, min.y, 0.1))
    points.push(new THREE.Vector3(max.x, min.y, 0.1))
    
    points.push(new THREE.Vector3(max.x, min.y, 0.1))
    points.push(new THREE.Vector3(max.x, max.y, 0.1))
    
    points.push(new THREE.Vector3(max.x, max.y, 0.1))
    points.push(new THREE.Vector3(min.x, max.y, 0.1))
    
    points.push(new THREE.Vector3(min.x, max.y, 0.1))
    points.push(new THREE.Vector3(min.x, min.y, 0.1))
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ 
      color: 0x4a90e2,
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    })
    
    this.boundingBoxLines = new THREE.LineSegments(geometry, material)
    this.boundingBoxLines.renderOrder = 998 // Render on top but below handles
  }

  public attachToGroup(group: THREE.Group): void {
    if (!group) return
    
    this.targetGroup = group
    
    // Calculate and store the bounding box once
    // This will be used throughout the resize operation
    this.boundingBox = new THREE.Box3().setFromObject(group)
    
    // Calculate aspect ratio
    const size = new THREE.Vector3()
    this.boundingBox.getSize(size)
    this.aspectRatio = size.x / size.y
    
    // Store the current scale (including any existing transforms like Y-flip)
    this.originalScale.copy(group.scale)
    
    // Create bounding box visualization
    this.createBoundingBox()
    
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

    // Get the actual bounding box of the scaled object
    const tempBox = new THREE.Box3().setFromObject(this.targetGroup)
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
    
    // Update bounding box lines
    this.createBoundingBox()
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
    return this.boundingBoxLines
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
