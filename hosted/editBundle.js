"use strict";

var EditPassClass = void 0;
var formRenderer = void 0;
var postId = void 0;

var handleEdit = function handleEdit(e) {
  e.preventDefault();

  var action = $("#postForm").attr("action") + "/" + postId;
  console.log(action);

  sendAjax('POST', action, $("#postForm").serialize(), function () {
    window.location.reload();
  });

  return false;
};

var renderEditForm = function renderEditForm() {
  var editForm = this.state.data.map(function (post) {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "label",
        { htmlFor: "name" },
        "Name:"
      ),
      React.createElement(
        "textarea",
        { id: "postName", type: "text", rows: "1", name: "name", placeholder: "Post Name" },
        post.name
      ),
      React.createElement("p", null),
      React.createElement(
        "label",
        { htmlFor: "contents" },
        "Contents: "
      ),
      React.createElement(
        "textarea",
        { id: "postContents", rows: "10", type: "text", name: "contents", placeholder: "Post Contents" },
        post.contents
      ),
      React.createElement("p", null),
      React.createElement(
        "button",
        { className: "makePostSubmit btn btn-lg", type: "submit", value: "Make Post" },
        "Save"
      )
    );
  });

  return React.createElement(
    "div",
    null,
    React.createElement(
      "form",
      { id: "postForm",
        onSubmit: this.handleSubmit,
        name: "postForm",
        method: "POST",
        action: "/editPost",
        className: "postForm"
      },
      React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
      editForm
    )
  );
};

var setup = function setup(csrf) {
  postId = document.querySelector('#postId').innerHTML;
  console.log(postId);
  EditPassClass = React.createClass({
    displayName: "EditPassClass",

    handleSubmit: handleEdit,
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
    render: renderEditForm
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
