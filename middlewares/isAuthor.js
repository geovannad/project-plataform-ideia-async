/**
 * Middleware para verificar se o usuário é o autor da ideia
 * Se não for, retorna erro 403 Forbidden
 */
const { Idea, User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const ideaId = req.params.id;
    const userId = req.session.user.id;

    const idea = await Idea.findByPk(ideaId);

    if (!idea) {
      req.flash('error', 'Ideia não encontrada');
      return res.redirect('/');
    }

    // Converter para string para garantir comparação correta
    if (idea.id_user.toString() !== userId.toString()) {
      req.flash('error', 'Você não tem permissão para realizar esta ação');
      return res.status(403).redirect('/');
    }

    next();
  } catch (error) {
    console.error('Erro no middleware isAuthor:', error);
    req.flash('error', 'Erro ao verificar autorização');
    res.redirect('/');
  }
};
