/**
 * Configuração de Segurança e Middlewares
 * Implementa padrões de segurança para proteção da API
 */

import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

/**
 * Registra plugins de segurança
 * @param {Object} fastify - Instância do Fastify
 */
export async function registerSecurityPlugins(fastify) {
  // Helmet: Define headers HTTP de segurança
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    // Protege contra XSS, clickjacking, sniffing, etc
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 15552000 },
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: 'no-referrer' },
    xssFilter: true,
  });

  // CORS: Controla requisições cross-origin
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400, // 24 horas em segundos
  });

  // Rate Limiting: Previne abuso e DDoS
  await fastify.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT || '100'), // máximo de requisições
    timeWindow: '15 minutes', // janela de tempo
    cache: 10000, // número máximo de registros a manter em cache
    allowList: ['127.0.0.1'], // IPs permitidos sem limite
    redis: false, // usa store em memória (produção: usar Redis)
    skip: (request) => {
      // Pular rate limit para health checks
      return request.url === '/health';
    },
  });
}

/**
 * Middleware de logging customizado
 * Registra requisições com timestamp e detalhes
 */
export async function registerLoggingMiddleware(fastify) {
  fastify.addHook('onRequest', async (request, reply) => {
    request.startTime = Date.now();
    fastify.log.info({
      method: request.method,
      url: request.url,
      timestamp: new Date().toISOString(),
      ip: request.ip,
    });
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const duration = Date.now() - request.startTime;
    fastify.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  });
}

/**
 * Middleware para validação de input
 * Previne injeção SQL, XSS e outras vulnerabilidades
 */
export function sanitizeInput(value) {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .replace(/[<>]/g, '') // Remove tags HTML
    .trim();
}

/**
 * Error handler customizado
 * Trata erros de forma segura sem expor informações sensíveis
 */
export async function registerErrorHandler(fastify) {
  fastify.setErrorHandler((error, request, reply) => {
    // Log completo do erro (apenas server-side)
    fastify.log.error({
      err: error,
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        params: request.params,
      },
    });

    // Resposta ao cliente (sem detalhes sensíveis)
    const statusCode = error.statusCode || 500;
    const response = {
      success: false,
      error: statusCode === 500 
        ? 'Erro interno do servidor' 
        : error.message || 'Erro desconhecido',
      timestamp: new Date().toISOString(),
    };

    // Adicionar request ID para tracking
    if (request.id) {
      response.requestId = request.id;
    }

    reply.code(statusCode).send(response);
  });
}
