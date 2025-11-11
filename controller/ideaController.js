const { Idea, User, Category, Vote, sequelize } = require('../models');
const { body, validationResult } = require('express-validator');

module.exports = {
  // Lista todas as ideias com contagem de votos
  async listIdeas(req, res) {
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
              `(SELECT COUNT(*) FROM vote WHERE vote.id_idea = "Idea"."id")`
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
          {
            model: Category,
            attributes: ['id', 'name'],
            foreignKey: 'id_category',
          },
        ],
        order: [[sequelize.literal('"voteCount"'), 'DESC']],
        raw: false,
      });

      // Se o usuário está logado, verificar em quais ideias ele votou
      let userVotes = [];
      if (req.session.user) {
        const votes = await Vote.findAll({
          where: { id_user: req.session.user.id },
          attributes: ['id_idea'],
          raw: true,
        });
        userVotes = votes.map(v => v.id_idea);
      }

      res.render('home', {
        ideas,
        userVotes,
        loggedUser: req.session.user || null,
      });
    } catch (error) {
      console.error('Erro ao listar ideias:', error);
      res.render('home', {
        ideas: [],
        userVotes: [],
        error: 'Erro ao carregar ideias',
      });
    }
  },

  // Renderizar página de criar ideia
  async showCreateForm(req, res) {
    try {
      const categories = await Category.findAll({
        attributes: ['id', 'name'],
        raw: true,
      });

      res.render('ideas/create', { categories });
    } catch (error) {
      console.error('Erro ao carregar formulário:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/');
    }
  },

  // Criar nova ideia
  async createIdea(req, res) {
    try {
      // Validar dados
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const categories = await Category.findAll({
          attributes: ['id', 'name'],
          raw: true,
        });
        return res.render('ideas/create', {
          errors: errors.array(),
          categories,
          formData: req.body,
        });
      }

      const { title, description, id_category } = req.body;
      const userId = req.session.user.id;

      const idea = await Idea.create({
        title: title.trim(),
        description: description.trim(),
        id_category: id_category || null,
        id_user: userId,
        created_date: new Date(),
      });

      req.flash('success', 'Ideia criada com sucesso!');
      res.redirect(`/ideas/${idea.id}`);
    } catch (error) {
      console.error('Erro ao criar ideia:', error);
      req.flash('error', 'Erro ao criar ideia');
      res.redirect('/ideas/create');
    }
  },

  // Ver detalhes da ideia
  async showIdea(req, res) {
    try {
      const { id } = req.params;

      const idea = await Idea.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
            foreignKey: 'id_user',
          },
          {
            model: Category,
            attributes: ['id', 'name'],
            foreignKey: 'id_category',
          },
        ],
        raw: false,
      });

      if (!idea) {
        req.flash('error', 'Ideia não encontrada');
        return res.redirect('/');
      }

      // Contar votos
      const voteCount = await Vote.count({
        where: { id_idea: id },
      });

      // Verificar se o usuário votou
      let hasVoted = false;
      if (req.session.user) {
        hasVoted = !!(await Vote.findOne({
          where: {
            id_user: req.session.user.id,
            id_idea: id,
          },
        }));
      }

      res.render('ideas/show', {
        idea: idea.toJSON(),
        voteCount,
        hasVoted,
        isAuthor: req.session.user && req.session.user.id === idea.id_user,
      });
    } catch (error) {
      console.error('Erro ao exibir ideia:', error);
      req.flash('error', 'Erro ao carregar ideia');
      res.redirect('/');
    }
  },

  // Renderizar página de edição
  async showEditForm(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.user.id;

      const idea = await Idea.findByPk(id);

      if (!idea) {
        req.flash('error', 'Ideia não encontrada');
        return res.redirect('/');
      }

      if (idea.id_user !== userId) {
        req.flash('error', 'Você não tem permissão para editar esta ideia');
        return res.redirect('/');
      }

      const categories = await Category.findAll({
        attributes: ['id', 'name'],
        raw: true,
      });

      res.render('ideas/edit', {
        idea: idea.toJSON(),
        categories,
      });
    } catch (error) {
      console.error('Erro ao carregar formulário de edição:', error);
      req.flash('error', 'Erro ao carregar formulário');
      res.redirect('/');
    }
  },

  // Atualizar ideia
  async updateIdea(req, res) {
    try {
      const { id } = req.params;
      const { title, description, id_category } = req.body;
      const userId = req.session.user.id;

      // Validar dados
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const categories = await Category.findAll({
          attributes: ['id', 'name'],
          raw: true,
        });
        return res.render('ideas/edit', {
          errors: errors.array(),
          categories,
          idea: { id, title, description, id_category },
        });
      }

      const idea = await Idea.findByPk(id);

      if (!idea) {
        req.flash('error', 'Ideia não encontrada');
        return res.redirect('/');
      }

      if (idea.id_user !== userId) {
        req.flash('error', 'Você não tem permissão para editar esta ideia');
        return res.redirect('/');
      }

      await idea.update({
        title: title.trim(),
        description: description.trim(),
        id_category: id_category || null,
      });

      req.flash('success', 'Ideia atualizada com sucesso!');
      res.redirect(`/ideas/${idea.id}`);
    } catch (error) {
      console.error('Erro ao atualizar ideia:', error);
      req.flash('error', 'Erro ao atualizar ideia');
      res.redirect(`/ideas/${req.params.id}/edit`);
    }
  },

  // Deletar ideia
  async deleteIdea(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.user.id;

      const idea = await Idea.findByPk(id);

      if (!idea) {
        req.flash('error', 'Ideia não encontrada');
        return res.redirect('/');
      }

      if (idea.id_user !== userId) {
        req.flash('error', 'Você não tem permissão para deletar esta ideia');
        return res.redirect('/');
      }

      // Deletar votos associados
      await Vote.destroy({
        where: { id_idea: id },
      });

      await idea.destroy();

      req.flash('success', 'Ideia deletada com sucesso!');
      res.redirect('/');
    } catch (error) {
      console.error('Erro ao deletar ideia:', error);
      req.flash('error', 'Erro ao deletar ideia');
      res.redirect(`/ideas/${req.params.id}`);
    }
  },

  // Listar ideias do usuário logado (perfil)
  async getUserIdeas(req, res) {
    try {
      const userId = req.session.user.id;

      const ideas = await Idea.findAll({
        where: { id_user: userId },
        attributes: [
          'id',
          'title',
          'description',
          'category',
          'id_category',
          'created_date',
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM vote WHERE vote.id_idea = "Idea"."id")`
            ),
            'voteCount',
          ],
        ],
        include: [
          {
            model: Category,
            attributes: ['id', 'name'],
            foreignKey: 'id_category',
          },
        ],
        order: [['created_date', 'DESC']],
        raw: false,
      });

      res.render('profile', {
        user: req.session.user,
        ideas,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      req.flash('error', 'Erro ao carregar perfil');
      res.redirect('/');
    }
  },
}
