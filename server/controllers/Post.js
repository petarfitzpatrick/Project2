
const models = require('../models');

const Post = models.Post;

const makePost = (req, res) => {
  if (!req.body.name || !req.body.contents) {
    return res.status(400).json({ error: 'Post needs a title and body' });
  }

  const postData = {
    name: req.body.name,
    contents: req.body.contents,
    owner: req.session.account._id,
    board: req.session.board,
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

const getAllPosts = (req, res) => Post.PostModel.findByBoard('general', (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }
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

        // Only 2 editable for now
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
module.exports.getPosts = getPosts;
module.exports.getAllPosts = getAllPosts;
module.exports.make = makePost;
module.exports.detailPost = detailPost;
module.exports.editPost = editPost;
module.exports.getPost = getPost;
module.exports.finishEditPost = finishEditPost;
