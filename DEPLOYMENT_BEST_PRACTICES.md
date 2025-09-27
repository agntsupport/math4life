# 🚀 Deployment Best Practices - Math4Life

*Guía de mejores prácticas basada en experiencia real de producción*

**📅 Última Actualización:** Septiembre 27, 2025  
**✅ Estado:** Basado en resolución exitosa de issues reales en producción

---

## 🎯 Principios Fundamentales

### 1. ✅ Infraestructura como Código
- **Docker containers** para consistencia dev/prod
- **Environment variables** para toda configuración
- **Git-based deployment** para trazabilidad
- **Automated rollbacks** para recuperación rápida

### 2. ✅ Zero-Downtime Deployments
- **Health checks** antes de redireccionar tráfico
- **Database migrations** aplicadas antes del deploy
- **Static assets** con cache-busting automático
- **Service discovery** para nuevas instancias

### 3. ✅ Observabilidad Completa
- **Structured logging** en todos los servicios
- **Error tracking** con stack traces completos
- **Performance monitoring** de APIs críticas
- **Database query analysis** para optimización

---

## 📦 Pre-Deployment Checklist

### ✅ Code Quality Gates
```bash
# 1. TypeScript compilation
npm run build        # Frontend & Backend
npm run typecheck    # Verificar types

# 2. Code quality
npm run lint         # ESLint rules
npm run format       # Prettier formatting

# 3. Security scanning
npm audit            # Vulnerability check
docker scan image    # Container security
```

### ✅ Local Testing Requirements
```bash
# 1. Unit tests
npm test             # Jest test suite

# 2. Integration tests
npm run test:e2e     # Cypress end-to-end

# 3. Performance tests
npm run test:perf    # Load testing
```

### ✅ Database Preparation
```bash
# 1. Migration validation
npm run db:migrate:dry-run

# 2. Backup production data
pg_dump production_db > backup_$(date +%Y%m%d).sql

# 3. Test migration on copy
npm run db:migrate:test
```

---

## 🐳 Docker Best Practices

### ✅ Multi-Stage Builds
```dockerfile
# ✅ RECOMENDADO: Optimized production build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS production
WORKDIR /app
# Solo copiar archivos necesarios
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/database ./database
EXPOSE 80
CMD ["node", "dist/index.js"]
```

### ✅ Environment Variables Pattern
```bash
# ✅ CORRECTO: Variables de entorno bien estructuradas
NODE_ENV=production
PORT=80                                    # CRÍTICO: Debe ser 80 para Easypanel
DB_HOST=math4life-postgres                # Service name en Docker
JWT_SECRET=32CharMinSecretKey123!         # 32+ caracteres
FRONTEND_URL=https://domain.com           # CORS configuration
```

### ✅ Health Check Implementation
```dockerfile
# ✅ RECOMENDADO: Health check en Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s \
  CMD curl -f http://localhost:80/api/health || exit 1
```

---

## 🔧 Easypanel Configuration

### ✅ Service Configuration Template
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
  "port": 80,
  "healthCheck": "/api/health"
}
```

### ✅ Network Configuration
- **Internal services** se comunican por service name
- **External access** via generated URLs
- **SSL/TLS** manejado automáticamente por Easypanel
- **Load balancing** incluido en la plataforma

---

## 🔄 CI/CD Pipeline Best Practices

### ✅ GitHub Actions Workflow
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build project
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Easypanel deploy
        run: |
          curl -X POST ${{ secrets.EASYPANEL_WEBHOOK }}
```

### ✅ Rollback Strategy
```bash
# Automated rollback on health check failure
if ! curl -f https://app-url/api/health; then
  echo "Health check failed, rolling back..."
  # Revert to previous deployment
  git revert HEAD
  git push origin main
fi
```

---

## 🗄️ Database Management

### ✅ Migration Strategy
```javascript
// scripts/migrate.js - Safe migration pattern
async function runMigration() {
  const client = new Pool(/* config */);
  
  try {
    await client.query('BEGIN');
    
    // 1. Crear nuevas tablas/columnas
    await client.query(/* migration SQL */);
    
    // 2. Verificar datos
    const result = await client.query('SELECT COUNT(*) FROM new_table');
    if (result.rows[0].count === 0) {
      throw new Error('Migration validation failed');
    }
    
    await client.query('COMMIT');
    console.log('Migration completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  }
}
```

### ✅ Backup Automation
```bash
#!/bin/bash
# scripts/backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_FILE
aws s3 cp $BACKUP_FILE s3://backups/math4life/

# Cleanup local backups older than 7 days
find . -name "backup_*.sql" -mtime +7 -delete
```

---

## 🔍 Monitoring & Alerting

### ✅ Application Metrics
```typescript
// src/utils/metrics.ts
import { createPrometheusMetrics } from 'prom-client';

export const metrics = {
  httpRequests: new Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status']
  }),
  
  dbQueries: new Histogram({
    name: 'db_query_duration_seconds',
    help: 'Database query duration',
    labelNames: ['query_type']
  }),
  
  userSessions: new Gauge({
    name: 'active_user_sessions',
    help: 'Currently active user sessions'
  })
};
```

