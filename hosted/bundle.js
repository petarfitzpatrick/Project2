"use strict";

var postRenderer = void 0;
var postForm = void 0;
var PostFormClass = void 0;
var PostListClass = void 0;

var handlePost = function handlePost(e) {

  e.preventDefault();

  $("#postMessage").animate({ width: 'hide' }, 350);

  if ($("#postName").val() == '' || $("#postContents").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function () {
    postRenderer.loadPostsFromServer();
  });

  return false;
};

var renderPost = function renderPost() {
  return React.createElement(
    "form",
    { id: "postForm",
      onSubmit: this.handleSubmit,
      name: "postForm",
      action: "/maker",
      method: "POST",
      className: "postForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "postName", type: "text", name: "name", placeholder: "Post Name" }),
    React.createElement("p", null),
    React.createElement(
      "label",
      { htmlFor: "contents" },
      "Contents: "
    ),
    React.createElement("input", { id: "postContents", type: "text", name: "contents", placeholder: "Post Contents" }),
    React.createElement("p", null),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "makePostSubmit", type: "submit", value: "Make Post" })
  );
};

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
        " Name: ",
        post.name,
        " "
      ),
      React.createElement(
        "h3",
        { className: "postContents" },
        " Body: ",
        post.contents,
        " "
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
  PostFormClass = React.createClass({
    displayName: "PostFormClass",

    handleSubmit: handlePost,
    render: renderPost
  });

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

  postForm = ReactDOM.render(React.createElement(PostFormClass, { csrf: csrf }), document.querySelector("#makePost"));

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
