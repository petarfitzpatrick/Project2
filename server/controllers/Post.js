
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

const rosterPage = (req, res) => {
  Post.PostModel.findByBoard('general', (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    console.log(docs);
    return res.render('roster', { csrfToken: req.csrfToken(), posts: docs });
  });
};

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

module.exports.makerPage = makerPage;
module.exports.rosterPage = rosterPage;
module.exports.getPosts = getPosts;
module.exports.make = makePost;
