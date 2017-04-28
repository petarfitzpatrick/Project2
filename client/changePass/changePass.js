let EditPassClass;
let formRenderer;

const handleEdit = function (e) {
  e.preventDefault();

  if ($("#accountName").val() == '' || $("#currentPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    console.log("All fields are required")
    return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
    return false;
  }

  sendAjax('POST', $("#accountForm").attr("action"), $("#accountForm").serialize(), function() {
    window.location.reload();
  });

  return false;
};

const renderEditForm = function () {
  const renderFormData = this.state.data.map(function(account) {
    return (
      <div key={account._id} className="account">
        <input id="accountName" type="text" name="username" defaultValue={account.username} placeholder="Username"/>
        <input id="currentPass" type="password" name="currentPass" placeholder="Current Password"/>
        <input id="newPass" type="password" name="newPass" placeholder="New Password"/>
        <input id="newPass2" type="password" name="newPass2" placeholder="Retype New Password"/>
        <input className="formSubmit" type="submit" value="Save" />
      </div>
    );
  });

  return (
    <form id="accountForm"
      onSubmit={this.handleSubmit}
      name="accountForm"
      method="POST"
      action="/updatePassword"
      className="accountForm"
    >
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      {renderFormData}
    </form>
  );
};

const setup = function (csrf) {
  EditPassClass = React.createClass({
    handleSubmit: handleEdit,
    loadAccount: function() {
      sendAjax('GET', '/getAccountInfo', null, function(data) {
        let account = [data.account];
        this.setState({data:account})
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
