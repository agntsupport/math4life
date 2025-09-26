const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function analyzeEasypanel() {
  console.log('🔍 Análisis simple de Easypanel con curl...');
  
  try {
    // Obtener página principal
    console.log('📡 Obteniendo página principal...');
    const { stdout: homePage } = await execAsync('curl -s -L http://82.197.94.27:3000');
    
    // Buscar referencias a math4life
    const math4lifeMatches = homePage.match(/math4life/gi) || [];
    console.log(`🔍 Referencias a "math4life" encontradas: ${math4lifeMatches.length}`);
    
    // Buscar enlaces o rutas
    const linkMatches = homePage.match(/href="[^"]*"/g) || [];
    const math4lifeLinks = linkMatches.filter(link => link.includes('math4life'));
    console.log('🔗 Enlaces a math4life encontrados:', math4lifeLinks);
    
    // Intentar rutas directas conocidas de Easypanel
    const testRoutes = [
      '/projects/math4life',
      '/projects/math4life/apps',
      '/projects/math4life/app/math4life-frontend',
      '/projects/math4life/app/math4life-backend',
      '/api/projects/math4life',
      '/dashboard/projects/math4life'
    ];
    
    console.log('🧪 Probando rutas directas...');
    for (const route of testRoutes) {
      try {
        const { stdout } = await execAsync(`curl -s -I http://82.197.94.27:3000${route}`);
        const statusLine = stdout.split('\n')[0];
        console.log(`  ${route}: ${statusLine}`);
        
        if (statusLine.includes('200')) {
          console.log(`✅ Ruta activa encontrada: ${route}`);
          
          // Obtener contenido de la ruta exitosa
          const { stdout: content } = await execAsync(`curl -s http://82.197.94.27:3000${route}`);
          
          // Buscar palabras clave relacionadas con estado
          const keywords = ['running', 'stopped', 'error', 'healthy', 'unhealthy', 'reachable', 'frontend', 'backend'];
          const foundKeywords = [];
          
          keywords.forEach(keyword => {
            const regex = new RegExp(keyword, 'gi');
            const matches = content.match(regex);
            if (matches) {
              foundKeywords.push(`${keyword}: ${matches.length}`);
            }
          });
          
          if (foundKeywords.length > 0) {
            console.log(`  📊 Estados encontrados: ${foundKeywords.join(', ')}`);
          }
          
          // Buscar texto que indique errores específicos
          if (content.includes('not reachable')) {
            console.log('  ❌ Texto "not reachable" encontrado');
          }
          if (content.includes('Service is not reachable')) {
            console.log('  ❌ Texto "Service is not reachable" encontrado');
          }
        }
        
      } catch (error) {
        console.log(`  ${route}: Error - ${error.message.substring(0, 50)}`);
      }
    }
    
    // Probar endpoints de API directos
    console.log('🔌 Probando endpoints de API...');
    const apiTests = [
      'http://82.197.94.27:8080',
      'http://82.197.94.27:8080/health',
      'http://82.197.94.27:8080/api/health'
    ];
    
    for (const endpoint of apiTests) {
      try {
        const { stdout } = await execAsync(`curl -s -I ${endpoint} | head -1`);
        console.log(`  ${endpoint}: ${stdout.trim()}`);
      } catch (error) {
        console.log(`  ${endpoint}: No accesible`);
      }
    }
    
    // Verificar si hay algún proceso escuchando en puertos esperados
    console.log('🔍 Verificando puertos en el servidor...');
    try {
      const { stdout } = await execAsync('curl -s http://82.197.94.27:3000 | grep -o "port [0-9]*" | head -5');
      if (stdout.trim()) {
        console.log('🔢 Puertos mencionados:', stdout.trim());
      }
    } catch (error) {
      console.log('No se pudieron detectar puertos en uso');
    }
    
  } catch (error) {
    console.error('❌ Error en el análisis:', error.message);
  }
  
  console.log('🏁 Análisis completado');
}

analyzeEasypanel().catch(console.error);