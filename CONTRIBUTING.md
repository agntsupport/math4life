# 🤝 Guía de Contribución - Math4Life

*Cómo contribuir al proyecto de aprendizaje matemático interactivo*

## 🎯 Sobre el Proyecto

Math4Life es una plataforma educativa 100% gratuita y open source para el aprendizaje interactivo de matemáticas. Nuestro objetivo es democratizar el acceso a herramientas educativas de calidad.

**🌐 Demo:** https://math4life.agnt.support  
**📚 Repositorio:** https://github.com/agntsupport/math4life  

---

## 🚀 Empezar a Contribuir

### ✅ Requisitos Previos

- **Node.js 18+** (recomendado 20+)
- **Docker & Docker Compose**
- **Git**
- **Editor de código** con soporte TypeScript (VS Code recomendado)

### 🛠️ Setup del Entorno

```bash
# 1. Fork del repositorio en GitHub
# 2. Clonar tu fork
git clone https://github.com/TU_USUARIO/math4life
cd math4life

# 3. Configurar remotes
git remote add upstream https://github.com/agntsupport/math4life

# 4. Instalar y ejecutar
./dev.sh

# 5. Verificar que todo funciona
# Frontend: http://localhost:3000
# Backend: http://localhost:4000/api/health
```

---

## 📁 Estructura del Proyecto

### 🎨 Frontend (React + TypeScript)
```
frontend/src/
├── components/          # Componentes reutilizables
│   ├── DraggableExpression.tsx    # Drag & drop para álgebra
│   ├── MathCanvas.tsx             # Canvas matemático
│   └── Layout.tsx                 # Layout principal
├── pages/              # Páginas de la aplicación
│   ├── HomePage.tsx               # Landing page
│   ├── Playground.tsx             # Área de experimentación
│   └── modules/                   # Módulos educativos
├── styles/             # Temas y estilos
├── App.tsx             # Componente raíz
└── main.tsx            # Entry point
```

### 🔧 Backend (Node.js + Express)
```
backend/src/
├── controllers/        # Controladores de rutas
├── routes/             # Definición de rutas
├── services/           # Lógica de negocio
├── middlewares/        # Middlewares Express
├── utils/              # Utilidades
└── index.ts            # Entry point
```

---

## 🎨 Estándares de Código

### TypeScript
- ✅ **Tipado estricto**: Sin `any`, usar tipos específicos
- ✅ **Interfaces claras**: Documentar props y parámetros
- ✅ **Naming conventions**: camelCase para variables, PascalCase para componentes

```typescript
// ✅ Bueno
interface MathExpressionProps {
  expression: string;
  onValidate: (isValid: boolean) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// ❌ Malo
function handleStuff(data: any) {
  // ...
}
```

### React Components
- ✅ **Functional components** con hooks
- ✅ **Props interface** siempre definida
- ✅ **Memoización** cuando sea necesario

```typescript
// ✅ Bueno
interface CalculatorProps {
  initialValue?: number;
  onResult: (result: number) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ 
  initialValue = 0, 
  onResult 
}) => {
  // ...
};
```

### CSS/Styling
- ✅ **Material-UI** para componentes base
- ✅ **Emotion** para estilos custom
- ✅ **Responsive design** mobile-first

---

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test                # Ejecutar tests
npm run test:watch      # Modo watch
npm run test:coverage   # Con cobertura
```

### Backend Testing
```bash
cd backend
npm test                # Tests unitarios
npm run test:e2e        # Tests end-to-end
```

### Estándares de Testing
- ✅ **Cobertura mínima**: 80% en funciones críticas
- ✅ **Tests unitarios**: Para lógica de negocio
- ✅ **Tests de integración**: Para APIs
- ✅ **Tests E2E**: Para flujos críticos de usuario

---

## 🔀 Flujo de Contribución

### 1. Crear Feature Branch
```bash
# Sincronizar con upstream
git checkout main
git pull upstream main

# Crear nueva rama
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

### 2. Hacer Cambios
```bash
# Desarrollo
npm run dev

# Verificar calidad
npm run lint
npm run typecheck
npm test
```

### 3. Commit con Conventional Commits
```bash
# Formato: tipo(scope): descripción
git commit -m "feat(algebra): add quadratic equation solver"
git commit -m "fix(api): handle division by zero error"
git commit -m "docs(readme): update installation instructions"
```

**Tipos de commit:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato de código
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Tareas de mantenimiento

### 4. Push y Pull Request
```bash
git push origin feature/nombre-descriptivo
```

**Template de PR:**
```markdown
## 📝 Descripción
Breve descripción de los cambios realizados.

## 🎯 Tipo de Cambio
- [ ] 🐛 Bug fix
- [ ] ✨ Nueva funcionalidad
- [ ] 💥 Breaking change
- [ ] 📝 Documentación

## 🧪 Testing
- [ ] Tests unitarios agregados/actualizados
- [ ] Tests E2E verificados
- [ ] Revisión manual completada

## 📸 Screenshots (si aplica)
[Agregar capturas de pantalla]

## ✅ Checklist
- [ ] Código sigue los estándares del proyecto
- [ ] Self-review completado
- [ ] Documentación actualizada
- [ ] Tests pasan correctamente
```

---

## 🐛 Reportar Bugs

### Información Requerida
1. **Descripción clara** del problema
2. **Pasos para reproducir** el bug
3. **Comportamiento esperado** vs actual
4. **Environment info**: OS, browser, versión
5. **Screenshots/videos** si es visual
6. **Logs de error** si están disponibles

