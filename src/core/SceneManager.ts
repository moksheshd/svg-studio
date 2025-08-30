import * as THREE from 'three'

export class SceneManager {
  public scene: THREE.Scene
  public camera: THREE.OrthographicCamera
  public renderer: THREE.WebGLRenderer
  private frustumSize: number = 10
  private zoom: number = 1
  private cameraPosition: { x: number; y: number } = { x: 0, y: 0 }
  
  // Groups for organizing scene objects
  public svgGroup: THREE.Group
  public pathGroup: THREE.Group
  public handleGroup: THREE.Group

  constructor(canvas: HTMLCanvasElement) {
    // Initialize scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xf5f5f5)

    // Initialize camera
    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.OrthographicCamera(
      (this.frustumSize * aspect) / -2,
      (this.frustumSize * aspect) / 2,
      this.frustumSize / 2,
      this.frustumSize / -2,
      0.1,
      1000
    )
    this.camera.position.set(0, 0, 10)
    this.camera.lookAt(0, 0, 0)

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true 
    })
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    // Initialize groups
    this.svgGroup = new THREE.Group()
    this.svgGroup.name = 'svgGroup'
    this.scene.add(this.svgGroup)

    this.pathGroup = new THREE.Group()
    this.pathGroup.name = 'pathGroup'
    this.scene.add(this.pathGroup)

    this.handleGroup = new THREE.Group()
    this.handleGroup.name = 'handleGroup'
    this.scene.add(this.handleGroup)

    // Add lighting
    this.setupLighting()
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    this.scene.add(directionalLight)
  }

  public updateZoom(delta: number): void {
    const zoomSpeed = 0.001
    this.zoom = Math.max(0.1, Math.min(10, this.zoom * (1 + delta * zoomSpeed)))
    this.updateCameraFrustum()
  }

  public updatePan(deltaX: number, deltaY: number): void {
    const panSpeed = 0.01 / this.zoom
    this.cameraPosition.x -= deltaX * panSpeed
    this.cameraPosition.y += deltaY * panSpeed
    
    this.camera.position.x = this.cameraPosition.x
    this.camera.position.y = this.cameraPosition.y
    this.camera.lookAt(this.cameraPosition.x, this.cameraPosition.y, 0)
  }

  public updateCameraFrustum(): void {
    const canvas = this.renderer.domElement
    const aspect = canvas.clientWidth / canvas.clientHeight
    const frustumSize = this.frustumSize / this.zoom

    this.camera.left = (frustumSize * aspect) / -2
    this.camera.right = (frustumSize * aspect) / 2
    this.camera.top = frustumSize / 2
    this.camera.bottom = frustumSize / -2
    this.camera.updateProjectionMatrix()
  }

  public handleResize(width: number, height: number): void {
    this.renderer.setSize(width, height)
    this.updateCameraFrustum()
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  public clearSVG(): void {
    // Remove all children from SVG group
    while (this.svgGroup.children.length > 0) {
      const child = this.svgGroup.children[0]
      this.svgGroup.remove(child)
      
      // Dispose of geometries and materials
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose()
        if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      }
    }
  }

  public clearPath(): void {
    // Remove all children from path group
    while (this.pathGroup.children.length > 0) {
      const child = this.pathGroup.children[0]
      this.pathGroup.remove(child)
      
      // Dispose of geometries and materials
      if (child instanceof THREE.Line) {
        child.geometry?.dispose()
        if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      }
    }
  }

  public dispose(): void {
    this.clearSVG()
    this.clearPath()
    
    // Clear handle group
    while (this.handleGroup.children.length > 0) {
      const child = this.handleGroup.children[0]
      this.handleGroup.remove(child)
    }
    
    this.renderer.dispose()
  }
}
