# MusicUPC — Frontend

Aplicación web (SPA) para **MusicUPC**, sistema de reserva de artistas folklóricos
peruanos. Desarrollada en **Angular 20** (componentes standalone) con **Angular Material**
y un tema oscuro personalizado.

## Requisitos

- Node.js 20+ (probado con v24)
- El backend de MusicUPC corriendo en `http://localhost:8080`

## Puesta en marcha

```bash
npm install      # solo la primera vez
npm start        # arranca en http://localhost:4200
```

## Estructura

```
src/app/
  core/
    api.config.ts          # URL base del backend (API_URL)
    auth/                   # servicio de sesión (JWT), interceptor y guards por rol
    models/index.ts         # interfaces de los DTOs
    services/               # un servicio HTTP por entidad
  shared/                   # tabla CRUD reutilizable y diálogos (formulario/confirmación)
  features/
    login/                  # inicio de sesión
    admin/                  # panel de administrador (sidebar + tablas CRUD + dashboard)
    usuario/                # vista de usuario (reservas y perfil)
  app.routes.ts             # rutas con carga diferida (lazy loading)
  app.config.ts             # proveedores (router, HttpClient, animaciones)
```

## Autenticación

- El login (`POST /login`) devuelve un token JWT que se guarda en `localStorage`.
- El token se decodifica en el cliente para leer el **rol** (`ADMINISTRADOR` / `USUARIO`)
  y redirigir al panel correspondiente.
- Un interceptor añade la cabecera `Authorization: Bearer <token>` a cada petición.

## Diseño

- Paleta: fondo `#0f0f14`, dorado `#e8a045`, rojo andino `#c0392b`.
- Tipografías: *Playfair Display* (títulos) e *Inter* (cuerpo).

## Compilar para producción

```bash
ng build
```

Los archivos resultantes quedan en `dist/`.
