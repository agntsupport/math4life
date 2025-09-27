# 🔧 Troubleshooting Guide - Math4Life

*Guía completa de resolución de problemas basada en casos reales*

## 🚨 Problemas Resueltos en Producción

### 📍 Error: ERR_TOO_MANY_REDIRECTS

**Síntoma:**
```
GET https://math4life-frontend.../api/grade-levels net::ERR_TOO_MANY_REDIRECTS
```

**Diagnóstico:**
1. ✅ **Frontend trata de acceder a `/api/grade-levels`**
2. ❌ **Nginx proxy no configurado correctamente**
3. ❌ **Backend retorna Error 500 → Proxy falla → Loop de redirects**

**Causa Real:**
- Database no inicializada (tabla `grade_levels` no existe)
- Scripts de inicialización no accesibles en container Docker
- Path incorrecto para `require('../scripts/init-db')`

**Solución Paso a Paso:**

#### 1. Verificar Backend Directamente
```bash
curl https://math4life-backend.../api/grade-levels
# Si retorna 500 → Problema en backend, no en proxy
```

#### 2. Revisar Logs del Backend
```bash
# En Easypanel → Backend → Logs
# Buscar: "Cannot find module '../scripts/init-db'"
```

#### 3. Corregir Dockerfile (Backend)
```dockerfile
# Agregar en stage de producción:
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/database ./database
```

#### 4. Corregir Path en Código
```typescript
// src/index.ts - línea ~69
const { initDatabase } = require('../scripts/init-db') // ✅ Correcto para Docker
```

#### 5. Corregir Nginx Proxy (Frontend)
```nginx
# nginx.conf
location /api {
    proxy_pass https://math4life-backend.../;  # ✅ HTTPS
    proxy_set_header Host math4life-backend...; # ✅ Host correcto
    proxy_ssl_verify off;                       # ✅ Para certificados
}
```

#### 6. Forzar Rebuild Sin Cache
```bash
# Cambio menor en nginx.conf para romper Docker cache
git commit -m "fix: force nginx rebuild"
```

**Verificación:**
- ✅ Backend logs: "Database initialization completed"
- ✅ API externa: `curl https://backend.../api/grade-levels` → 200
- ✅ API proxy: `curl https://frontend.../api/grade-levels` → 200

---

### 📍 Error: Contenido No Visible en Producción (Diciembre 2024)

**Síntoma:**
```
Frontend muestra grados K-8 pero no muestra dominios ni estándares
API retorna: {"success": true, "data": []} para standards
```

**Diagnóstico:**
1. ✅ **Grade levels y domains se cargan correctamente**
2. ❌ **Standards table está vacía en producción**
3. ❌ **Auto-seeding falla silenciosamente**

**Causa Real:**
- SQL files no encontrados en container Docker
- Path resolution falla entre desarrollo y producción
- Scripts buscan en `/app/scripts/../database/seeders/` pero no existe

**Solución Implementada:**

#### 1. Path Resolution Robusta
```javascript
// scripts/seed-data.js
// Intentar múltiples paths posibles
let standardsSeederPath = path.join(__dirname, '..', 'database', 'seeders', 'standards.seed.sql');
let standardsSeederSql;

try {
  standardsSeederSql = fs.readFileSync(standardsSeederPath, 'utf8');
} catch (error) {
  // Try from dist directory
  standardsSeederPath = path.join(__dirname, '..', '..', 'database', 'seeders', 'standards.seed.sql');
  try {
    standardsSeederSql = fs.readFileSync(standardsSeederPath, 'utf8');
  } catch (error2) {
    // Try from current working directory
    standardsSeederPath = path.join(process.cwd(), 'database', 'seeders', 'standards.seed.sql');
    standardsSeederSql = fs.readFileSync(standardsSeederPath, 'utf8');
  }
}
```

#### 2. Manual Seeding Endpoint
```typescript
// src/routes/health.routes.ts
router.post('/seed', async (_req, res) => {
  const { seedData } = require('../../scripts/seed-data')
  await seedData()
  res.json({ success: true, message: 'Database seeded successfully' })
})
```

#### 3. Trigger Manual Seeding
```bash
curl -X POST https://math4life-backend.../api/health/seed
```

---

### 📍 Error: 429 Too Many Requests

**Síntoma:**
```
GET https://frontend.../api/grade-levels 429 (Too Many Requests)
```

**Causa:**
Rate limiting en el backend durante testing/desarrollo.

**Solución:**
```typescript
// src/index.ts
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // ✅ Aumentado de 100 → 1000 para desarrollo
  message: 'Too many requests from this IP, please try again later.'
})
```

---

### 📍 Error: TypeScript Build Failures

**Síntoma:**
```
error TS7030: Not all code paths return a value
```

**Causa:**
Controller methods sin return statements explícitos en todos los paths.

**Solución:**
```typescript
// Agregar return explícito en todas las respuestas
getLesson = async (req: Request, res: Response) => {
  try {
    // ...
    return res.json({ success: true, data: result.rows[0] }) // ✅ return
  } catch (error) {
    return res.status(500).json({ success: false }) // ✅ return
  }
}
```

---

### 📍 Error: Database Initialization Failed

**Síntoma:**
```
Database initialization check failed: Cannot find module '../scripts/init-db'
```

**Solución Completa:**

#### 1. Verificar Estructura en Container
```bash
docker exec -it container_name ls -la /app/
# Debe mostrar: dist/, scripts/, database/
```

#### 2. Dockerfile Correcto
```dockerfile
FROM node:18-alpine AS production
WORKDIR /app

# ✅ Copiar TODOS los archivos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/database ./database
COPY --from=builder /app/package.json ./package.json
```

