
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {

  });
}

$(document).ready(function() {
  getToken();
});