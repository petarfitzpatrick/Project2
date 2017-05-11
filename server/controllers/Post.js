
const models = require('../models');

const Post = models.Post;

const makePost = (req, res) => {
  if (!req.body.name || !req.body.contents) {
    return res.status(400).json({ error: 'Post needs a title and body' });
  }
    
    
  const postData = {
    name: req.body.name[0],
    contents: req.body.contents,
    owner: req.session.account._id,
    board: req.body.name[1],
  };

  const newPost = new Post.PostModel(postData);

  const postPromise = newPost.save();

  postPromise.then(() => res.json({ redirect: '/maker' }));

  postPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return postPromise;
};

const makerPage = (req, res) => {
  Post.PostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), posts: docs });
  });
};

const rosterPage = (req, res) => res.render('roster', { csrfToken: req.csrfToken() });

const searchPage = (req, res) => {
    console.log(req.params.term);
    res.render('search', { csrfToken: req.csrfToken(), term: req.params.term});
}

const getAllPosts = (req, res) => Post.PostModel.findEveryPost('general', (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }
  return res.json({ posts: docs });
});

const searchAllPosts = (req, res) => Post.PostModel.findByBoard(req.params.term, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }
    console.log(req.params.term);
  return res.json({ posts: docs });
});

const privatePage = (req, res) => res.render('private', { csrfToken: req.csrfToken() });

const getPosts = (request, response) => {
  const req = request;
  const res = response;

  return Post.PostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ posts: docs });
  });
};

const detailPost = (request, response) => {
  Post.PostModel.findById(request.params.id, (err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occured' });
    }

    return response.render('detailPage', { csrfToken: request.csrfToken(), post: docs });
  });
};

const editPost = (request, response) => {
  Post.PostModel.findById(request.params.id, (err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occured' });
    }

    return response.render('editPage', { csrfToken: request.csrfToken(), post: docs });
  });
};

const getPost = (request, response) => {
  Post.PostModel.findById(request.params.id, (err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occured' });
    }

    return response.json({ post: docs });
  });
};

const finishEditPost = (request, response) =>
Post.PostModel.findById(request.params.id, (err, docs) => {
  if (err) {
    return response.status(400).json({ error: 'Error!' });
  }

  const updatedPost = docs;

  updatedPost.name = request.body.name;
  updatedPost.contents = request.body.contents;

  const savePromise = updatedPost.save();

  savePromise.then(() => response.json({
    name: updatedPost.name,
    contents: updatedPost.contents,
  }));
  savePromise.catch((saveErr) => response.json({ saveErr }));

  return response.json({ docs });
});

module.exports.makerPage = makerPage;
module.exports.rosterPage = rosterPage;
module.exports.privatePage = privatePage;
module.exports.searchPage = searchPage;
module.exports.getPosts = getPosts;
module.exports.getAllPosts = getAllPosts;
module.exports.searchAllPosts = searchAllPosts;
module.exports.make = makePost;
module.exports.detailPost = detailPost;
module.exports.editPost = editPost;
module.exports.getPost = getPost;
module.exports.finishEditPost = finishEditPost;
