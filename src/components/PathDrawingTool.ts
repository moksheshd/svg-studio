import * as THREE from 'three'

export interface PathPoint {
  position: THREE.Vector2
  mesh: THREE.Mesh
}

export class PathDrawingTool {
  private points: PathPoint[] = []
  private pathLine: THREE.Line | null = null
  private pathGroup: THREE.Group
  private isActive: boolean = false
  private pointMaterial: THREE.MeshBasicMaterial
  private hoveredPointMaterial: THREE.MeshBasicMaterial
  private lineMaterial: THREE.LineBasicMaterial
  private hoveredPoint: THREE.Mesh | null = null

  constructor() {
    this.pathGroup = new THREE.Group()
    this.pathGroup.name = 'PathDrawingGroup'
    
    // Material for path points
    this.pointMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a90e2,
      side: THREE.DoubleSide
    })
    
    // Material for hovered points
    this.hoveredPointMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6b6b,
      side: THREE.DoubleSide
    })
    
    // Material for path line
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4a90e2,
      linewidth: 2,
      opacity: 0.8,
      transparent: true
    })
  }
  
  /**
   * Activate path drawing mode
   */
  activate(): void {
    this.isActive = true
    this.clearPath()
  }
  
  /**
   * Deactivate path drawing mode
   */
  deactivate(): void {
    this.isActive = false
  }
  
  /**
   * Check if path drawing mode is active
   */
  isDrawingActive(): boolean {
    return this.isActive
  }
  
  /**
   * Add a point to the path
   */
  addPoint(worldPosition: THREE.Vector2): void {
    if (!this.isActive) return
    
    // Create point mesh
    const geometry = new THREE.CircleGeometry(0.15, 16)
    const mesh = new THREE.Mesh(geometry, this.pointMaterial)
    mesh.position.set(worldPosition.x, worldPosition.y, 0.1) // Slightly above z=0
    mesh.userData.isPathPoint = true
    mesh.userData.pointIndex = this.points.length
    
    // Add to points array
    this.points.push({
      position: worldPosition.clone(),
      mesh
    })
    
    // Add mesh to group
    this.pathGroup.add(mesh)
    
    // Update path line
    this.updatePathLine()
  }
  
  /**
   * Remove a point from the path
   */
  removePoint(pointMesh: THREE.Mesh): void {
    const index = this.points.findIndex(p => p.mesh === pointMesh)
    if (index === -1) return
    
    // Remove mesh from scene
    this.pathGroup.remove(pointMesh)
    pointMesh.geometry.dispose()
    
    // Remove from points array
    this.points.splice(index, 1)
    
    // Update indices for remaining points
    this.points.forEach((point, i) => {
      point.mesh.userData.pointIndex = i
    })
    
    // Update path line
    this.updatePathLine()
  }
  
  /**
   * Move a point to a new position
   */
  movePoint(pointMesh: THREE.Mesh, newPosition: THREE.Vector2): void {
    const point = this.points.find(p => p.mesh === pointMesh)
    if (!point) return
    
    // Update position
    point.position.copy(newPosition)
    point.mesh.position.set(newPosition.x, newPosition.y, 0.1)
    
    // Update path line
    this.updatePathLine()
  }
  
  /**
   * Update the visual path line connecting all points
   */
  private updatePathLine(): void {
    // Remove existing line
    if (this.pathLine) {
      this.pathGroup.remove(this.pathLine)
      this.pathLine.geometry.dispose()
      this.pathLine = null
    }
    
    // Need at least 2 points for a line
    if (this.points.length < 2) return
    
    // Create line geometry from points
    const linePoints = this.points.map(p => 
      new THREE.Vector3(p.position.x, p.position.y, 0.05) // Slightly above z=0 but below points
    )
    
    const geometry = new THREE.BufferGeometry().setFromPoints(linePoints)
    this.pathLine = new THREE.Line(geometry, this.lineMaterial)
    this.pathGroup.add(this.pathLine)
  }
  
  /**
   * Clear all path points and lines
   */
  clearPath(): void {
    // Remove all point meshes
    this.points.forEach(point => {
      this.pathGroup.remove(point.mesh)
      point.mesh.geometry.dispose()
    })
    
    // Remove path line
    if (this.pathLine) {
      this.pathGroup.remove(this.pathLine)
      this.pathLine.geometry.dispose()
      this.pathLine = null
    }
    
    // Clear points array
    this.points = []
  }
  
  /**
   * Get the path group for adding to scene
   */
  getPathGroup(): THREE.Group {
    return this.pathGroup
  }
  
  /**
   * Get all path points
   */
  getPoints(): PathPoint[] {
    return this.points
  }
  
  /**
   * Get path points as Vector2 array (for animation)
   */
  getPathAsVector2Array(): THREE.Vector2[] {
    return this.points.map(p => p.position.clone())
  }
  
  /**
   * Check if a mesh is a path point
   */
  isPathPoint(mesh: THREE.Mesh): boolean {
    return mesh.userData.isPathPoint === true
  }
  
  /**
   * Highlight a point on hover
   */
  highlightPoint(pointMesh: THREE.Mesh | null): void {
    // Reset previous highlight
    if (this.hoveredPoint && this.hoveredPoint !== pointMesh) {
      this.hoveredPoint.material = this.pointMaterial
    }
    
    // Apply new highlight
    if (pointMesh && this.isPathPoint(pointMesh)) {
      pointMesh.material = this.hoveredPointMaterial
      this.hoveredPoint = pointMesh
    } else {
      this.hoveredPoint = null
    }
  }
  
  /**
   * Get cursor style based on hover state
   */
  getHoverCursor(mesh: THREE.Mesh | null): string | null {
    if (!mesh) return null
    
    if (this.isPathPoint(mesh)) {
      return 'move' // Indicates draggable point
    }
    
    return null
  }
  
  /**
   * Check if path has enough points for animation
   */
  hasValidPath(): boolean {
    return this.points.length >= 2
  }
  
  /**
   * Dispose of all resources
   */
  dispose(): void {
    this.clearPath()
    this.pointMaterial.dispose()
    this.hoveredPointMaterial.dispose()
    this.lineMaterial.dispose()
  }
}
