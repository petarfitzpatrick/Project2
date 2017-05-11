const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let PostModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

  contents: {
    type: String,
    required: true,
    default: 'Text',
    trim: true,
  },

  board: {
    type: String,
    required: true,
    default: 'general',
  },
});

PostSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  contents: doc.contents,
  board: doc.board,
});

PostSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PostModel.find(search).select('name contents board').exec(callback);
};

PostSchema.statics.findByBoard = (searchTerm, callback) =>{

   PostModel.find({board: searchTerm}).select('name contents board').exec(callback);
};

PostSchema.statics.findEveryPost = (searchTerm, callback) =>{

   PostModel.find({}).select('name contents board').exec(callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;
