function ensureAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/auth/login');
}

function ensureGuest(req, res, next) {
  if (!req.session.userId) {
    return next();
  }
  res.redirect('/');
}

module.exports = {
  ensureAuthenticated,
  ensureGuest
};