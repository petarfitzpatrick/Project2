"use strict";

var EditPassClass = void 0;
var formRenderer = void 0;
var postId = void 0;

var renderPost = function renderPost() {
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
        "div",
        { className: "board" },
        "Board: ",
        post.board,
        " "
      )
    );
  });

  return React.createElement(
    "div",
    { id: "posts" },
    React.createElement(
      "div",
      { className: "postList" },
      postNodes
    )
  );
};

var setup = function setup(csrf) {
  postId = document.querySelector('#postId').innerHTML;
  console.log(postId);
  EditPassClass = React.createClass({
    displayName: "EditPassClass",

    loadAccount: function loadAccount() {
      sendAjax('GET', '/getPost/' + postId, null, function (data) {
        console.log("Pre");
        var post = [data.post];
        console.log("Post");
        this.setState({ data: post });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return { data: [] };
    },
    componentDidMount: function componentDidMount() {
      this.loadAccount();
    },
    render: renderPost
  });

  formRenderer = ReactDOM.render(React.createElement(EditPassClass, { csrf: csrf }), document.querySelector("#changeForm"));
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
