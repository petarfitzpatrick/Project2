const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPosts', mid.requiresSecure, controllers.Post.getPosts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);
  app.post('/updatePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.updatePassword);
  app.get('/getAccountInfo', mid.requiresSecure, mid.requiresLogin, controllers.Account.getAccountInfo);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);
  app.get('/roster', mid.requiresLogin, controllers.Post.rosterPage);
  app.post('/maker', mid.requiresLogin, controllers.Post.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', function(req, res){
    res.render('notFound', { error: 'The page does not exist' });
  });
};

module.exports = router;
