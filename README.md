# 🏦 Sistema de Caja — UNAPEC

Proyecto Final · Open Source 2 · Prof. Juan P. Valdez · 2020

## 📁 Estructura del Proyecto

```
Sistema-Cajero-Unapec/
├── backend/
│   ├── controllers/       # Lógica de negocio
│   ├── models/            # Conexión a la BD
│   ├── routes/            # Endpoints de la API
│   ├── db/
│   │   └── database.sql   # Script de base de datos
│   ├── app.js             # Servidor principal
│   └── package.json
├── frontend/
│   ├── css/styles.css     # Estilos
│   ├── js/app.js          # Lógica del frontend
│   └── index.html         # Página principal
└── README.md
```

## 🛠️ Tecnologías

- **Backend:** Node.js + Express
- **Base de Datos:** MySQL
- **Frontend:** HTML + CSS + JavaScript
- **Patrón:** MVC

## 🚀 Cómo correr el proyecto

### 1. Base de Datos
```sql
-- Importar el script en MySQL
source backend/db/database.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de MySQL
npm install
npm start
```

### 3. Acceder
Abrir en el navegador: `http://localhost:3000`

## ✅ Funcionalidades
- Dashboard con estadísticas
- Gestión de Clientes
- Gestión de Empleados
- Catálogos: Servicios, Formas de Pago, Tipos de Documentos, Modalidades
- Registro de Movimientos en Caja
- Consultas y filtros por cliente, fecha, servicio y forma de pago
