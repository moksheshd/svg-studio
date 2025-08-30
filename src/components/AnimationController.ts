import * as THREE from 'three'
import gsap from 'gsap'
import { PathPoint } from './PathDrawingTool'

export interface AnimationOptions {
  duration?: number
  ease?: string
  repeat?: number
  yoyo?: boolean
  autoRotate?: boolean
}

export class AnimationController {
  private timeline: gsap.core.Timeline | null = null
  private targetGroup: THREE.Group | null = null
  private pathPoints: THREE.Vector2[] = []
  private isPlaying: boolean = false
  private originalPosition: THREE.Vector3 = new THREE.Vector3()
  private originalRotation: THREE.Euler = new THREE.Euler()
  
  constructor() {
    // Initialize GSAP timeline
    this.timeline = null
  }
  
  /**
   * Set the target SVG group to animate
   */
  setTarget(group: THREE.Group): void {
    this.targetGroup = group
    // Store original position and rotation for reset
    this.originalPosition.copy(group.position)
    this.originalRotation.copy(group.rotation)
  }
  
  /**
   * Set the path points for animation
   */
  setPath(points: THREE.Vector2[]): void {
    this.pathPoints = points.map(p => p.clone())
  }
  
  /**
   * Create and configure the animation timeline
   */
  private createTimeline(options: AnimationOptions = {}): void {
    if (!this.targetGroup || this.pathPoints.length < 2) {
      console.warn('Cannot create timeline: missing target or insufficient path points')
      return
    }
    
    // Kill existing timeline if any
    if (this.timeline) {
      this.timeline.kill()
    }
    
    // Default options
    const {
      duration = 5,
      ease = 'power2.inOut',
      repeat = 0,
      yoyo = false,
      autoRotate = false
    } = options
    
    // Create new timeline
    this.timeline = gsap.timeline({
      repeat,
      yoyo,
      onComplete: () => {
        this.isPlaying = false
      }
    })
    
    // Calculate total path length for timing
    let totalLength = 0
    const segments: number[] = []
    
    for (let i = 1; i < this.pathPoints.length; i++) {
      const dist = this.pathPoints[i].distanceTo(this.pathPoints[i - 1])
      segments.push(dist)
      totalLength += dist
    }
    
    // Animate along each segment
    let currentDuration = 0
    
    for (let i = 0; i < this.pathPoints.length; i++) {
      const point = this.pathPoints[i]
      
      // Calculate duration for this segment based on its length
      let segmentDuration = 0
      if (i > 0) {
        segmentDuration = (segments[i - 1] / totalLength) * duration
      }
      
      // Add position animation
      if (i === 0) {
        // Move to first point instantly
        this.timeline.set(this.targetGroup.position, {
          x: point.x,
          y: point.y
        }, 0)
      } else {
        // Animate to next point
        this.timeline.to(this.targetGroup.position, {
          x: point.x,
          y: point.y,
          duration: segmentDuration,
          ease: ease
        }, currentDuration)
        
        currentDuration += segmentDuration
      }
      
      // Calculate rotation to face movement direction (if enabled)
      if (autoRotate && i < this.pathPoints.length - 1) {
        const nextPoint = this.pathPoints[i + 1]
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x)
        
        this.timeline.to(this.targetGroup.rotation, {
          z: angle,
          duration: 0.1,
          ease: 'power1.inOut'
        }, i === 0 ? 0 : currentDuration - segmentDuration)
      }
    }
  }
  
  /**
   * Play the animation
   */
  play(options: AnimationOptions = {}): void {
    if (!this.targetGroup || this.pathPoints.length < 2) {
      console.warn('Cannot play: missing target or insufficient path points')
      return
    }
    
    // Create timeline if it doesn't exist or if options changed
    if (!this.timeline || options) {
      this.createTimeline(options)
    }
    
    if (this.timeline) {
      this.timeline.play()
      this.isPlaying = true
    }
  }
  
  /**
   * Pause the animation
   */
  pause(): void {
    if (this.timeline) {
      this.timeline.pause()
      this.isPlaying = false
    }
  }
  
  /**
   * Resume the animation
   */
  resume(): void {
    if (this.timeline) {
      this.timeline.resume()
      this.isPlaying = true
    }
  }
  
  /**
   * Stop and reset the animation
   */
  stop(): void {
    if (this.timeline) {
      this.timeline.pause(0)
      this.isPlaying = false
    }
    
    // Reset target to original position
    if (this.targetGroup) {
      this.targetGroup.position.copy(this.originalPosition)
      this.targetGroup.rotation.copy(this.originalRotation)
    }
  }
  
  /**
   * Reset to start of animation
   */
  reset(): void {
    if (this.timeline) {
      this.timeline.seek(0)
      this.timeline.pause()
      this.isPlaying = false
    }
    
    // Reset target to first path point if available
    if (this.targetGroup && this.pathPoints.length > 0) {
      this.targetGroup.position.x = this.pathPoints[0].x
      this.targetGroup.position.y = this.pathPoints[0].y
    }
  }
  
  /**
   * Set animation progress (0 to 1)
   */
  setProgress(progress: number): void {
    if (this.timeline) {
      const duration = this.timeline.duration()
      this.timeline.seek(duration * progress)
    }
  }
  
  /**
   * Get current animation progress (0 to 1)
   */
  getProgress(): number {
    if (!this.timeline) return 0
    
    const duration = this.timeline.duration()
    if (duration === 0) return 0
    
    return this.timeline.time() / duration
  }
  
  /**
   * Check if animation is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying
  }
  
  /**
   * Check if animation is ready (has target and path)
   */
  isReady(): boolean {
    return this.targetGroup !== null && this.pathPoints.length >= 2
  }
  
  /**
   * Set animation speed multiplier
   */
  setSpeed(speed: number): void {
    if (this.timeline) {
      this.timeline.timeScale(speed)
    }
  }
  
  /**
   * Clear the animation
   */
  clear(): void {
    if (this.timeline) {
      this.timeline.kill()
      this.timeline = null
    }
    
    this.pathPoints = []
    this.isPlaying = false
    
    // Reset target if exists
    if (this.targetGroup) {
      this.targetGroup.position.copy(this.originalPosition)
      this.targetGroup.rotation.copy(this.originalRotation)
    }
  }
  
  /**
   * Dispose of resources
   */
  dispose(): void {
    this.clear()
    this.targetGroup = null
  }
}
