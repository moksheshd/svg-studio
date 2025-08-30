import * as THREE from 'three'
// @ts-ignore - SVGLoader types not included
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

export interface SVGProcessResult {
  group: THREE.Group
  bounds: THREE.Box3
  center: THREE.Vector3
  size: THREE.Vector3
}

export class SVGProcessor {
  private loader: SVGLoader

  constructor() {
    this.loader = new SVGLoader()
  }

  /**
   * Process SVG content and convert to Three.js objects
   */
  public async processSVGContent(svgContent: string): Promise<SVGProcessResult> {
    return new Promise((resolve, reject) => {
      try {
        // Parse SVG content
        const svgData = this.loader.parse(svgContent)
        
        // Create group to hold all SVG elements
        const svgGroup = new THREE.Group()
        svgGroup.name = 'imported-svg'
        
        // Process each path in the SVG
        svgData.paths.forEach((path: any, index: number) => {
          const shapes = SVGLoader.createShapes(path)
          
          shapes.forEach((shape: THREE.Shape, shapeIndex: number) => {
            // Create geometry from shape
            const geometry = new THREE.ShapeGeometry(shape)
            
            // Create material with SVG styling
            const material = new THREE.MeshBasicMaterial({
              color: path.color !== undefined ? path.color : 0x000000,
              side: THREE.DoubleSide,
              depthWrite: false,
              transparent: path.userData?.style?.opacity !== undefined,
              opacity: path.userData?.style?.opacity || 1
            })
            
            // Create mesh and add to group
            const mesh = new THREE.Mesh(geometry, material)
            mesh.name = `path-${index}-shape-${shapeIndex}`
            svgGroup.add(mesh)
            
            // Handle stroke if present
            if (path.userData?.style?.stroke) {
              const strokeColor = new THREE.Color(path.userData.style.stroke)
              const points = shape.getPoints()
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
              const lineMaterial = new THREE.LineBasicMaterial({
                color: strokeColor,
                linewidth: path.userData.style.strokeWidth || 1
              })
              const line = new THREE.Line(lineGeometry, lineMaterial)
              line.name = `path-${index}-stroke-${shapeIndex}`
              svgGroup.add(line)
            }
          })
        })
        
        // Transform to correct coordinate system
        // SVG has Y-axis pointing down, Three.js has Y-axis pointing up
        svgGroup.scale.y = -1
        
        // Calculate bounds and center
        const bounds = new THREE.Box3().setFromObject(svgGroup)
        const center = bounds.getCenter(new THREE.Vector3())
        const size = bounds.getSize(new THREE.Vector3())
        
        // Center the SVG at origin
        svgGroup.position.x = -center.x
        svgGroup.position.y = -center.y
        svgGroup.position.z = 0
        
        // Recalculate bounds after centering
        const centeredBounds = new THREE.Box3().setFromObject(svgGroup)
        
        resolve({
          group: svgGroup,
          bounds: centeredBounds,
          center: new THREE.Vector3(0, 0, 0),
          size: size
        })
      } catch (error) {
        reject(new Error(`Failed to process SVG: ${error}`))
      }
    })
  }

  /**
   * Load SVG from file
   */
  public async loadSVGFile(file: File): Promise<SVGProcessResult> {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.svg')) {
        reject(new Error('File must be an SVG file'))
        return
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        reject(new Error('SVG file is too large (max 10MB)'))
        return
      }
      
      // Read file content
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        try {
          const svgContent = event.target?.result as string
          const result = await this.processSVGContent(svgContent)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read SVG file'))
      }
      
      reader.readAsText(file)
    })
  }

  /**
   * Scale SVG to fit within target size
   */
  public scaleToFit(svgGroup: THREE.Group, targetSize: number): void {
    const bounds = new THREE.Box3().setFromObject(svgGroup)
    const size = bounds.getSize(new THREE.Vector3())
    
    const maxDimension = Math.max(size.x, size.y)
    if (maxDimension > 0) {
      const scale = targetSize / maxDimension
      svgGroup.scale.multiplyScalar(scale)
    }
  }

  /**
   * Create a simple test SVG for development
   */
  public createTestSVG(): THREE.Group {
    const group = new THREE.Group()
    
    // Create a simple star shape for testing
    const shape = new THREE.Shape()
    const outerRadius = 2
    const innerRadius = 1
    const points = 5
    
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      if (i === 0) {
        shape.moveTo(x, y)
      } else {
        shape.lineTo(x, y)
      }
    }
    shape.closePath()
    
    const geometry = new THREE.ShapeGeometry(shape)
    const material = new THREE.MeshBasicMaterial({
      color: 0x4a90e2,
      side: THREE.DoubleSide
    })
    
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = 'test-star'
    group.add(mesh)
    
    return group
  }
}
