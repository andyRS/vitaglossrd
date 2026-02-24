# VitaGloss RD — Frontend 🌐

Aplicación web para distribuidores Amway en República Dominicana. Catálogo de productos, combos, equipo y sistema de login para el dashboard de ventas.

## Stack

- **React 19** + **Vite**
- **Tailwind CSS 3** — estilos utilitarios
- **Framer Motion** — animaciones
- **React Router v7** — navegación

## Instalación

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # Producción → dist/
```

## Variables de entorno

Crea un archivo `.env` en esta carpeta:

```env
VITE_API_URL=http://localhost:4000/api
```

## Estructura

```
src/
├── components/   # Navbar, Footer, LoginModal, ProductoCard, etc.
├── context/      # AuthContext (JWT)
├── data/         # productos.js
├── hooks/        # useSEO
├── pages/        # Home, Catalogo, Combos, Equipo, Dashboard, etc.
└── services/     # api.js (cliente HTTP centralizado)
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
