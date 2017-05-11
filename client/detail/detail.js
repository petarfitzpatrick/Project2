let EditPassClass;
let formRenderer;
let postId;

const renderPost = function() {
  const postNodes = this.state.data.map(function(post) {
    return (
      <div key={post._id} className="post">
        <h3 className="postName"> {post.name} </h3>
        <h3 className="postContents"> {post.contents} </h3>
      </div>
    );
  });

  return (
    <div id="posts">
        <div className="postList">
          {postNodes}
        </div>
    </div>
  );
};

const setup = function (csrf) {
  postId = document.querySelector('#postId').innerHTML;
  console.log(postId);
  EditPassClass = React.createClass({
    loadAccount: function() {
      sendAjax('GET', '/getPost/' + postId, null, function(data) {
          console.log("Pre");
        let post = [data.post];
          console.log("Post");
        this.setState({data:post})
      }.bind(this));
    },
    getInitialState: function () {
      return {data: []};
    },
    componentDidMount: function () {
      this.loadAccount();
    },
    render: renderPost
  });

  formRenderer = ReactDOM.render(
    <EditPassClass csrf={csrf}/>,
    document.querySelector("#changeForm")
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
