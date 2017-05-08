let postRenderer;
let postForm;
let PostFormClass;
let PostListClass;

const handlePost = (e) => {

  e.preventDefault();

  $("#postMessage").animate({width:'hide'},350);

  if($("#postName").val() == '' || $("#postContents").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#postForm").attr("action"), $("#postForm").serialize(), function() {
    postRenderer.loadPostsFromServer();
  });

  return false;
};

const renderPost = function() {
  return (
    <form id="postForm"
      onSubmit={this.handleSubmit}
      name="postForm"
      action="/maker"
      method="POST"
      className="postForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="postName" type="text" name="name" placeholder="Post Name"/>
      <p></p>
      <label htmlFor="contents">Contents: </label>
      <textarea id="postContents" rows="10" type="text" name="contents" placeholder="Post Contents"/>
      <p></p>
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <button className="makePostSubmit btn btn-lg" bsStyle="primary" type="submit" value="Make Post" />
    </form>
  );
};

const renderPostList = function() {
  if(this.state.data.length === 0) {
    return (
      <div className="postList">
        <h3 className="emptyPost">No Posts yet</h3>
      </div>
    );
  }
      

  const postNodes = this.state.data.map(function(post) {
    return (
      <div key={post._id} className="post">
        <h3 className="postName"> {post.name} </h3>
        <a className="edit" href={"/edit/" + post._id}>Edit</a>
      </div>
    );
  });

  return (
    <div className="postList">
      {postNodes}
    </div>
  );
};

const setup = function(csrf) {
  PostFormClass = React.createClass({
    handleSubmit: handlePost,
    render: renderPost,
  });

  PostListClass = React.createClass({
    loadPostsFromServer: function() {
      sendAjax('GET', '/getPosts', null, function(data) {
        this.setState({data:data.posts});
      }.bind(this));
    },
    getInitialState: function () {
      return {data: []};
    },
    componentDidMount: function () {
      this.loadPostsFromServer();
    },
    render: renderPostList
  });

  postForm = ReactDOM.render(
    <PostFormClass csrf={csrf} />, document.querySelector("#makePost")
  );

  postRenderer = ReactDOM.render(
    <PostListClass />, document.querySelector("#posts")
  );
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
}

$(document).ready(function() {
  getToken();
});