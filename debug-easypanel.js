const { chromium } = require('playwright');

async function debugEasypanel() {
  console.log('🎭 Iniciando análisis de Easypanel...');
  
  const browser = await chromium.launch({ 
    headless: false, // Mostrar navegador para debugging
    slowMo: 1000 // Ralentizar para observar
  });
  
  const page = await browser.newPage();
  
  try {
    // Acceder a Easypanel
    console.log('📡 Conectando a Easypanel...');
    await page.goto('http://82.197.94.27:3000');
    
    // Esperar a que cargue
    await page.waitForTimeout(3000);
    
    // Tomar screenshot inicial
    await page.screenshot({ path: 'easypanel-homepage.png' });
    console.log('📸 Screenshot guardado: easypanel-homepage.png');
    
    // Buscar proyecto math4life
    console.log('🔍 Buscando proyecto math4life...');
    
    // Intentar hacer click en el proyecto
    const projectSelectors = [
      'text=math4life',
      '[data-testid="project-card"]',
      '.project-card',
      'a[href*="math4life"]'
    ];
    
    let projectFound = false;
    for (const selector of projectSelectors) {
      try {
        await page.click(selector, { timeout: 2000 });
        projectFound = true;
        console.log(`✅ Proyecto encontrado con selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`❌ No encontrado con: ${selector}`);
      }
    }
    
    if (projectFound) {
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'easypanel-project.png' });
      console.log('📸 Screenshot del proyecto: easypanel-project.png');
      
      // Buscar servicios
      console.log('🔍 Analizando servicios...');
      
      // Buscar elementos de servicios
      const services = await page.$$eval('[data-testid*="service"], .service-card, [class*="service"]', 
        elements => elements.map(el => ({
          text: el.textContent,
          classes: el.className,
          status: el.querySelector('[class*="status"], [data-testid*="status"]')?.textContent || 'unknown'
        }))
      );
      
      console.log('📋 Servicios encontrados:', services);
      
      // Buscar logs o errores
      const logs = await page.$$eval('[class*="log"], [data-testid*="log"], .error, [class*="error"]',
        elements => elements.map(el => el.textContent).filter(text => text && text.length > 0)
      );
      
      if (logs.length > 0) {
        console.log('📝 Logs/Errores encontrados:');
        logs.forEach((log, i) => console.log(`  ${i + 1}. ${log.substring(0, 200)}...`));
      }
      
      // Buscar elementos de estado
      const statusElements = await page.$$eval('[class*="status"], [data-testid*="status"], .health, [class*="health"]',
        elements => elements.map(el => ({
          text: el.textContent,
          color: getComputedStyle(el).color,
          backgroundColor: getComputedStyle(el).backgroundColor
        }))
      );
      
      console.log('🚦 Estados encontrados:', statusElements);
      
    } else {
      console.log('❌ No se pudo encontrar el proyecto math4life');
      
      // Listar todos los elementos clickeables
      const clickableElements = await page.$$eval('a, button, [role="button"], [onclick]', 
        elements => elements.map(el => ({
          text: el.textContent?.substring(0, 50),
          href: el.href,
          classes: el.className
        })).filter(el => el.text && el.text.trim().length > 0)
      );
      
      console.log('🔗 Elementos clickeables encontrados:');
      clickableElements.slice(0, 10).forEach((el, i) => 
        console.log(`  ${i + 1}. "${el.text}" - ${el.href || el.classes}`)
      );
    }
    
    // Screenshot final
    await page.screenshot({ path: 'easypanel-final.png' });
    console.log('📸 Screenshot final: easypanel-final.png');
    
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