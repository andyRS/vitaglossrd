# VitaGloss RD — Backend API 🔧

API REST para el sistema de gestión de ventas de VitaGloss RD. Autenticación JWT, gestión de leads, registro de ventas y estadísticas del dashboard.

## Stack

- **Node.js** + **Express 4**
- **MongoDB Atlas** + **Mongoose 8**
- **JWT** + **bcryptjs** — autenticación segura
- **express-rate-limit** — protección contra abuso

## Instalación

```bash
npm install
cp .env.example .env   # Completa las variables
npm run seed           # Crea el admin inicial
npm run dev            # Servidor en http://localhost:4000
```

## Variables de entorno (`.env`)

```env
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/vitagloss
JWT_SECRET=clave_secreta_muy_larga
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5174
```

## Endpoints principales

| Método | Ruta                  | Descripción                        |
|--------|-----------------------|------------------------------------|
| POST   | /api/auth/login       | Iniciar sesión                     |
| POST   | /api/auth/register    | Registrar usuario (requiere admin) |
| GET    | /api/auth/me          | Usuario actual                     |
| GET    | /api/members          | Miembros públicos del equipo       |
| GET    | /api/leads            | Leads del vendedor (protegido)     |
| POST   | /api/leads            | Crear lead                         |
| GET    | /api/sales            | Ventas del vendedor (protegido)    |
| POST   | /api/sales            | Registrar venta                    |
| GET    | /api/dashboard        | Estadísticas y KPIs                |

## Estructura

```
vitagloss-rd-api/
├── models/       # User, Lead, Sale (Mongoose)
├── routes/       # auth, members, leads, sales, dashboard
├── middleware/   # auth.js (JWT verify)
├── scripts/      # seed.js (admin inicial)
└── server.js     # Entry point
```
