
/** Tasks methods **/

//fill the form with data about one member
function fillForm(response) {
  $("#idMember").val(response.idMember);
  //$("#idRole").val(response.idRole);
  $("#firstname").val(response.firstname);
  $("#lastname").val(response.lastname);
  $("#login").val(response.login);
  $("#email").val(response.email);
  $("#password").val(response.password);
}
