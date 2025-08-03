# React Three.js Project

A modern React application with native Three.js integration, built with Vite and TypeScript.

## 🚀 Features

- **React 19.1** - Latest React version with modern features
- **Three.js 0.179.1** - Native 3D graphics library integration
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **Native Three.js** - Direct Three.js implementation without abstractions

## 📦 Installation

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

## 🎯 Development

The development server runs on `http://localhost:5173` and includes:

- Hot module replacement
- TypeScript support
- Interactive 3D scene with rotating cubes
- Custom orbit controls implementation
- Mouse interaction with raycasting

## 🏗️ Project Structure

```
├── public/          # Static assets
├── src/
│   ├── App.tsx      # Main application component with native Three.js scene
│   ├── App.css      # Application styles
│   ├── main.tsx     # Application entry point
│   └── index.css    # Global styles
├── index.html       # HTML template
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
├── vite.config.ts   # Vite configuration
└── .gitignore       # Git ignore rules
```

## 🎮 Interactive Demo

The default scene includes:
- Two rotating orange cubes with native Three.js animation loop
- Custom orbit controls (right-click and drag to rotate camera)
- Hover effects with raycasting (cubes turn pink on hover)
- Click interaction to scale cubes
- Proper cleanup and memory management

## 🛠️ Technologies

- **React 19.1** - UI library
- **Three.js 0.179.1** - Native 3D graphics library
- **TypeScript 5.9.2** - Type safety
- **Vite 7.0.6** - Build tool

## 🎨 Three.js Implementation

This project uses native Three.js APIs directly:
- `THREE.Scene` for 3D scene management
- `THREE.WebGLRenderer` for rendering
- `THREE.PerspectiveCamera` for camera controls
- `THREE.Raycaster` for mouse interaction
- Custom animation loop with `requestAnimationFrame`
- Manual event handling for user interactions
- Proper resource disposal and cleanup

## 📝 Git Information

- **Repository**: Initialized with git
- **Author**: Mokshesh Dafariya <mokshesh@outlook.com>
- **License**: MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
