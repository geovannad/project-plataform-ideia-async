#!/usr/bin/env node

/**
 * Script para gerar chaves seguras para SESSION_SECRET
 * Use este script quando precisar gerar uma nova chave para produção
 */

const crypto = require('crypto');

console.log('\n🔐 Gerador de Chaves Seguras\n');

// Gerar SESSION_SECRET
const sessionSecret = crypto.randomBytes(32).toString('hex');

console.log('📌 SESSION_SECRET (copie e cole no .env do Render):');
console.log('─'.repeat(70));
console.log(sessionSecret);
console.log('─'.repeat(70));

console.log('\n✅ Como usar:');
console.log('1. Acesse o dashboard do Render');
console.log('2. Vá para seu aplicativo');
console.log('3. Settings > Environment');
console.log('4. Adicione/atualize SESSION_SECRET com o valor acima');
console.log('5. Faça um manual deploy\n');

process.exit(0);
