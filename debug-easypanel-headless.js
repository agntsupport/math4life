const { chromium } = require('playwright');

async function debugEasypanel() {
  console.log('🎭 Iniciando análisis headless de Easypanel...');
  
  const browser = await chromium.launch({ 
    headless: true // Modo headless para estabilidad
  });
  
  const page = await browser.newPage();
  
  try {
    // Acceder a Easypanel
    console.log('📡 Conectando a Easypanel...');
    await page.goto('http://82.197.94.27:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Obtener el título de la página
    const title = await page.title();
    console.log('📄 Título de la página:', title);
    
    // Obtener el HTML básico para análisis
    const bodyText = await page.$eval('body', el => el.textContent.substring(0, 500));
    console.log('📝 Contenido inicial:', bodyText);
    
    // Buscar elementos relacionados con math4life
    const math4lifeElements = await page.$$eval('*', elements => {
      return elements
        .filter(el => el.textContent && el.textContent.toLowerCase().includes('math4life'))
        .map(el => ({
          tag: el.tagName,
          text: el.textContent.substring(0, 100),
          href: el.href || null,
          classes: el.className
        }));
    });
    
    console.log('🔍 Elementos que contienen "math4life":', math4lifeElements);
    
    // Buscar enlaces o botones
    const links = await page.$$eval('a, button', elements => {
      return elements.map(el => ({
        text: el.textContent?.substring(0, 50) || '',
        href: el.href || '',
        type: el.tagName
      })).filter(el => el.text.trim().length > 0);
    });
    
    console.log('🔗 Enlaces encontrados (primeros 10):');
    links.slice(0, 10).forEach((link, i) => {
      console.log(`  ${i + 1}. [${link.type}] "${link.text}" - ${link.href}`);
    });
    
    // Buscar proyectos o contenedores
    const containers = await page.$$eval('[class*="project"], [class*="app"], [class*="service"], [data-testid*="project"]', elements => {
      return elements.map(el => ({
        classes: el.className,
        text: el.textContent?.substring(0, 100) || '',
        id: el.id
      }));
    });
    
    console.log('📦 Contenedores/Proyectos encontrados:', containers);
    
    // Intentar navegar a math4life si encontramos un enlace
    const math4lifeLink = links.find(link => 
      link.text.toLowerCase().includes('math4life') || 
      link.href.includes('math4life')
    );
    
    if (math4lifeLink && math4lifeLink.href) {
      console.log('🎯 Navegando al proyecto math4life...');
      await page.goto(math4lifeLink.href, { waitUntil: 'networkidle' });
      
      // Analizar la página del proyecto
      const projectTitle = await page.title();
      console.log('📄 Título del proyecto:', projectTitle);
      
      // Buscar estado de servicios
      const services = await page.$$eval('*', elements => {
        return elements
          .filter(el => {
            const text = el.textContent?.toLowerCase() || '';
            return text.includes('frontend') || 
                   text.includes('backend') || 
                   text.includes('postgres') || 
                   text.includes('redis') ||
                   text.includes('nginx') ||
                   text.includes('running') ||
                   text.includes('stopped') ||
                   text.includes('error') ||
                   text.includes('healthy');
          })
          .map(el => ({
            text: el.textContent?.substring(0, 100) || '',
            classes: el.className,
            parent: el.parentElement?.className || ''
          }));
      });
      
      console.log('🔧 Servicios y estados encontrados:', services);
      
      // Buscar logs o errores
      const errors = await page.$$eval('*', elements => {
        return elements
          .filter(el => {
            const text = el.textContent?.toLowerCase() || '';
            return text.includes('error') || 
                   text.includes('failed') || 
                   text.includes('not reachable') ||
                   text.includes('unhealthy');
          })
          .map(el => el.textContent?.substring(0, 200) || '');
      });
      
      if (errors.length > 0) {
        console.log('❌ Errores encontrados:');
        errors.forEach((error, i) => console.log(`  ${i + 1}. ${error}`));
      } else {
        console.log('✅ No se encontraron errores evidentes');
      }
    }
    
    // Tomar screenshot final
    await page.screenshot({ path: 'easypanel-analysis.png' });
    console.log('📸 Screenshot guardado: easypanel-analysis.png');
    
  } catch (error) {
    console.error('❌ Error durante el análisis:', error.message);
    await page.screenshot({ path: 'easypanel-error.png' });
  } finally {
    await browser.close();
    console.log('🏁 Análisis completado');
  }
}

// Ejecutar el debugging
debugEasypanel().catch(console.error);