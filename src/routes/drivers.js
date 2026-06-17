/**
 * Rotas dos Pilotos (Drivers)
 * Endpoints para gerenciar e filtrar pilotos de F1
 */

import { drivers } from '../data/drivers.js';

/**
 * Registra todas as rotas de pilotos
 * @param {Object} fastify - Instância do Fastify
 */
export async function driverRoutes(fastify) {
  /**
   * GET /drivers
   * Retorna lista de todos os pilotos com opção de filtros
   * Query params:
   *  - team: filtrar por time
   *  - nationality: filtrar por nacionalidade
   *  - active: filtrar por status ativo (true/false)
   *  - sort: ordenar por (points, name, championships)
   */
  fastify.get('/drivers', async (request, reply) => {
    try {
      const { team, nationality, active, sort } = request.query;
      let filtered = [...drivers];

      // Aplicar filtros
      if (team) {
        filtered = filtered.filter(d => 
          d.team.toLowerCase().includes(team.toLowerCase())
        );
      }

      if (nationality) {
        filtered = filtered.filter(d => 
          d.nationality.toLowerCase().includes(nationality.toLowerCase())
        );
      }

      if (active !== undefined) {
        const activeValue = active === 'true';
        filtered = filtered.filter(d => d.active === activeValue);
      }

      // Aplicar ordenação
      if (sort) {
        switch(sort.toLowerCase()) {
          case 'points':
            filtered.sort((a, b) => b.points - a.points);
            break;
          case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'championships':
            filtered.sort((a, b) => b.championships - a.championships);
            break;
          default:
            break;
        }
      }

      return reply.code(200).send({
        success: true,
        data: filtered,
        count: filtered.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Erro ao buscar pilotos',
        message: error.message
      });
    }
  });

  /**
   * GET /drivers/:id
   * Retorna informações detalhadas de um piloto específico
   */
  fastify.get('/drivers/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const driver = drivers.find(d => d.id === parseInt(id));

      if (!driver) {
        return reply.code(404).send({
          success: false,
          error: 'Piloto não encontrado',
          driverId: id
        });
      }

      return reply.code(200).send({
        success: true,
        data: driver,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Erro ao buscar piloto',
        message: error.message
      });
    }
  });

  /**
   * POST /drivers
   * Cria um novo piloto (com validação de segurança)
   */
  fastify.post('/drivers', async (request, reply) => {
    try {
      const { name, team, nationality, number, points = 0, championships = 0 } = request.body;

      // Validação básica
      if (!name || !team || !nationality || number === undefined) {
        return reply.code(400).send({
          success: false,
          error: 'Campos obrigatórios faltando',
          required: ['name', 'team', 'nationality', 'number']
        });
      }

      // Validar se número já existe
      if (drivers.some(d => d.number === number)) {
        return reply.code(409).send({
          success: false,
          error: 'Número de piloto já existe'
        });
      }

      // Sanitizar entrada
      const newDriver = {
        id: Math.max(...drivers.map(d => d.id), 0) + 1,
        name: String(name).trim(),
        team: String(team).trim(),
        nationality: String(nationality).trim(),
        number: parseInt(number),
        points: Math.max(0, parseInt(points) || 0),
        championships: Math.max(0, parseInt(championships) || 0),
        active: true,
        createdAt: new Date()
      };

      drivers.push(newDriver);

      return reply.code(201).send({
        success: true,
        data: newDriver,
        message: 'Piloto criado com sucesso',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Erro ao criar piloto',
        message: error.message
      });
    }
  });

  /**
   * PUT /drivers/:id
   * Atualiza informações de um piloto
   */
  fastify.put('/drivers/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, team, nationality, points, championships, active } = request.body;
      
      const driverIndex = drivers.findIndex(d => d.id === parseInt(id));

      if (driverIndex === -1) {
        return reply.code(404).send({
          success: false,
          error: 'Piloto não encontrado'
        });
      }

      // Atualizar apenas campos fornecidos
      const driver = drivers[driverIndex];
      if (name !== undefined) driver.name = String(name).trim();
      if (team !== undefined) driver.team = String(team).trim();
      if (nationality !== undefined) driver.nationality = String(nationality).trim();
      if (points !== undefined) driver.points = Math.max(0, parseInt(points) || 0);
      if (championships !== undefined) driver.championships = Math.max(0, parseInt(championships) || 0);
      if (active !== undefined) driver.active = Boolean(active);

      return reply.code(200).send({
        success: true,
        data: driver,
        message: 'Piloto atualizado com sucesso',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Erro ao atualizar piloto',
        message: error.message
      });
    }
  });

  /**
   * DELETE /drivers/:id
   * Remove um piloto
   */
  fastify.delete('/drivers/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const driverIndex = drivers.findIndex(d => d.id === parseInt(id));

      if (driverIndex === -1) {
        return reply.code(404).send({
          success: false,
          error: 'Piloto não encontrado'
        });
      }

      const deletedDriver = drivers.splice(driverIndex, 1);

      return reply.code(200).send({
        success: true,
        data: deletedDriver[0],
        message: 'Piloto removido com sucesso',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Erro ao remover piloto',
        message: error.message
      });
    }
  });

  /**
   * GET /drivers/ranking/points
   * Retorna ranking dos pilotos por pontos
   */
  fastify.get('/drivers/ranking/points', async (request, reply) => {
    try {
      const ranking = [...drivers]
        .filter(d => d.active)
        .sort((a, b) => b.points - a.points)
        .map((driver, index) => ({
          ...driver,
          position: index + 1
        }));

      return reply.code(200).send({
        success: true,
        data: ranking,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Erro ao buscar ranking',
        message: error.message
      });
    }
  });

  /**
   * GET /drivers/teams
   * Retorna lista de times únicos
   */
  fastify.get('/drivers/teams', async (request, reply) => {
    try {
      const teams = [...new Set(drivers.map(d => d.team))].sort();

      return reply.code(200).send({
        success: true,
        data: teams,
        count: teams.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Erro ao buscar times',
        message: error.message
      });
    }
  });
}
