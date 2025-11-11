/**
 * Middleware para verificar se o usuário está autenticado
 * Se não estiver logado, redireciona para /login
 */
module.exports = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Você precisa estar logado para acessar esta página');
    return res.redirect('/login');
  }
  next();
};
