"use strict";

var postRenderer = void 0;
var postForm = void 0;
var PostFormClass = void 0;
var PostListClass = void 0;

var renderPostList = function renderPostList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "postList" },
      React.createElement(
        "h3",
        { className: "emptyPost" },
        "No Posts yet"
      )
    );
  }

  var postNodes = this.state.data.map(function (post) {
    return React.createElement(
      "div",
      { key: post._id, className: "post" },
      React.createElement(
        "h3",
        { className: "postName" },
        " ",
        post.name,
        " "
      ),
      React.createElement(
        "h3",
        { className: "postContents" },
        " ",
        post.contents,
        " "
      ),
      React.createElement(
        "a",
        { className: "edit", href: "/edit/" + post._id },
        "Edit"
      )
    );
  });

  return React.createElement(
    "div",
    { className: "postList" },
    postNodes
  );
};

var setup = function setup(csrf) {

  PostListClass = React.createClass({
    displayName: "PostListClass",

    loadPostsFromServer: function loadPostsFromServer() {
      sendAjax('GET', '/getPosts', null, function (data) {
        this.setState({ data: data.posts });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return { data: [] };
    },
    componentDidMount: function componentDidMount() {
      this.loadPostsFromServer();
    },
    render: renderPostList
  });

  postRenderer = ReactDOM.render(React.createElement(PostListClass, null), document.querySelector("#posts"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#postMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#postMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
