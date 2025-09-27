# 🚀 Math4Life - Guía de Deployment

*Documentación completa para el deployment en producción*

**📅 Última Actualización:** Septiembre 27, 2025  
**✅ Estado:** FASE 1 COMPLETADA - PRODUCCIÓN ESTABLE Y FUNCIONAL

## 🌐 URLs DE PRODUCCIÓN - FASE 1 COMPLETADA

### ✅ Servicios Públicos FUNCIONANDO 24/7
- **🎨 Frontend K-8 Application:** https://math4life-math4life-frontend.1nse3e.easypanel.host
- **🔧 Backend API Endpoints:** https://math4life-math4life-backend.1nse3e.easypanel.host
- **💚 Health Check (Always UP):** https://math4life-math4life-backend.1nse3e.easypanel.host/api/health

### 🛠️ Panel de Administración
- **Easypanel Dashboard:** http://82.197.94.27:3000
- **Proyecto Math4Life:** http://82.197.94.27:3000/projects/math4life

### 🏆 RESULTADO FASE 1
**✅ TODOS LOS SERVICIOS OPERATIVOS Y ACCESIBLES PÚBLICAMENTE**

---

## 📦 Arquitectura de Servicios

### ✅ FASE 1 COMPLETADA - Servicios K-8 Desplegados

```
┌─────────────────────────────────────────────────────────────────┐
│                   EASYPANEL - FASE 1 COMPLETA                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────────────┐ ✅   ┌──────────────────┐ ✅    │
│ │  K-8 FRONTEND     │       │  K-8 BACKEND      │        │
│ │                  │       │                  │        │
│ │ React/TypeScript │───▶ │ Node.js/Express  │        │
│ │ K-8 Navigation   │       │ Math API Ready   │        │
│ │ Port: 80 ✅      │       │ Port: 80 ✅      │        │
│ └──────────────────┘       └──────────────────┘        │
│          │                         │                     │
│          └──────────┬───────────┘                     │
│                      │                                       │
│ ┌──────────────────┐ │  ┌─────────────────┐ ✅         │
│ │ POSTGRESQL K-8   │ └─│  REDIS CACHE    │              │
│ │ Common Core DB   │    │  Performance    │              │
│ │ K-8 Schema ✅    │    │  Optimization   │              │
│ │ Port: 5432       │    │  Port: 6379     │              │
│ └──────────────────┘    └─────────────────┘              │
│                                                                 │
│               🏆 RESULTADO: K-8 FOUNDATION COMPLETA               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 CONFIGURACIÓN FASE 1 COMPLETADA

### ✅ Frontend Service K-8 (math4life-frontend)
```json
{
  "serviceName": "math4life-frontend",
  "source": {
    "type": "github",
    "owner": "agntsupport",
    "repo": "math4life",
    "ref": "main",
    "path": "/frontend"
  },
  "build": {
    "type": "dockerfile",
    "file": "Dockerfile",
    "target": "production"
  },
  "env": "VITE_API_URL=/api\nNODE_ENV=production",
  "port": 80
}
```

### ✅ Backend Service K-8 (math4life-backend)
```json
{
  "serviceName": "math4life-backend",
  "source": {
    "type": "github",
    "owner": "agntsupport",
    "repo": "math4life",
    "ref": "main",
    "path": "/backend"
  },
  "build": {
    "type": "dockerfile",
    "file": "Dockerfile",
    "target": "production"
  },
  "env": "NODE_ENV=production\nPORT=80\nDB_HOST=math4life-postgres\n...",
  "port": 80
}
```

---

## 📋 Variables de Entorno

### Frontend Variables
```bash
VITE_API_URL=/api              # URL de la API (relativa)
NODE_ENV=production            # Modo de producción
```

### Backend Variables
```bash
NODE_ENV=production
PORT=80                        # IMPORTANTE: Debe ser 80 para Easypanel
DB_HOST=math4life-postgres
DB_PORT=5432
DB_USER=math4life
DB_PASSWORD=MathLife2024SecurePass789!
DB_NAME=math4life
REDIS_HOST=math4life-redis
REDIS_PORT=6379
JWT_SECRET=MathLife2024SuperSecretJWTKey32CharsMin!
SESSION_SECRET=MathLife2024SessionSecretKey32CharsMin!
```

---

## 🐳 Dockerfiles

### Frontend Dockerfile Highlights
```dockerfile
FROM node:18-alpine AS production
# Puerto 80 para Easypanel
EXPOSE 80
# Nginx sirviendo en puerto 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile Highlights
```dockerfile
FROM node:18-alpine AS production
# Puerto 80 para Easypanel
EXPOSE 80
ENV PORT=80
CMD ["node", "dist/index.js"]
```

