# Math4Life - Objetivos del Proyecto
*Aplicación web de matemáticas interactiva 100% gratuita y open source*
**Repositorio:** https://github.com/agntsupport/math4life

## 🎯 Visión General
Desarrollar una aplicación web educativa de matemáticas completamente gratuita, accesible desde cualquier navegador, que democratice el acceso a herramientas de aprendizaje interactivo mediante una arquitectura moderna basada en contenedores.

## 🌐 Deployment y Arquitectura

### Infraestructura
- **Hosting:** VPS con Easypanel
- **Containerización:** Docker con docker-compose
- **Acceso:** 100% Web (responsive para móvil/tablet/desktop)
- **URL:** Subdominio dedicado (ej: math.tudominio.com)

### Stack Tecnológico Web

#### Frontend (Contenedor 1)
- **Framework:** React 18+ con TypeScript
- **UI Components:** Material-UI o Ant Design
- **Interacción Matemática:** 
  - Canvas API para renderizado de ecuaciones
  - KaTeX para display de LaTeX
  - Interactivity.js para gestos y drag & drop
- **State Management:** Zustand o Redux Toolkit
- **Build:** Vite para desarrollo rápido
- **PWA:** Capacidades offline con Service Workers

#### Backend (Contenedor 2)
- **API:** Node.js con Express/Fastify
- **Motor Matemático:** 
  - Math.js para cálculos
  - Algebra.js para manipulación simbólica
  - API propia para validación de pasos
- **WebSockets:** Socket.io para interacciones en tiempo real
- **Autenticación:** JWT con refresh tokens (opcional)

#### Base de Datos (Contenedor 3)
- **Principal:** PostgreSQL 15+
- **Cache:** Redis para sesiones y resultados frecuentes
- **Almacenamiento:** Volúmenes Docker persistentes

#### Nginx (Contenedor 4)
- **Reverse Proxy:** Gestión de rutas
- **SSL:** Let's Encrypt via Easypanel
- **Compresión:** Gzip/Brotli
- **Cache estático:** Para assets

## 📱 Objetivos Principales - Versión Web

### 1. Sistema de Interacción Web Avanzado
- **Objetivo:** Implementar manipulación de expresiones matemáticas optimizada para navegador
- **Funcionalidades Web:**
  - Drag & drop con mouse y touch events
  - Atajos de teclado para operaciones rápidas
  - Zoom con rueda del mouse/pinch en móvil
  - Copy/paste de expresiones matemáticas
  - Historial de acciones con undo/redo
- **Tecnologías:** 
  - React DnD para desktop
  - React Touch para móvil
  - Canvas API para renderizado eficiente

### 2. Motor de Álgebra Computacional (Cliente-Servidor)
- **Objetivo:** Procesamiento híbrido para mejor rendimiento
- **Arquitectura:**
  - Validaciones simples en cliente (JavaScript)
  - Cálculos complejos en servidor (Node.js)
  - Cache de resultados frecuentes (Redis)
  - WebWorkers para cálculos pesados sin bloquear UI
- **API REST:**
  - POST /api/validate - Validar paso algebraico
  - POST /api/simplify - Simplificar expresión
  - POST /api/solve - Resolver ecuación
  - GET /api/hint - Obtener pista contextual

### 3. Sistema de Asistencia con IA (Opcional)
- **Objetivo:** Asistente inteligente usando modelos open source
- **Implementación:**
  - Ollama en contenedor separado (opcional)
  - Modelos: Llama 3 para explicaciones
  - API de hints contextuales
  - Fallback a reglas predefinidas sin IA

### 4. Contenido Matemático Web-First

#### Interfaz de Módulos
```
/dashboard - Panel principal con progreso
/module/arithmetic - Módulo de aritmética
/module/algebra - Módulo de álgebra
/module/calculus - Módulo de cálculo
/playground - Área libre de práctica
/challenges - Desafíos diarios
```

#### Características Web Específicas
- **Editor de Ecuaciones:** 
  - Input LaTeX con preview en tiempo real
  - Paleta de símbolos matemáticos
  - Plantillas de ecuaciones comunes
  
