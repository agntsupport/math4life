# Math4Life 🧮

*Plataforma web interactiva de aprendizaje matemático 100% gratuita y open source*

[![Deploy Status](https://img.shields.io/badge/Deploy-Live-success)](https://math4life-math4life-frontend.1nse3e.easypanel.host)
[![API Status](https://img.shields.io/badge/API-Online-success)](https://math4life-math4life-backend.1nse3e.easypanel.host/api/health)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://docker.com/)

## 🌐 Demo en Vivo

**🎨 Aplicación Frontend:**  
[https://math4life-math4life-frontend.1nse3e.easypanel.host](https://math4life-math4life-frontend.1nse3e.easypanel.host)

**🔧 API Backend:**  
[https://math4life-math4life-backend.1nse3e.easypanel.host/api](https://math4life-math4life-backend.1nse3e.easypanel.host/api)

## 🚀 Características Principales

### ✅ FASE 1 COMPLETADA (Septiembre 2025)
- ✅ **Infraestructura Completa** - K-8 curriculum foundation implementado
- ✅ **Base de Datos PostgreSQL** - Schema completo para Common Core K-8 desplegado
- ✅ **Backend Node.js/TypeScript** - API REST completa con endpoints matemáticos
- ✅ **Frontend React/TypeScript** - SPA con navegación K-8 desplegada
- ✅ **Deploy en Producción** - Easypanel con auto-deploy desde GitHub
- ✅ **URLs Públicas Funcionando** - Frontend y backend accesibles 24/7
- ✅ **Sin Errores de Compilación** - TypeScript build exitoso en todos los servicios
- ✅ **CI/CD Pipeline** - Integración completa con GitHub webhooks

### 🚀 LISTO PARA FASE 2
- 🎯 **K-8 Content Development** - Curriculum foundation lista para contenido
- 🎯 **Interactive Modules** - Framework preparado para módulos educativos
- 🎯 **Assessment System** - Estructura base para evaluaciones y progreso
- 🎯 **Standards Alignment** - Common Core mapping implementado

## 📋 Requisitos del Sistema

### Para Desarrollo
- **Node.js 18+** (recomendado 20+)
- **Docker & Docker Compose** 
- **Git**
- **4GB RAM mínimo** para desarrollo local

### Para Producción
- **VPS con 2GB RAM mínimo**
- **Docker Engine 20+**
- **Dominio con DNS configurado**
- **SSL/TLS** (automático con Easypanel)

## 🛠️ Instalación y Setup

### 🚀 Inicio Rápido (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/agntsupport/math4life
cd math4life

# Ejecutar script de desarrollo automático
./dev.sh
```

Este script automáticamente:
- ✅ Verifica dependencias (Node.js 18+)
- ✅ Crea archivo `.env` desde plantilla
- ✅ Instala dependencias del frontend y backend
- ✅ Inicia PostgreSQL y Redis con Docker
- ✅ Abre frontend y backend en terminales separadas

### 🐳 Con Docker Completo

```bash
# Clonar y configurar
git clone https://github.com/agntsupport/math4life
cd math4life
cp .env.example .env

# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

### ⚙️ Desarrollo Manual

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev

# Base de datos (nueva terminal)
docker-compose up -d postgres redis
```

## 📁 Estructura del Proyecto

```
math4life/
├── 📁 frontend/                    # React + TypeScript + Vite
│   ├── 📁 src/
│   │   ├── 📁 components/          # Componentes reutilizables
│   │   │   ├── DraggableExpression.tsx    # Drag & drop para álgebra
│   │   │   ├── MathCanvas.tsx             # Canvas matemático
│   │   │   └── Layout.tsx                 # Layout principal
│   │   ├── 📁 pages/               # Páginas de la aplicación
│   │   │   ├── HomePage.tsx               # Landing page
│   │   │   ├── Playground.tsx             # Área de experimentación
│   │   │   └── 📁 modules/               # Módulos educativos
│   │   │       ├── ArithmeticModule.tsx  # Módulo de aritmética
│   │   │       └── AlgebraModule.tsx     # Módulo de álgebra
│   │   ├── 📁 styles/              # Estilos y tema
│   │   │   └── theme.ts                  # Configuración Material-UI
│   │   ├── App.tsx                 # Componente raíz
│   │   └── main.tsx                # Entry point
│   ├── package.json               # Dependencias y scripts
│   └── Dockerfile                 # Contenedor frontend
├── 📁 backend/                     # Node.js + Express + TypeScript
│   ├── 📁 src/
│   │   ├── 📁 controllers/         # Controladores de rutas
│   │   │   └── math.controller.ts         # Operaciones matemáticas
│   │   ├── 📁 routes/              # Definición de rutas
│   │   │   ├── math.routes.ts            # Rutas de matemáticas
│   │   │   └── health.routes.ts          # Health checks
│   │   ├── 📁 services/            # Lógica de negocio
│   │   │   └── math.service.ts           # Motor matemático
│   │   ├── 📁 middlewares/         # Middlewares Express
│   │   │   └── validation.ts             # Validación de datos
│   │   ├── 📁 utils/               # Utilidades
│   │   │   └── logger.ts                 # Sistema de logs
│   │   └── index.ts                # Entry point
│   ├── package.json               # Dependencias y scripts
│   └── Dockerfile                 # Contenedor backend
├── 📁 nginx/                       # Reverse proxy
│   └── nginx.conf                 # Configuración nginx
├── 📁 services/                    # Servicios adicionales
├── 📄 docker-compose.yml          # Desarrollo local
├── 📄 docker-compose.prod.yml     # Producción
├── 📄 easypanel.json              # Deploy automático
├── 📄 .env.example                # Variables de entorno
├── 📄 dev.sh                      # Script de desarrollo
├── 📄 OBJETIVOS_AGENTMATH.md       # Objetivos del proyecto
├── 📄 ROADMAP.md                  # Plan de desarrollo
└── 📄 README.md                   # Este archivo
```

## ⚙️ Configuración Detallada

### 🔐 Variables de Entorno

El archivo `.env.example` incluye todas las configuraciones necesarias:

```bash
# Frontend
VITE_API_URL=http://localhost:4000/api     # URL de la API
VITE_SOCKET_URL=http://localhost:4000      # WebSocket URL

# Backend
NODE_ENV=development                       # Entorno (development/production)
PORT=4000                                  # Puerto del servidor
FRONTEND_URL=http://localhost:3000         # URL del frontend

# Base de Datos PostgreSQL
DB_HOST=postgres                           # Host de BD
DB_PORT=5432                              # Puerto de BD
DB_USER=math4life                         # Usuario de BD
DB_PASSWORD=math4life_dev                 # Contraseña de BD
DB_NAME=math4life                         # Nombre de BD

# Cache Redis
REDIS_HOST=redis                          # Host de Redis
REDIS_PORT=6379                           # Puerto de Redis

# Seguridad
JWT_SECRET=your_jwt_secret_here           # Secret para JWT (cambiar en producción)
SESSION_SECRET=your_session_secret        # Secret para sesiones

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000               # Ventana de tiempo (15 min)
RATE_LIMIT_MAX_REQUESTS=100               # Máximo de requests
```

### 🔧 Scripts Disponibles

```bash
# Desarrollo
./dev.sh                    # Inicio automático de desarrollo
npm run dev                 # Desarrollo manual (frontend/backend)
npm run build              # Build para producción
npm run typecheck          # Verificación de tipos TypeScript
npm run lint               # Linting de código

# Docker
docker-compose up -d        # Servicios en background
docker-compose logs -f      # Ver logs en tiempo real
docker-compose down         # Detener servicios
docker-compose build        # Reconstruir imágenes

# Producción
./start.sh                  # Iniciar en producción
./stop.sh                   # Detener servicios
```

## 📚 Módulos Educativos Implementados

### 📚 K-8 CURRICULUM FOUNDATION (COMPLETADO)

**✅ Kindergarten - Grade 2:**
- ✅ **Counting & Cardinality**: Framework implementado
- ✅ **Basic Operations**: Suma/resta foundation preparada
- ✅ **Shapes & Measurement**: Estructura base lista
- ✅ **Number Sense**: Progresión K-2 mapeada

**✅ Grades 3-5 Elementary:**
- ✅ **Multiplication & Division**: Framework completo
- ✅ **Fractions**: Common Core alignment implementado
- ✅ **Measurement & Data**: Estructura preparada
- ✅ **Geometry Basics**: Foundation establecida

**✅ Grades 6-8 Middle School:**
- ✅ **Ratios & Proportions**: Framework avanzado
- ✅ **Algebra Foundations**: Sistema de ecuaciones base
- ✅ **Advanced Geometry**: Herramientas preparadas
- ✅ **Statistics & Probability**: Estructura implementada

**🎯 PRÓXIMO PASO: Desarrollo de contenido interactivo por grado**

### 🎮 Playground Interactivo
- ✅ **Editor de Expresiones**: Input con LaTeX y preview
- ✅ **Evaluador Matemático**: Cálculos en tiempo real
- ✅ **Simplificador Algebraico**: Reducción automática
- ✅ **Historial de Operaciones**: Undo/redo ilimitado
- ✅ **Exportación**: Guardar trabajo en JSON/PDF

### 📊 Características Avanzadas
- ✅ **Visualizaciones**: Gráficas 2D con Plotly.js
- ✅ **Animaciones**: Transiciones fluidas con Framer Motion
- ✅ **Renderizado LaTeX**: Ecuaciones hermosas con KaTeX
- ✅ **Progreso Personalizado**: Tracking adaptativo de habilidades

## 🐳 Comandos Docker Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f frontend

# Detener todos los servicios
docker-compose down

# Reconstruir imágenes
docker-compose build

# Limpiar volúmenes (CUIDADO: borra datos)
docker-compose down -v
```

## 🚀 Deployment en Producción

### ✅ PRODUCCIÓN ESTABLE - FASE 1 COMPLETADA (Septiembre 2025)

**🌐 URLs de Producción Activas:**
- **🎨 Frontend Application:** https://math4life-math4life-frontend.1nse3e.easypanel.host
- **🔧 Backend API:** https://math4life-math4life-backend.1nse3e.easypanel.host
- **💚 Health Check:** https://math4life-math4life-backend.1nse3e.easypanel.host/api/health

### 🏗️ Arquitectura de Producción en Easypanel

**✅ Todos los Servicios FUNCIONANDO:**

1. **✅ Frontend React/TypeScript**
   - Puerto: 80 ✅ 
   - Build: Production ✅
   - K-8 Navigation: Implementado ✅
   - Estado: RUNNING 🟢

2. **✅ Backend Node.js/Express**  
   - Puerto: 80 ✅
   - API Endpoints: Funcionales ✅
   - Math Engine: Operativo ✅
   - Estado: RUNNING 🟢

3. **✅ PostgreSQL Database**
   - Common Core K-8 Schema: Completo ✅
   - Conexiones: Estables ✅
   - Estado: RUNNING 🟢

4. **✅ Redis Cache**
   - Performance: Optimizado ✅
   - Estado: RUNNING 🟢

**🚀 RESULTADO: Aplicación totalmente funcional y accesible públicamente**

### 🔧 Configuración Easypanel

```json
{
  "type": "app",
  "source": {
    "type": "github",
    "owner": "agntsupport",
    "repo": "math4life",
    "ref": "main"
  },
  "build": {
    "type": "dockerfile"
  },
  "deploy": {
    "replicas": 1,
    "zeroDowntime": true
  }
}
```

### 🐳 Deploy Manual con Docker

```bash
# En tu servidor VPS
git clone https://github.com/agntsupport/math4life
cd math4life

# Configurar producción
cp .env.example .env.production
# Editar variables de producción

# Deploy con docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Verificar servicios
docker-compose -f docker-compose.prod.yml ps
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 🔌 API REST Documentación

### 🧮 Operaciones Matemáticas

```typescript
// Validar expresión matemática
POST /api/math/validate
Body: { expression: string, context?: string }
Response: { valid: boolean, errors?: string[] }

// Simplificar expresión
POST /api/math/simplify  
Body: { expression: string, steps?: boolean }
Response: { simplified: string, steps?: Step[] }

// Resolver ecuación
POST /api/math/solve
Body: { equation: string, variable?: string }
Response: { solutions: number[], steps: Step[] }

// Obtener pista contextual
POST /api/math/hint
Body: { expression: string, step: number }
Response: { hint: string, type: 'warning' | 'suggestion' | 'tip' }

// Evaluar paso algebraico
POST /api/math/evaluate-step
Body: { from: string, to: string, operation: string }
Response: { valid: boolean, feedback: string }
```

### 🏥 Health Check y Monitoreo

```typescript
// Estado completo del servidor
GET /api/health
Response: {
  status: 'healthy' | 'degraded' | 'unhealthy',
  timestamp: string,
  uptime: number,
  services: {
    database: 'connected' | 'disconnected',
    redis: 'connected' | 'disconnected',
    math_engine: 'operational' | 'error'
  },
  performance: {
    response_time: number,
    memory_usage: number,
    cpu_usage: number
  }
}

// Ping simple
GET /api/health/ping
Response: { message: 'pong', timestamp: string }
```

### 🛡️ Rate Limiting

- **Límite**: 100 requests por 15 minutos por IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
- **Error 429**: Si se excede el límite

### 🔐 Autenticación (Opcional)

```typescript
// Todas las rutas de math son públicas
// Autenticación solo para features premium futuras
Headers: {
  'Authorization': 'Bearer <jwt_token>',  // Opcional
  'Content-Type': 'application/json'
}
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Math.js para el motor matemático
- KaTeX para renderizado de LaTeX
- Material-UI para componentes UI
- React DnD para drag & drop

## 🤝 Contribuir al Proyecto

¡Las contribuciones son bienvenidas! Este es un proyecto 100% open source.

### 🔧 Setup para Contribuir

```bash
# Fork del repositorio
git clone https://github.com/TU_USUARIO/math4life
cd math4life

# Crear rama de feature
git checkout -b feature/nombre-feature

# Desarrollo
./dev.sh

# Testing
npm test                    # Frontend
cd backend && npm test      # Backend

# Lint y typecheck
npm run lint
npm run typecheck

# Commit y push
git commit -m "feat: descripción del cambio"
git push origin feature/nombre-feature
```

### 📋 Guías de Contribución

- **Código**: Seguir estándares TypeScript y ESLint
- **Commits**: Usar [Conventional Commits](https://conventionalcommits.org/)
- **Testing**: Incluir tests para nueva funcionalidad
- **Documentación**: Actualizar docs si es necesario
- **UI/UX**: Mantener consistencia con Material-UI

### 🐛 Reportar Bugs

Usa [GitHub Issues](https://github.com/agntsupport/math4life/issues) con:
- Descripción detallada del problema
- Pasos para reproducir
- Screenshots/videos si aplica
- Información del entorno (browser, OS)

## 📞 Soporte y Contacto

### 🔧 Soporte Técnico
- **GitHub Issues**: [Reportar bugs y solicitar features](https://github.com/agntsupport/math4life/issues)
- **Discussions**: [Preguntas y discusiones](https://github.com/agntsupport/math4life/discussions)
- **Wiki**: [Documentación detallada](https://github.com/agntsupport/math4life/wiki)

### 👨‍💻 Contacto Directo
- **Email**: alfredo@agnt.support
- **WhatsApp**: +52 4433104749
- **Website**: [agnt.support](https://agnt.support)

### 🌐 Enlaces Útiles
- **🎨 Frontend Live**: [https://math4life-math4life-frontend.1nse3e.easypanel.host](https://math4life-math4life-frontend.1nse3e.easypanel.host)
- **🔧 Backend API**: [https://math4life-math4life-backend.1nse3e.easypanel.host](https://math4life-math4life-backend.1nse3e.easypanel.host)
- **📁 Repositorio**: [github.com/agntsupport/math4life](https://github.com/agntsupport/math4life)
- **🗺️ Roadmap**: [Ver ROADMAP.md](ROADMAP.md)
- **🎯 Objetivos**: [Ver OBJETIVOS_AGENTMATH.md](OBJETIVOS_AGENTMATH.md)

---

Hecho con ❤️ para democratizar la educación matemática