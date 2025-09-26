# Math4Life 🧮

Plataforma web interactiva de aprendizaje matemático 100% gratuita y open source.

## 🚀 Características

- ✅ **100% Gratuito** - Sin pagos, sin anuncios, sin limitaciones
- 🎯 **Aprendizaje Interactivo** - Manipula expresiones matemáticas con drag & drop
- 📱 **Responsive** - Funciona en móvil, tablet y desktop
- 🔌 **Offline First** - PWA con capacidades offline
- 🐳 **Dockerizado** - Deploy fácil con contenedores
- 🔧 **API REST** - Backend modular y escalable

## 📋 Requisitos

- Docker & Docker Compose
- Node.js 18+ (para desarrollo local sin Docker)
- Git

## 🛠️ Instalación Rápida

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/agntsupport/math4life
cd math4life

# Copiar variables de entorno
cp .env.example .env

# Iniciar todos los servicios
docker-compose up -d

# La app estará disponible en:
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
# Nginx Proxy: http://localhost:80
```

### Opción 2: Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/agntsupport/math4life
cd math4life

# Instalar dependencias del frontend
cd frontend
npm install
npm run dev

# En otra terminal, instalar dependencias del backend
cd ../backend
npm install
npm run dev
```

## 📁 Estructura del Proyecto

```
math4life/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── services/     # Servicios y API calls
│   │   └── styles/       # Estilos globales
│   └── Dockerfile
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/  # Controladores de rutas
│   │   ├── routes/       # Definición de rutas
│   │   ├── services/     # Lógica de negocio
│   │   └── middlewares/  # Middlewares Express
│   └── Dockerfile
├── nginx/             # Configuración del proxy
├── docker-compose.yml # Orquestación de contenedores
└── README.md
```

## 🔧 Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y ajusta los valores según tu entorno:

```bash
cp .env.example .env
```

Principales variables:
- `VITE_API_URL`: URL del backend API
- `DB_PASSWORD`: Contraseña de PostgreSQL (cambiar en producción)
- `JWT_SECRET`: Secret para tokens JWT (cambiar en producción)

## 📚 Módulos Disponibles

### Aritmética
- Operaciones básicas
- Orden de operaciones (PEMDAS)
- Fracciones
- Números negativos

### Álgebra
- Variables y expresiones
- Ecuaciones lineales
- Sistemas de ecuaciones
- Factorización

### Playground
- Experimentación libre
- Evaluador de expresiones
- Simplificador algebraico
- Historial de operaciones

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

## 🚀 Deployment con Easypanel

1. Crea una nueva app en Easypanel
2. Conecta tu repositorio GitHub
3. Configura las variables de entorno
4. Deploy automático con cada push

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 📝 API Endpoints

### Math Operations
- `POST /api/math/validate` - Validar expresión matemática
- `POST /api/math/simplify` - Simplificar expresión
- `POST /api/math/solve` - Resolver ecuación
- `POST /api/math/hint` - Obtener pista contextual
- `POST /api/math/evaluate-step` - Evaluar paso algebraico

### Health Check
- `GET /api/health` - Estado del servidor
- `GET /api/health/ping` - Simple ping/pong

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

## 📞 Soporte

- GitHub Issues: https://github.com/agntsupport/math4life/issues
- Email: alfredo@agnt.support
- WhatsApp: +52 4433104749

---

Hecho con ❤️ para democratizar la educación matemática