- **Visualizaciones Interactivas:**
  - Gráficas 2D/3D con Plotly.js
  - Animaciones con Framer Motion
  - Geometría dinámica con GeoGebra API

### 5. Sistema de Persistencia y Progreso
- **Objetivo:** Guardar progreso sin cuenta obligatoria
- **Implementación:**
  - LocalStorage para usuarios anónimos
  - Cuenta opcional para sincronización
  - Export/import de progreso en JSON
  - Backup automático cada 5 minutos

### 6. PWA y Capacidades Offline
- **Objetivo:** Funcionamiento sin conexión constante
- **Características:**
  - Service Worker con estrategia cache-first
  - IndexedDB para almacenamiento local
  - Sincronización cuando vuelve la conexión
  - Instalable como app en móvil/desktop

## 🐳 Configuración Docker

### docker-compose.yml Estructura
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - VITE_API_URL=http://backend:4000
    
  backend:
    build: ./backend
    ports: ["4000:4000"]
    depends_on: [postgres, redis]
    
  postgres:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    
  redis:
    image: redis:7-alpine
    
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    depends_on: [frontend, backend]
```

### Easypanel Configuration
- **Auto-deploy:** Desde GitHub con webhooks (repo: agntsupport/math4life)
- **SSL:** Automático con Let's Encrypt
- **Monitoring:** Métricas integradas de Easypanel
- **Backups:** Snapshots diarios de volúmenes
- **Escalado:** Horizontal para backend si necesario

## 📊 Optimizaciones Web

### Performance
- **Code Splitting:** Lazy loading de módulos
- **Bundle Size:** < 200KB inicial
- **Time to Interactive:** < 3 segundos
- **Lighthouse Score:** > 95 en todas las métricas

### SEO y Accesibilidad
- **Meta tags:** Para compartir en redes
- **Sitemap:** Generado automáticamente
- **ARIA labels:** Completos para screen readers
- **Keyboard navigation:** 100% navegable

### Seguridad
- **CORS:** Configuración estricta
- **Rate limiting:** En API endpoints
- **CSP Headers:** Content Security Policy
- **Input sanitization:** XSS prevention
- **HTTPS only:** Forzado en producción

## 🚀 Fases de Desarrollo - Web

### Fase 1: MVP Web (6 semanas)
- Setup Docker + Easypanel
- Frontend React básico
- API REST funcional
- Motor matemático: ecuaciones lineales
- Módulo aritmética interactivo

### Fase 2: Core Features (8 semanas)
- Sistema de drag & drop completo
- Todos los módulos básicos
- Visualizaciones con Canvas
- PWA con offline básico
- Sistema de progreso local

### Fase 3: Avanzado (8 semanas)
- Módulos de cálculo
- WebSockets para tiempo real
- Optimizaciones de rendimiento
- Sistema de hints inteligente
- Exportación de ejercicios a PDF

### Fase 4: Polish (4 semanas)
- Testing E2E con Cypress
- Optimización de bundle
- Documentación de API
- Analytics con Matomo
- A/B testing de features

## 🔧 Desarrollo Local

### Requisitos
- Docker Desktop
- Node.js 18+
- Git

### Setup Inicial
```bash
git clone https://github.com/agntsupport/math4life
cd math4life
docker-compose up -d
npm run dev
```

### Estructura de Proyecto
```
math4life/
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── docker-compose.prod.yml
└── easypanel.json
```

## 📈 Métricas Web Específicas
- Page Load Time < 2s
- API Response Time < 100ms
- Concurrent Users: 1000+
- Uptime: 99.9%
- Error Rate < 0.1%

## 🎯 Objetivos Inmediatos
1. Configurar VPS con Easypanel
2. Crear estructura base de contenedores
3. Implementar frontend React con routing
4. API REST básica con Express
5. Motor matemático para aritmética
6. Deploy inicial en subdominio

---

*Este documento está optimizado para deployment web con Docker y Easypanel. Actualizado para arquitectura 100% web.*