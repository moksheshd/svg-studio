import * as THREE from 'three'

export interface ResizeHandle {
  mesh: THREE.Mesh
  position: 'nw' | 'ne' | 'se' | 'sw'
  cursor: string
}

export class ResizeHandles {
  private handles: ResizeHandle[] = []
  private handleSize = 0.15
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
    const geometry = new THREE.BoxGeometry(this.handleSize, this.handleSize, 0.1)
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4a90e2,
      transparent: true,
      opacity: 1
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
    
    // Calculate bounding box
    this.boundingBox = new THREE.Box3().setFromObject(group)
    
    // Calculate aspect ratio
    const size = new THREE.Vector3()
    this.boundingBox.getSize(size)
    this.aspectRatio = size.x / size.y
    
    // Store original scale
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
      
      handle.mesh.position.set(x, y, 0.5)
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
    
    this.activeHandle = resizeHandle
    this.originalMousePos.copy(mousePos)
    this.originalScale.copy(this.targetGroup.scale)
  }

  public updateResize(mousePos: THREE.Vector2, maintainAspectRatio: boolean = true): void {
    if (!this.activeHandle || !this.targetGroup || !this.boundingBox) return
    
    const delta = new THREE.Vector2().subVectors(mousePos, this.originalMousePos)
    const size = new THREE.Vector3()
    this.boundingBox.getSize(size)
    
    // Scale the delta based on the original scale to make resizing more intuitive
    const scaleFactor = 2.0 // Adjust this to control resize sensitivity
    
    let scaleX = this.originalScale.x
    let scaleY = this.originalScale.y
    
    // Calculate scale change based on handle position
    switch (this.activeHandle.position) {
      case 'nw':
        scaleX = this.originalScale.x * (1 - (delta.x * scaleFactor / size.x))
        scaleY = this.originalScale.y * (1 + (delta.y * scaleFactor / size.y))
        break
      case 'ne':
        scaleX = this.originalScale.x * (1 + (delta.x * scaleFactor / size.x))
        scaleY = this.originalScale.y * (1 + (delta.y * scaleFactor / size.y))
        break
      case 'se':
        scaleX = this.originalScale.x * (1 + (delta.x * scaleFactor / size.x))
        scaleY = this.originalScale.y * (1 - (delta.y * scaleFactor / size.y))
        break
      case 'sw':
        scaleX = this.originalScale.x * (1 - (delta.x * scaleFactor / size.x))
        scaleY = this.originalScale.y * (1 - (delta.y * scaleFactor / size.y))
        break
    }
    
    // Maintain aspect ratio if needed
    if (maintainAspectRatio) {
      // Calculate the average scale factor
      const scaleFactorX = scaleX / this.originalScale.x
      const scaleFactorY = scaleY / this.originalScale.y
      
      // Use the larger scale factor to maintain aspect ratio
      const uniformScale = Math.max(scaleFactorX, scaleFactorY)
      
      scaleX = this.originalScale.x * uniformScale
      scaleY = this.originalScale.y * uniformScale
    }
    
    // Apply minimum and maximum scale limits
    scaleX = Math.max(0.1, Math.min(10, scaleX))
    scaleY = Math.max(0.1, Math.min(10, scaleY))
    
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
