let postRenderer;
let postForm;
let PostFormClass;
let PostListClass;

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
        <a className="edit" href={"/detail/" + post._id}>View</a>
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

  PostListClass = React.createClass({
    loadPostsFromServer: function() {
      sendAjax('GET', '/getAllPosts', null, function(data) {
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