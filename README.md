# VitaGloss RD 🦷

Plataforma e-commerce y sistema de gestión de ventas para distribuidores Amway independientes en República Dominicana. Desarrollado con React + Node.js + MongoDB.

---

## 📁 Estructura del proyecto

```
vitaglossrd/
├── frontend/    # Frontend — React + Vite + Tailwind CSS
└── backend/     # Backend  — Node.js + Express + MongoDB
```

---

## 🚀 Inicio rápido

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # Configura MONGODB_URI y JWT_SECRET
npm run seed           # Crea el usuario admin inicial
npm run dev            # Servidor en http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # App en http://localhost:5174
```

---

## 🔑 Credenciales iniciales (después del seed)

| Campo    | Valor                  |
|----------|------------------------|
| Email    | admin@vitagloss.com    |
| Password | admin123456            |

> Cambia la contraseña desde el Dashboard → Perfil tras el primer inicio de sesión.

---

## 🛠️ Stack tecnológico

| Capa      | Tecnologías                                              |
|-----------|----------------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS 3, Framer Motion, React Router v7 |
| Backend   | Node.js, Express 4, Mongoose 8, JWT, bcryptjs            |
| Base de datos | MongoDB Atlas                                        |
| Auth      | JWT almacenado en localStorage, Bearer token             |