### ✅ Error Tracking
```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Structured error logging
logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack,
  query: sanitizedQuery,
  userId: req.user?.id
});
```

---

## 🛡️ Security Best Practices

### ✅ Environment Security
```bash
# ✅ CORRECTO: Secrets management
JWT_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 24)

# ❌ NUNCA HACER: Secrets en código
# const JWT_SECRET = "mysecret123"
```

### ✅ Rate Limiting Configuration
```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  
  // Custom key generator for user-based limiting
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});
```

### ✅ CORS Configuration
```typescript
// src/middleware/cors.ts
import cors from 'cors';

export const corsConfig = cors({
  origin: [
    'https://math4life-frontend.domain.com',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
});
```

---

## 🚨 Incident Response Plan

### ✅ Severity Levels
**🔴 P0 - Critical (< 15 min response)**
- Site completely down
- Data loss or corruption
- Security breach

**🟡 P1 - High (< 1 hour response)**
- Major feature broken
- Performance severely degraded
- API endpoints returning 5xx errors

**🟢 P2 - Medium (< 4 hours response)**
- Minor feature issues
- Intermittent errors
- Non-critical performance issues

### ✅ Response Procedures
```bash
# 1. Immediate Assessment
curl -I https://app-url/api/health
docker logs container_name --tail=100

# 2. Quick Fixes
# Restart services
docker-compose restart backend

# 3. Rollback if needed
git log --oneline -10  # Find last good commit
git revert HEAD        # Revert problematic changes
git push origin main   # Trigger redeploy

# 4. Communication
# Update status page
# Notify stakeholders
# Document incident
```

---

## 📊 Performance Optimization

### ✅ Frontend Optimization
```typescript
// src/config/optimization.ts
export const performanceConfig = {
  // Code splitting
  chunks: 'async',
  
  // Cache busting
  filename: '[name].[contenthash].js',
  
  // Compression
  compression: true,
  
  // Bundle analysis
  bundleAnalyzer: process.env.ANALYZE === 'true'
};
```

### ✅ Backend Optimization
```typescript
// src/config/performance.ts
import compression from 'compression';
import helmet from 'helmet';

app.use(compression());
app.use(helmet());

// Connection pooling
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Query optimization
const getGradeLevels = async () => {
  return await pool.query(
    'SELECT * FROM grade_levels ORDER BY level_order',
    { cache: true, ttl: 300000 } // 5 min cache
  );
};
```

---

## 🧪 Testing Strategies

### ✅ Test Pyramid
```
    /\     E2E Tests (10%)
   /  \    - User workflows
  /    \   - Critical paths
 /______\  
/        \ Integration Tests (20%)
|        | - API endpoints  
|        | - Database ops
|________|
          Unit Tests (70%)
          - Pure functions
          - Components
          - Business logic
```

### ✅ E2E Testing
```typescript
// cypress/e2e/grade-navigation.cy.ts
describe('Grade Navigation', () => {
  it('should load grade levels without errors', () => {
    cy.visit('/');
    cy.get('[data-testid="grade-selector"]').should('be.visible');
    cy.get('[data-testid="grade-k"]').click();
    cy.url().should('include', '/grade/k');
    cy.get('[data-testid="topics-list"]').should('contain', 'Counting');
  });
});
```

---

## 🔄 Continuous Improvement

### ✅ Post-Deployment Review
1. **Performance metrics** analysis
2. **Error rate** comparison
3. **User feedback** collection
4. **Resource utilization** review
5. **Security scan** results

### ✅ Documentation Updates
- Update deployment logs
- Record lessons learned
- Update troubleshooting guides
- Share knowledge with team

### ✅ Automation Opportunities
- Identify manual processes
- Create deployment scripts
- Enhance monitoring
- Improve test coverage

---

## 📚 Resources & Tools

### ✅ Essential Tools
- **Docker Desktop:** Container management
- **VS Code + Extensions:** Development environment
- **Postman/Insomnia:** API testing
- **pgAdmin:** Database management
- **Browser DevTools:** Frontend debugging

### ✅ Monitoring Tools
- **Easypanel Dashboard:** Service monitoring
- **CloudWatch/DataDog:** Application monitoring
- **Sentry:** Error tracking
- **New Relic:** Performance monitoring

### ✅ Security Tools
- **npm audit:** Dependency scanning
- **Docker scan:** Container security
- **OWASP ZAP:** Security testing
- **Let's Encrypt:** SSL certificates

---

*Esta guía está basada en la experiencia real de deployment y resolución de issues en producción del proyecto Math4Life. Se actualiza continuamente con nuevas mejores prácticas y lecciones aprendidas.*

**📞 Para consultas:** alfredo@agnt.support  
**📅 Próxima revisión:** Octubre 15, 2025