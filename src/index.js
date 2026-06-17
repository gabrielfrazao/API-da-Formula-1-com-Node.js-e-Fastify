/**
 * Servidor Principal - API de Fórmula 1
 * Fastify API para gerenciar pilotos de Fórmula 1
 * Versão: 1.0.0
 */

import Fastify from 'fastify';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fastifyStatic from '@fastify/static';
import { driverRoutes } from './routes/drivers.js';
import { 
  registerSecurityPlugins, 
  registerLoggingMiddleware,
  registerErrorHandler 
} from './middleware/security.js';

// Obter diretório do projeto
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

// Carregar variáveis de ambiente
config();

// Extrair configurações do ambiente
const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Inicializa e configura a aplicação Fastify
 */
async function startServer() {
  // Criar instância do Fastify com logger
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
    requestTimeout: 30000, // Timeout de 30 segundos
    bodyLimit: 1048576, // Limite de 1MB para request body
  });

  try {
    // ===== Registrar Plugins de Segurança =====
    await registerSecurityPlugins(fastify);
    
    // ===== Registrar Middlewares =====
    await registerLoggingMiddleware(fastify);
    
    // ===== Registrar Error Handler =====
    await registerErrorHandler(fastify);

    // ===== Servir Arquivos Estáticos (UI) =====
    await fastify.register(fastifyStatic, {
      root: `${projectRoot}/public`,
      prefix: '/',
      constraints: {}
    });

    // ===== Rotas Health Check =====
    fastify.get('/health', async (request, reply) => {
      return reply.code(200).send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV,
      });
    });

    // ===== Rota Root =====
    fastify.get('/', async (request, reply) => {
      return reply.code(200).send({
        name: 'Formula 1 API',
        version: '1.0.0',
        description: 'API Minimal para gerenciar pilotos de Fórmula 1',
        endpoints: {
          health: '/health',
          drivers: {
            list: 'GET /drivers',
            detail: 'GET /drivers/:id',
            create: 'POST /drivers',
            update: 'PUT /drivers/:id',
            delete: 'DELETE /drivers/:id',
            ranking: 'GET /drivers/ranking/points',
            teams: 'GET /drivers/teams',
          },
        },
        documentation: 'Veja README.md para documentação completa',
      });
    });

    // ===== Registrar Rotas =====
    await fastify.register(driverRoutes);

    // ===== Rota 404 =====
    fastify.setNotFoundHandler((request, reply) => {
      return reply.code(404).send({
        success: false,
        error: 'Rota não encontrada',
        path: request.url,
        method: request.method,
      });
    });

    // ===== Iniciar Servidor =====
    await fastify.listen({ port: PORT, host: '0.0.0.0' });

    console.log(`
    ╔═══════════════════════════════════════╗
    ║  🏎️  Formula 1 API - Fastify          ║
    ╚═══════════════════════════════════════╝
    
    ✅ Servidor rodando em: http://localhost:${PORT}
    📋 Ambiente: ${NODE_ENV}
    🔐 Segurança: ATIVADA (Helmet, CORS, Rate Limit)
    
    Acesse: http://localhost:${PORT}
    Health: http://localhost:${PORT}/health
    `);

  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

// ===== Tratamento de Sinais de Encerramento =====
process.on('SIGINT', () => {
  console.log('\n\n⛔ Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n⛔ Encerrando servidor (SIGTERM)...');
  process.exit(0);
});

// ===== Iniciar Aplicação =====
startServer().catch((error) => {
  console.error('❌ Erro ao iniciar servidor:', error);
  process.exit(1);
});