---

## 🚦 Health Checks

### Frontend Health Check
- **URL:** https://math4life-math4life-frontend.1nse3e.easypanel.host/health
- **Expected:** HTTP 200
- **Response:** `healthy`

### Backend Health Check
- **URL:** https://math4life-math4life-backend.1nse3e.easypanel.host/api/health
- **Expected:** HTTP 200
- **Response:** 
```json
{
  "status": "ok",
  "timestamp": "2025-09-26T22:30:40.120Z",
  "uptime": 113.692339117,
  "environment": "production"
}
```

---

## 📝 Proceso de Deploy

### 1. Commit y Push
```bash
git add .
git commit -m "feat: your changes"
git push origin main
```

### 2. Deploy Automático
- Easypanel detecta cambios en GitHub
- Inicia build automático de servicios modificados
- Zero-downtime deployment habilitado

### 3. Verificación
```bash
# Check frontend
curl https://math4life-math4life-frontend.1nse3e.easypanel.host

# Check backend health
curl https://math4life-math4life-backend.1nse3e.easypanel.host/api/health

# Test API endpoint
curl -X POST https://math4life-math4life-backend.1nse3e.easypanel.host/api/math/validate \
  -H "Content-Type: application/json" \
  -d '{"expression": "2+2"}'
```

---

## 🔨 Troubleshooting - CASOS REALES RESUELTOS

### ✅ ERR_TOO_MANY_REDIRECTS (RESUELTO)
**Problema:** Loops infinitos de redirect en `/api/grade-levels`

**Causa Real:** Database no inicializada → Backend Error 500 → Nginx proxy falla

**Solución Aplicada:**
1. ✅ **Dockerfile corregido**: Copiar `scripts/` y `database/` al container
2. ✅ **Path corregido**: `require('../scripts/init-db')` para estructura Docker
3. ✅ **Nginx proxy**: HTTPS + headers correctos + `proxy_ssl_verify off`
4. ✅ **Cache busting**: Forzar rebuild sin Docker cache

### ✅ Error 429 Too Many Requests (RESUELTO)  
**Problema:** Rate limiting bloqueando peticiones durante testing

**Solución:**
```typescript
// Aumentado de 100 → 1000 para desarrollo
max: 1000 // requests por 15 minutos
```

### ✅ Database Initialization Failed (RESUELTO)
**Problema:** `Cannot find module '../scripts/init-db'`

**Solución Docker:**
```dockerfile
# Agregar en production stage:
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/database ./database
```

### ✅ Frontend Cache Issues (RESUELTO)
**Problema:** Cambios no se reflejan, mismo hash JS

**Solución:**
1. Hard refresh: `Ctrl+F5` / `Cmd+Shift+R`
2. Cambio menor en nginx.conf para romper cache Docker
3. Ventana incógnita para testing

### Service Not Reachable
**Problema:** Error 502 o "Service is not reachable"

**Solución:**
1. Verificar que el servicio esté en puerto 80
2. Revisar variables de entorno (PORT=80)
3. Check health endpoint
4. Rebuild servicio en Easypanel

### Base de Datos No Conecta
**Problema:** Backend no puede conectar con PostgreSQL

**Solución:**
1. Verificar DB_HOST=math4life-postgres
2. Revisar credenciales en variables de entorno
3. Check que PostgreSQL esté running en Easypanel

**📖 Para troubleshooting detallado ver: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

---

## 📊 Monitoreo

### Logs en Easypanel
1. Ir al servicio en Easypanel
2. Click en "Logs"
3. Filtrar por timestamp o error level

### Métricas de Performance
- CPU Usage: Visible en Easypanel dashboard
- Memory: Monitoreo en tiempo real
- Network I/O: Estadísticas de tráfico
- Disk Usage: Espacio en volúmenes

---

## 🔄 Rollback

### Si algo sale mal:
1. En Easypanel, ir al servicio afectado
2. Click en "Deployments"
3. Seleccionar deployment anterior
4. Click "Redeploy"

---

## 🛡️ Seguridad

### SSL/TLS
- ✅ HTTPS habilitado automáticamente
- ✅ Certificados gestionados por Easypanel
- ✅ Renovación automática

### Headers de Seguridad
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block

### Rate Limiting
- ✅ 100 requests per 15 minutes per IP
- ✅ Configurado en backend Express

---

## 📞 Contacto y Soporte

**Para problemas de deployment:**
- GitHub Issues: https://github.com/agntsupport/math4life/issues
- Email: alfredo@agnt.support
- WhatsApp: +52 4433104749

---

*Documento actualizado: Septiembre 26, 2025*