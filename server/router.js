const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPosts', mid.requiresSecure, controllers.Post.getPosts);
  app.get('/getAllPosts', mid.requiresSecure, controllers.Post.getAllPosts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);
  app.post('/updatePassword', mid.requiresSecure, mid.requiresLogin,
           controllers.Account.updatePassword);
  app.get('/getAccountInfo', mid.requiresSecure, mid.requiresLogin,
          controllers.Account.getAccountInfo);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);
  app.get('/roster', mid.requiresLogin, controllers.Post.rosterPage);
  app.get('/search/:term', mid.requiresLogin, controllers.Post.searchPage);
  app.get('/searchPosts/:term', mid.requiresSecure, controllers.Post.searchAllPosts);
  app.get('/private', mid.requiresLogin, controllers.Post.privatePage);
  app.post('/maker', mid.requiresLogin, controllers.Post.make);
  app.get('/detail/:id', mid.requiresSecure, controllers.Post.detailPost);
  app.get('/edit/:id', mid.requiresSecure, controllers.Post.editPost);
  app.post('/editPost/:id', mid.requiresSecure, controllers.Post.finishEditPost);
  app.get('/getPost/:id', mid.requiresSecure, controllers.Post.getPost);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', (req, res) => {
    res.render('notFound', { error: 'The page does not exist' });
  });
};

module.exports = router;