### Template de Issue
```markdown
## 🐛 Descripción del Bug
Descripción clara y concisa del problema.

## 🔄 Pasos para Reproducir
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

## ✅ Comportamiento Esperado
Qué debería suceder.

## 🌍 Environment
- OS: [e.g. macOS 14]
- Browser: [e.g. Chrome 118]
- Versión: [e.g. 1.0.0]

## 📷 Screenshots
Si aplica, agregar screenshots.
```

---

## 💡 Solicitar Features

### Antes de Solicitar
1. **Buscar** en issues existentes
2. **Verificar** el roadmap del proyecto
3. **Considerar** el scope y complejidad

### Template de Feature Request
```markdown
## 🚀 Feature Request

### 📝 Descripción
Descripción clara de la funcionalidad solicitada.

### 🎯 Problema que Resuelve
¿Qué problema educativo o técnico resuelve?

### 💡 Solución Propuesta
Descripción de cómo debería funcionar.

### 🎨 Mockups/Referencias
Enlaces o imágenes de referencia.

### 🏗️ Complejidad Estimada
- [ ] Baja (< 1 día)
- [ ] Media (1-3 días)
- [ ] Alta (> 1 semana)
```

---

## 📚 Áreas de Contribución

### 🎨 Frontend/UI
- **React components** reutilizables
- **Responsive design** mejorado
- **Accesibilidad** (a11y)
- **Performance** optimizations
- **Animaciones** educativas

### 🔧 Backend/API
- **Endpoints** nuevos para funcionalidades
- **Optimización** de queries
- **Caching** strategies
- **Rate limiting** mejorado
- **Monitoring** y logs

### 🧮 Motor Matemático
- **Algoritmos** de validación
- **Nuevos tipos** de ejercicios
- **Simplificación** algebraica
- **Graficación** de funciones
- **Generación** de problemas

### 📖 Contenido Educativo
- **Ejercicios** nuevos
- **Explicaciones** paso a paso
- **Hints** contextuales
- **Progresión** de dificultad
- **Evaluaciones** automáticas

### 🧪 Testing & QA
- **Tests unitarios** faltantes
- **Tests E2E** de flujos
- **Performance testing**
- **Security testing**
- **Accessibility testing**

### 📝 Documentación
- **API documentation**
- **Tutoriales** de desarrollo
- **Guías de usuario**
- **Videos** explicativos
- **Diagramas** de arquitectura

---

## 🔒 Consideraciones de Seguridad

### ⚠️ Nunca Incluir
- ❌ **Credenciales** o secrets
- ❌ **API keys** en código
- ❌ **Passwords** hardcodeados
- ❌ **Datos personales** de usuarios

### ✅ Mejores Prácticas
- ✅ **Sanitizar** inputs de usuario
- ✅ **Validar** datos en backend
- ✅ **Rate limiting** para APIs
- ✅ **HTTPS** siempre en producción
- ✅ **Dependencies** actualizadas

---

## 🎓 Recursos para Contribuidores

### 📚 Documentación Técnica
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Components](https://mui.com/components/)
- [Express.js Guide](https://expressjs.com/guide/)

### 🧮 Matemáticas y Educación
- [Math.js Documentation](https://mathjs.org/docs/)
- [KaTeX Supported Functions](https://katex.org/docs/supported.html)
- [Plotly.js Examples](https://plotly.com/javascript/)

### 🛠️ Herramientas de Desarrollo
- [VS Code Extensions](https://marketplace.visualstudio.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Git Best Practices](https://git-scm.com/book)

---

## 🏆 Reconocimiento

### 🌟 Contribuidores Destacados
Los contribuidores son reconocidos en:
- **README.md** del proyecto
- **Changelog** de releases
- **Hall of Fame** en la web
- **LinkedIn** y redes sociales

### 🎁 Beneficios
- **Experiencia** en proyecto real
- **Portfolio** técnico
- **Network** en la comunidad educativa
- **Referencias** profesionales
- **Menciones** en conferencias

---

## 📞 Contacto y Soporte

### 💬 Canales de Comunicación
- **GitHub Issues**: Para bugs y features
- **GitHub Discussions**: Para preguntas generales
- **Email**: alfredo@agnt.support
- **WhatsApp**: +52 4433104749

### 🕐 Horarios de Respuesta
- **Issues críticos**: 24 horas
- **Pull Requests**: 48-72 horas
- **Preguntas generales**: 1 semana

---

## 📜 Código de Conducta

### 🤝 Nuestros Valores
- **Respeto** mutuo y profesionalismo
- **Inclusión** de todas las perspectivas
- **Colaboración** constructiva
- **Aprendizaje** continuo
- **Calidad** en el trabajo

### 🚫 Comportamientos No Aceptables
- Lenguaje ofensivo o discriminatorio
- Ataques personales o trolling
- Spam o contenido irrelevante
- Violación de privacidad
- Cualquier forma de acoso

### 📋 Reportar Problemas
Si observas comportamiento inapropiado, contacta:
- **Email**: alfredo@agnt.support
- **Asunto**: "[CODE_OF_CONDUCT] Reporte"

---

## 🙏 Agradecimientos

Gracias por considerar contribuir a Math4Life. Tu aporte ayuda a democratizar la educación matemática y crear un impacto positivo en estudiantes de todo el mundo.

**¡Cada línea de código cuenta!** 🚀

---

*Documento actualizado: Septiembre 26, 2024*  
*Próxima revisión: Octubre 15, 2024*