#### 3. Scripts de Inicialización
```javascript
// scripts/init-db.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  // Leer schema.sql desde ../database/
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  // ... resto de la inicialización
}
```

---

## 🚀 Deployment Best Practices

### ✅ Pre-Deployment Checklist

```bash
# 1. Verificar build local
npm run build        # Frontend
cd backend && npm run build  # Backend

# 2. Verificar types
npm run typecheck   # Frontend & Backend

# 3. Verificar lint
npm run lint        # Frontend & Backend

# 4. Test containers localmente
docker-compose build
docker-compose up -d
curl http://localhost:3000/api/grade-levels

# 5. Verificar variables de entorno
# Frontend: VITE_API_URL
# Backend: DB_HOST, DB_PASSWORD, JWT_SECRET
```

### 🐳 Docker Troubleshooting

#### Verificar Logs
```bash
# Easypanel logs
# O con Docker local:
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

#### Verificar Containers
```bash
docker ps                    # Containers corriendo
docker exec -it container_name bash  # Acceder a container
docker inspect container_name        # Información detallada
```

#### Cache Issues
```bash
docker-compose build --no-cache     # Rebuild sin cache
docker system prune -a              # Limpiar todo (CUIDADO)
```

### 🔗 Network Troubleshooting

#### Verificar Conectividad
```bash
# Desde frontend container
curl http://backend:4000/api/health

# Desde host
curl https://backend-url.../api/health
curl https://frontend-url.../api/grade-levels
```

#### DNS Issues
```bash
# Verificar resolución DNS
nslookup math4life-backend...
dig math4life-backend...
```

---

## 🔧 Development Issues

### 📁 Path Resolution Problems

**Problemas Comunes:**
```typescript
// ❌ Incorrecto - paths relativos cambian entre dev/prod
require('../scripts/init-db')        // Falla en Docker
require('./relative/path')           // Falla en build

// ✅ Correcto - paths absolutos desde project root
require(path.join(__dirname, '../scripts/init-db'))
require(path.resolve('scripts', 'init-db'))
```

### ⚙️ Environment Variables

**Debug Variables:**
```bash
# Frontend (Vite)
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)

# Backend (Node)
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('DB_HOST:', process.env.DB_HOST)
```

**Common Issues:**
- Variables no prefijadas con `VITE_` en frontend
- Variables no definidas en .env
- Variables de prod/dev mezcladas

### 🗄️ Database Issues

#### Connection Problems
```bash
# Test connection
psql -h localhost -p 5432 -U math4life -d math4life

# Check containers
docker-compose ps postgres
docker-compose logs postgres
```

#### Schema Issues
```sql
-- Check if tables exist
\dt

-- Check specific table
SELECT * FROM grade_levels LIMIT 5;

-- Reinitialize if needed
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

#### Seeding Problems
```bash
# Manual seed desde container
docker exec -it backend_container node scripts/seed-data.js

# Verificar que los datos se cargaron
docker exec -it postgres_container psql -U math4life -d math4life -c "SELECT COUNT(*) FROM standards;"
```

---

## 🛡️ Security Considerations

### 🔐 Rate Limiting
```typescript
// Ajustar según entorno
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests'
})
```

### 🌐 CORS Configuration
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
```

### 🔒 Environment Secrets
```bash
# ❌ Never commit
JWT_SECRET=secret123

# ✅ Use strong secrets in production
JWT_SECRET=MathLife2024SuperSecretJWTKey32CharsMin!
```

---

## 📊 Monitoring & Debugging

### 🏥 Health Checks
```bash
# Backend health
curl https://backend.../api/health

# Expected response:
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### 📈 Performance Monitoring
```javascript
// Add timing to API calls
console.time('api-call')
await api.get('/grade-levels')
console.timeEnd('api-call')
```

### 🐛 Debug Logs
```typescript
// Backend debugging
import { logger } from './utils/logger'
logger.info('API call received', { endpoint: req.path })
logger.error('Database error', { error: err.message })

// Frontend debugging
console.group('API Response')
console.log('Status:', response.status)
console.log('Data:', response.data)
console.groupEnd()
```

---

## 🆘 Emergency Recovery

### 🔄 Quick Recovery Steps

1. **Service Down**
   ```bash
   # Check status
   curl https://app-url.../api/health
   
   # Restart services (Easypanel)
   # Or with Docker:
   docker-compose restart
   ```

2. **Database Issues**
   ```bash
   # Backup current state
   docker exec postgres pg_dump -U math4life math4life > backup.sql
   
   # Reinitialize
   docker-compose down postgres
   docker volume rm math4life_postgres_data
   docker-compose up -d postgres
   ```

3. **Complete Reset**
   ```bash
   # Nuclear option - complete rebuild
   docker-compose down -v
   docker system prune -a
   git pull origin main
   docker-compose up -d --build
   ```

4. **Force Database Seeding**
   ```bash
   # Manual seed trigger
   curl -X POST https://backend.../api/health/seed
   
   # Verify seeding worked
   curl https://backend.../api/grade-levels/K/domains/CC/standards
   ```

### 📞 Escalation

Si los problemas persisten:
- 📧 **Email**: alfredo@agnt.support
- 📱 **WhatsApp**: +52 4433104749
- 🐛 **GitHub Issues**: [math4life/issues](https://github.com/agntsupport/math4life/issues)

---

## 📚 Resources

### 🔗 Useful Links
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Proxy Configuration](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Express Rate Limiting](https://github.com/express-rate-limit/express-rate-limit)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### 🛠️ Tools
- **Docker Desktop**: Container management
- **PostgreSQL Admin**: Database management
- **Browser DevTools**: Network debugging
- **Postman**: API testing
- **curl**: Command-line API testing

---

*Última actualización: Diciembre 2024*
*Basado en casos reales resueltos en producción*