let EditPassClass;
let formRenderer;
let postId;

const handleEdit = function (e) {
  e.preventDefault();

  var action = $("#postForm").attr("action") + "/" + postId;
  console.log(action);
    
  sendAjax('POST', action, $("#postForm").serialize(), function() {
    window.location.reload();
  });

  return false;
};

const renderEditForm = function () {
    //Please look at what you did for changepass in p2
    //Create a similar renderform here
    //Then similar to account, create a post in posts (lol)
    const editForm = this.state.data.map(function(post){
  return (
      <div>
      <label htmlFor="name">Name:</label>
      <textarea id="postName" type="text" rows="1" name="name" placeholder="Post Name">{post.name}</textarea>
      <p></p>
      <label htmlFor="contents">Contents: </label>
      <textarea id="postContents" rows="10" type="text" name="contents" placeholder="Post Contents">{post.contents}</textarea>
      <p></p>
      <button className="makePostSubmit btn btn-lg" type="submit" value="Make Post">Make Post</button>
      </div>
  );
});
    
    
return(
<div>
      <form id="postForm"
      onSubmit={this.handleSubmit}
      name="postForm"
      method="POST"
      action="/editPost"
      className="postForm"
    >
        <input type="hidden" name="_csrf" value={this.props.csrf}/>
        {editForm}
    </form>
</div>

    );
};

const setup = function (csrf) {
  postId = document.querySelector('#postId').innerHTML;
  console.log(postId);
  EditPassClass = React.createClass({
    handleSubmit: handleEdit,
    loadAccount: function() {
      console.log(postId);
        /*sendAjax('GET', '/getAccountInfo', null, function(data) {
        let account = [data.account];
        this.setState({data:account})
      }.bind(this));*/
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
    render: renderEditForm
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
