# 🏎️ Formula 1 API - Fastify

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.25-blue)](https://www.fastify.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Uma API minimal de Fórmula 1 construída com **Node.js** e **Fastify**, com foco em segurança, performance e boas práticas de desenvolvimento.

## 📋 Características

✅ **Endpoints RESTful** para gerenciar pilotos de F1  
✅ **Filtros avançados** (por time, nacionalidade, status)  
✅ **Ranking de pilotos** por pontos  
✅ **Proteção CORS** e rate limiting  
✅ **Segurança** com Helmet.js (XSS, clickjacking, etc)  
✅ **Código comentado** e bem estruturado  
✅ **Tratamento de erros** robusto  
✅ **Logging customizado**  
✅ **Validação de entrada** (sanitização)  

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/f1-api.git
   cd f1-api
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```

4. **Inicie o servidor**
   ```bash
   # Modo desenvolvimento (com auto-reload)
   npm run dev
   
   # Modo produção
   npm start
   ```

5. **Acesse a API**
   ```
   http://localhost:3000
   ```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
```http
GET /health
```
**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 1234.56,
  "environment": "development"
}
```

---

## 🏁 Endpoints de Pilotos (Drivers)

### 1. **Listar Todos os Pilotos**
```http
GET /drivers
```

**Query Parameters:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `team` | string | Filtrar por time |
| `nationality` | string | Filtrar por nacionalidade |
| `active` | boolean | Filtrar por status (true/false) |
| `sort` | string | Ordenar por (points, name, championships) |

**Exemplos:**
```bash
# Todos os pilotos
curl http://localhost:3000/drivers

# Pilotos ativos da Ferrari
curl "http://localhost:3000/drivers?team=Ferrari&active=true"

# Pilotos britânicos, ordenado por pontos
curl "http://localhost:3000/drivers?nationality=British&sort=points"

# Pilotos ordenados alfabeticamente
curl "http://localhost:3000/drivers?sort=name"
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Max Verstappen",
      "team": "Red Bull Racing",
      "nationality": "Dutch",
      "points": 430,
      "championships": 3,
      "number": 1,
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 8,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 2. **Obter Piloto por ID**
```http
GET /drivers/:id
```

**Exemplo:**
```bash
curl http://localhost:3000/drivers/1
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Max Verstappen",
    "team": "Red Bull Racing",
    "nationality": "Dutch",
    "points": 430,
    "championships": 3,
    "number": 1,
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 3. **Criar Novo Piloto**
```http
POST /drivers
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Novo Piloto",
  "team": "Team Principal",
  "nationality": "Nacionalidade",
  "number": 99,
  "points": 0,
  "championships": 0
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:3000/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sebastian Vettel",
    "team": "Aston Martin",
    "nationality": "German",
    "number": 33,
    "points": 180,
    "championships": 4
  }'
```

**Resposta:** (Status: 201)
```json
{
  "success": true,
  "data": {
    "id": 9,
    "name": "Sebastian Vettel",
    "team": "Aston Martin",
    "nationality": "German",
    "number": 33,
    "points": 180,
    "championships": 4,
    "active": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Piloto criado com sucesso",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 4. **Atualizar Piloto**
```http
PUT /drivers/:id
Content-Type: application/json
```

**Body:** (todos os campos são opcionais)
```json
{
  "points": 500,
  "active": false
}
```

**Exemplo:**
```bash
curl -X PUT http://localhost:3000/drivers/1 \
  -H "Content-Type: application/json" \
  -d '{"points": 450}'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Max Verstappen",
    "team": "Red Bull Racing",
    "nationality": "Dutch",
    "points": 450,
    "championships": 3,
    "number": 1,
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Piloto atualizado com sucesso",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 5. **Remover Piloto**
```http
DELETE /drivers/:id
```

**Exemplo:**
```bash
curl -X DELETE http://localhost:3000/drivers/9
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "name": "Sebastian Vettel",
    "team": "Aston Martin",
    "nationality": "German",
    "number": 33,
    "points": 180,
    "championships": 4,
    "active": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Piloto removido com sucesso",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 6. **Ranking de Pilotos por Pontos**
```http
GET /drivers/ranking/points
```

**Exemplo:**
```bash
curl http://localhost:3000/drivers/ranking/points
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Max Verstappen",
      "team": "Red Bull Racing",
      "nationality": "Dutch",
      "points": 430,
      "championships": 3,
      "number": 1,
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "position": 1
    },
    {
      "id": 7,
      "name": "Charles Leclerc",
      "team": "Ferrari",
      "nationality": "Monegasque",
      "points": 315,
      "championships": 0,
      "number": 16,
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "position": 2
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 7. **Listar Times**
```http
GET /drivers/teams
```

**Exemplo:**
```bash
curl http://localhost:3000/drivers/teams
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    "Aston Martin",
    "Ferrari",
    "McLaren",
    "Mercedes",
    "Red Bull Racing"
  ],
  "count": 5,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔐 Segurança

A API implementa múltiplas camadas de segurança:

### 🛡️ Helmet.js
- Proteção contra XSS (Cross-Site Scripting)
- Proteção contra Clickjacking
- Content Security Policy (CSP)
- HSTS (HTTP Strict Transport Security)
- Impede MIME type sniffing

### 🌐 CORS (Cross-Origin Resource Sharing)
- Controla requisições cross-origin
- Whitelist de origens permitidas
- Configurável via `.env`

### ⏱️ Rate Limiting
- **100 requisições por 15 minutos** (padrão)
- Previne DDoS e abuso
- Configurável via `.env`

### ✔️ Validação de Input
- Sanitização de strings (remove tags HTML)
- Validação de tipos
- Prevenção de injeção SQL

### 📋 Error Handling
- Não expõe informações sensíveis
- Request IDs para tracking
- Logging detalhado no server

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT=100
```

---

## 📊 Estrutura de Pastas

```
f1-api/
├── src/
│   ├── index.js                 # Arquivo principal
│   ├── routes/
│   │   └── drivers.js           # Rotas de pilotos
│   ├── data/
│   │   └── drivers.js           # Dados de pilotos
│   └── middleware/
│       └── security.js          # Segurança e middlewares
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🧪 Testando a API

### Usando cURL

```bash
# Listar todos os pilotos
curl http://localhost:3000/drivers

# Filtrar pilotos
curl "http://localhost:3000/drivers?team=Ferrari"

# Obter um piloto
curl http://localhost:3000/drivers/1

# Criar um novo piloto
curl -X POST http://localhost:3000/drivers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "George Russell",
    "team": "Mercedes",
    "nationality": "British",
    "number": 63,
    "points": 275,
    "championships": 0
  }'
