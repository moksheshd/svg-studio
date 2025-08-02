# React Three.js Project

A modern React application with Three.js integration, built with Vite and TypeScript.

## 🚀 Features

- **React 19.1** - Latest React version with modern features
- **Three.js 0.179.1** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server

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

The development server runs on `http://localhost:3000` and includes:

- Hot module replacement
- TypeScript support
- Interactive 3D scene with rotating cubes
- Orbit controls for camera manipulation

## 🏗️ Project Structure

```
├── public/          # Static assets
├── src/
│   ├── App.tsx      # Main application component with Three.js scene
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
- Two rotating orange cubes
- Interactive orbit controls (mouse to rotate, scroll to zoom)
- Hover effects (cubes turn pink on hover)
- Click to scale cubes

## 🛠️ Technologies

- **React 19.1** - UI library
- **Three.js 0.179.1** - 3D graphics
- **@react-three/fiber 9.3.0** - React Three.js integration
- **@react-three/drei 10.6.1** - Three.js helpers
- **TypeScript 5.9.2** - Type safety
- **Vite 7.0.6** - Build tool

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
