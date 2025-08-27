# SVG Studio

A pure SVG animation tool built with React, Three.js, and GSAP. Import existing SVG files and bring them to life with animations and effects.

## 🎯 Project Vision

SVG Studio is focused on **animation, not editing**. Users import their existing SVG artwork and add motion, effects, and timing to create engaging animated content. Think "After Effects for SVGs" - no drawing tools, just pure animation power.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

The development server runs on `http://localhost:3000` with hot module replacement.

## 🏗️ Current Status

**Project Phase**: Ready to Start Phase 0 - Demo MVP  
**Current Work**: Building working demo with core path animation functionality  
**Next Milestone**: Complete demo showing SVG import, resize, path drawing, and animation

See [docs/ROADMAP.md](docs/ROADMAP.md) for detailed progress and [docs/CURRENT_SPRINT.md](docs/CURRENT_SPRINT.md) for active work.

## 📁 Documentation

### Project Planning & Progress
- **[ROADMAP](docs/ROADMAP.md)** - High-level phases and timeline
- **[CURRENT SPRINT](docs/CURRENT_SPRINT.md)** - Active work and immediate tasks
- **[COMPLETED WORK](docs/COMPLETED.md)** - Archive of finished work

### Development Resources
- **[PHASE DETAILS](docs/phases/)** - Detailed phase specifications
  - [Phase 0: Demo MVP](docs/phases/PHASE_0_DEMO_MVP.md)
  - [Phase 1: SVG Import & Display](docs/phases/PHASE_1_SVG_IMPORT.md)
  - [Phase 2: Animation Targeting](docs/phases/PHASE_2_ANIMATION_TARGETING.md)
  - [Phase 3: Effects Library](docs/phases/PHASE_3_EFFECTS_LIBRARY.md)
  - [Phase 4: Timeline & Controls](docs/phases/PHASE_4_TIMELINE_CONTROLS.md)
- **[TECHNICAL NOTES](docs/TECHNICAL_NOTES.md)** - Implementation decisions and patterns

### Future Planning
- **[BACKLOG](docs/BACKLOG.md)** - Future ideas and research topics
- **[GUIDELINES](docs/GUIDELINES.md)** - Documentation workflow and standards

## 🛠️ Tech Stack

- **React 19.1** - UI framework with modern features
- **Three.js 0.179.1** - Native 3D graphics (no abstractions)
- **GSAP 3.13.0** - Animation engine for smooth motion
- **TypeScript 5.9.2** - Type safety and better DX
- **Vite 7.0.6** - Fast build tool and dev server

## 🎮 Planned Features

### Core Functionality
- **SVG Import** - Drag & drop SVG files into workspace
- **Element Selection** - Click to select individual SVG elements
- **Animation Effects** - Fade, slide, scale, rotate, and path animations
- **Timeline Control** - Sequence and time animations precisely

### Animation Types
- **Entrance Effects** - Fade in, slide in, draw on, pop in
- **Motion Effects** - Objects following SVG paths
- **Transform Effects** - Scale, rotate, position animations
- **Sequencing** - Chain animations with precise timing

## 🏗️ Project Structure

```
├── docs/                # Comprehensive project documentation
│   ├── phases/         # Detailed phase specifications
│   └── *.md           # Core documentation files
├── public/            # Static assets
├── src/
│   ├── App.tsx        # Main application component
│   ├── App.css        # Application styles
│   ├── main.tsx       # Application entry point
│   └── index.css      # Global styles
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## 🎯 Development Phases

0. **Phase 0**: Demo MVP (Week 0) - NEW
1. **Phase 1**: SVG Import & Display (Week 1)
2. **Phase 2**: Animation Targeting (Week 2)
3. **Phase 3**: Effects Library (Week 3)
4. **Phase 4**: Timeline & Controls (Week 4)

## 🤝 Contributing

1. Read [docs/GUIDELINES.md](docs/GUIDELINES.md) for documentation standards
2. Check [docs/CURRENT_SPRINT.md](docs/CURRENT_SPRINT.md) for active work
3. Review [docs/ROADMAP.md](docs/ROADMAP.md) for project direction
4. Follow the established phase-based development workflow

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

Mokshesh Dafariya <mokshesh@outlook.com>
