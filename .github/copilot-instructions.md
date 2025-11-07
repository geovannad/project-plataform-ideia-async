# Instruções para Agentes IA - Project Platform Ideia Async

Este projeto é uma aplicação Node.js/Express que implementa uma plataforma de ideias com operações assíncronas.

## Arquitetura e Estrutura

O projeto segue uma arquitetura MVC:
- `models/` - Definições de modelos usando Sequelize
- `controllers/` - Lógica de negócios e manipulação de requisições
- `routes/` - Definição de rotas da API
- `db/` - Configuração de conexão com banco de dados PostgreSQL

### Dependências Principais
- Express.js - Framework web
- Sequelize - ORM para banco de dados
- Express-Handlebars - Template engine
- Nodemon - Hot reload em desenvolvimento

## Workflows de Desenvolvimento

### Iniciar o Projeto
```bash
npm install    # Instalar dependências
npm start      # Iniciar servidor com hot reload
```

### Ambiente
- Arquivo `.env` na raiz para variáveis de ambiente (não versionado)
- Configure as credenciais do PostgreSQL no arquivo `db/conn.js`

## Padrões e Convenções

### Rotas
- Rotas seguem padrão RESTful em `routes/`
- Controllers correspondentes em `controller/`
- Exemplo: `routes/ideiaRoutes.js` → `controller/ideiaController.js`

### Modelos
- Definidos usando Sequelize em `models/`
- Convenção de nomes: singular, primeira letra maiúscula
- Exemplo: `models/ideia.js`

### Assincronicidade
- Usar async/await para operações assíncronas
- Manipulação de erros com try/catch

## Pontos de Integração
- PostgreSQL como banco de dados principal
- Handlebars para renderização de views

Para sugestões ou melhorias nestas instruções, abra uma issue no repositório.