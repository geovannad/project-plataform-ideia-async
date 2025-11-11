const { Response, Idea, User } = require('../models');
const { Op, sequelize } = require('sequelize');

module.exports = {
  // Votar em uma ideia
  async vote(req, res) {
    try {
      const { ideaId } = req.params;
      const userId = req.session.user.id;

      // Verificar se a ideia existe
      const idea = await Idea.findByPk(ideaId);
      if (!idea) {
        req.flash('error', 'Ideia não encontrada');
        return res.redirect('/');
      }

      // Verificar se o usuário já votou nessa ideia
      const existingVote = await Response.findOne({
        where: {
          id_user: userId,
          id_ideia: ideaId,
          voted: true
        },
      });

      if (existingVote) {
        req.flash('error', 'Você já votou nessa ideia');
        return res.redirect(`/ideas/${ideaId}`);
      }

      // Criar o voto
      await Response.create({
        id_user: userId,
        id_ideia: ideaId,
        voted: true,
        created_date: new Date(),
      });

      req.flash('success', 'Voto registrado com sucesso!');
      res.redirect(`/ideas/${ideaId}`);
    } catch (error) {
      console.error('Erro ao votar:', error);
      req.flash('error', 'Erro ao registrar voto');
      res.redirect('/');
    }
  },

  // Remover voto
  async removeVote(req, res) {
    try {
      const { ideaId } = req.params;
      const userId = req.session.user.id;

      const vote = await Response.findOne({
        where: {
          id_user: userId,
          id_ideia: ideaId,
          voted: true
        },
      });

      if (!vote) {
        req.flash('error', 'Voto não encontrado');
        return res.redirect(`/ideas/${ideaId}`);
      }

      await vote.destroy();
      req.flash('success', 'Voto removido com sucesso');
      res.redirect(`/ideas/${ideaId}`);
    } catch (error) {
      console.error('Erro ao remover voto:', error);
      req.flash('error', 'Erro ao remover voto');
      res.redirect('/');
    }
  },

  // Obter contagem de votos para uma ideia
  async getVoteCount(ideaId) {
    try {
      const count = await Response.count({
        where: { 
          id_ideia: ideaId,
          voted: true
        },
      });
      return count;
    } catch (error) {
      console.error('Erro ao contar votos:', error);
      return 0;
    }
  },

  // Verificar se usuário votou em uma ideia
  async hasUserVoted(userId, ideaId) {
    try {
      const vote = await Response.findOne({
        where: {
          id_user: userId,
          id_ideia: ideaId,
          voted: true
        },
      });
      return !!vote;
    } catch (error) {
      console.error('Erro ao verificar voto:', error);
      return false;
    }
  },

  // Listar ideias ordenadas por votos (agregação)
  async getIdeasWithVotes(limit = null) {
    try {
      const ideas = await Idea.findAll({
        attributes: [
          'id',
          'title',
          'description',
          'category',
          'id_category',
          'id_user',
          'created_date',
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "Response" WHERE "Response"."id_ideia" = "Idea"."id" AND "Response"."voted" = true)`
            ),
            'voteCount',
          ],
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
            foreignKey: 'id_user',
          },
        ],
        order: [[sequelize.literal('voteCount'), 'DESC']],
        limit: limit,
        raw: false,
      });

      return ideas;
    } catch (error) {
      console.error('Erro ao buscar ideias com votos:', error);
      return [];
    }
  },
};