```

### Usando Postman

1. Importe a coleção fornecida: `postman_collection.json`
2. Configure o ambiente com a variável `{{base_url}}` = `http://localhost:3000`
3. Execute as requisições

### Usando VS Code REST Client

Crie um arquivo `requests.http`:

```http
@baseUrl = http://localhost:3000

### Health Check
GET {{baseUrl}}/health

### Listar todos os pilotos
GET {{baseUrl}}/drivers

### Filtrar pilotos Ferrari
GET {{baseUrl}}/drivers?team=Ferrari

### Obter piloto específico
GET {{baseUrl}}/drivers/1

### Ranking por pontos
GET {{baseUrl}}/drivers/ranking/points
```

---

## 🚀 Deploy

### Deploying no Heroku

```bash
# Criar aplicação
heroku create seu-app-name

# Definir variáveis de ambiente
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

### Deploying no Railway.app

```bash
# Login
railway login

# Link projeto
railway link

# Deploy
railway up
```

---

## 🌐 Interface Web

A API inclui uma **interface web interativa** para gerenciar e visualizar pilotos de Fórmula 1.

### 🎯 Recursos

✅ **Dashboard** - Estatísticas em tempo real  
✅ **Listar Pilotos** - Com filtros, busca e ordenação  
✅ **Criar Piloto** - Formulário com validação  
✅ **Editar Piloto** - Modal de atualização  
✅ **Deletar Piloto** - Com confirmação  
✅ **Ranking** - Ranking oficial com medalhas 🥇🥈🥉  
✅ **Tema Escuro/Claro** - Com persistência  
✅ **Responsivo** - Funciona em mobile, tablet e desktop  

### 🚀 Como Usar

1. Inicie o servidor: `npm start`
2. Acesse no navegador: `http://localhost:3000`
3. Navegue pelas abas (Dashboard, Pilotos, Novo Piloto, Ranking)

### 📸 Interface em Ação

![Ranking de Pilotos](/public/screenshots/ranking.png)

---

## 📝 Padrões Implementados

✅ **MVC** - Separação de rotas e dados  
✅ **DRY** - Código reutilizável e modular  
✅ **SOLID** - Princípios de design  
✅ **Security First** - Segurança por padrão  
✅ **Error Handling** - Tratamento robusto de erros  
✅ **Logging** - Rastreamento completo  
✅ **API RESTful** - Convenções REST  
✅ **Type Safety** - Validação de tipos  

---

## 📚 Documentação Adicional

- [Fastify Documentation](https://www.fastify.io/)
- [Helmet.js](https://helmetjs.github.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

## ✨ Autor

**Seu Nome**
- GitHub: [@gabrielfrazao](https://github.com/gabrielfrazao)
- LinkedIn: [Gabriel Frazão Manoel](https://www.linkedin.com/in/gabriel-frazao-manoel/)


---

**Versão:** 1.0.0   
**Status:** ✅ Ativo e em desenvolvimento
