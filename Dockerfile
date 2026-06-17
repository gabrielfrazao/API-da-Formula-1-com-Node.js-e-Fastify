# Dockerfile para F1 API
# Build: docker build -t f1-api .
# Run: docker run -p 3000:3000 f1-api

# ===== STAGE 1: Build =====
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências de produção apenas
RUN npm ci --only=production

# ===== STAGE 2: Runtime =====
FROM node:18-alpine

# Metadados da imagem
LABEL maintainer="Seu Nome <seu-email@example.com>"
LABEL description="API Minimal de Fórmula 1 com Fastify"
LABEL version="1.0.0"

# Definir diretório de trabalho
WORKDIR /app

# Criar usuário não-root por segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S fastify -u 1001

# Copiar node_modules do builder
COPY --from=builder --chown=fastify:nodejs /app/node_modules ./node_modules

# Copiar código da aplicação
COPY --chown=fastify:nodejs . .

# Trocar para usuário não-root
USER fastify

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Iniciar aplicação
CMD ["node", "src/index.js"]
