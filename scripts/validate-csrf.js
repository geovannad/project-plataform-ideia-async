#!/usr/bin/env node

/**
 * Script de validação da configuração CSRF
 * Verifica se tudo está configurado corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Validador de Configuração CSRF\n');

const checks = [];

// 1. Verificar .env.example
console.log('📝 Verificando arquivos de configuração...');
const envExampleExists = fs.existsSync(path.join(__dirname, '..', '.env.example'));
checks.push({
  name: '.env.example existe',
  status: envExampleExists ? '✅' : '❌',
  passed: envExampleExists
});

// 2. Verificar index.js tem CSRF
const indexPath = path.join(__dirname, '..', 'index.js');
const indexContent = fs.readFileSync(indexPath, 'utf8');
const hasCsrfProtection = indexContent.includes('csrfProtection');
const hasSameSite = indexContent.includes('sameSite');
const hasErrorHandler = indexContent.includes('EBADCSRFTOKEN');

checks.push({
  name: 'Middleware CSRF configurado',
  status: hasCsrfProtection ? '✅' : '❌',
  passed: hasCsrfProtection
});

checks.push({
  name: 'SameSite configurado',
  status: hasSameSite ? '✅' : '❌',
  passed: hasSameSite
});

checks.push({
  name: 'Error handler CSRF',
  status: hasErrorHandler ? '✅' : '❌',
  passed: hasErrorHandler
});

// 3. Verificar views têm token CSRF
console.log('🎨 Verificando views...');
const loginViewPath = path.join(__dirname, '..', 'views', 'auth', 'login.handlebars');
const loginContent = fs.readFileSync(loginViewPath, 'utf8');
const hasTokenLogin = loginContent.includes('csrfToken');

const registerViewPath = path.join(__dirname, '..', 'views', 'auth', 'register.handlebars');
const registerContent = fs.readFileSync(registerViewPath, 'utf8');
const hasTokenRegister = registerContent.includes('csrfToken');

checks.push({
  name: 'Token CSRF em login.handlebars',
  status: hasTokenLogin ? '✅' : '❌',
  passed: hasTokenLogin
});

checks.push({
  name: 'Token CSRF em register.handlebars',
  status: hasTokenRegister ? '✅' : '❌',
  passed: hasTokenRegister
});

// 4. Verificar package.json tem csurf
const packagePath = path.join(__dirname, '..', 'package.json');
const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const hasCsurf = packageContent.dependencies?.csurf || packageContent.devDependencies?.csurf;

checks.push({
  name: 'Pacote csurf instalado',
  status: hasCsurf ? '✅' : '❌',
  passed: hasCsurf
});

// 5. Documentação
console.log('📚 Verificando documentação...');
const troubleshootingExists = fs.existsSync(path.join(__dirname, '..', 'CSRF_TROUBLESHOOTING.md'));
const checklistExists = fs.existsSync(path.join(__dirname, '..', 'DEPLOY_CHECKLIST.md'));

checks.push({
  name: 'CSRF_TROUBLESHOOTING.md existe',
  status: troubleshootingExists ? '✅' : '❌',
  passed: troubleshootingExists
});

checks.push({
  name: 'DEPLOY_CHECKLIST.md existe',
  status: checklistExists ? '✅' : '❌',
  passed: checklistExists
});

// Exibir resultados
console.log('\n' + '═'.repeat(60));
console.log('📊 RESULTADOS');
console.log('═'.repeat(60));

checks.forEach(check => {
  console.log(`${check.status} ${check.name}`);
});

const allPassed = checks.every(c => c.passed);
const totalChecks = checks.length;
const passedChecks = checks.filter(c => c.passed).length;

console.log('═'.repeat(60));
console.log(`\n📈 ${passedChecks}/${totalChecks} verificações passaram\n`);

if (allPassed) {
  console.log('✨ Excelente! Tudo está configurado corretamente!');
  console.log('\n🚀 Próximos passos:');
  console.log('1. Configure as variáveis no Render');
  console.log('2. Faça git push para deploy automático');
  console.log('3. Teste o login em produção\n');
  process.exit(0);
} else {
  console.log('⚠️ Algumas verificações falharam.');
  console.log('💡 Verifique o arquivo CSRF_TROUBLESHOOTING.md para mais informações.\n');
  process.exit(1);
}
