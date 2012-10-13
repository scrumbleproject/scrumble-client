
/** Members methods **/

//fill the form with data about one user
function fillForm(response) {
  $("#idMember").val(response.idMember);
  //$("#idRole").val(response.idRole);
  $("#firstname").val(response.firstname);
  $("#lastname").val(response.lastname);
  $("#login").val(response.login);
  $("#email").val(response.email);
  $("#password").val(response.password);
}


//display all members in a <table><tbody></tbody></table> element
function displayInTable(items){
	if (items.member1.length>1){ //if more than one members
		$("#memberList > tbody").html("");
		$.each(items.member1, function(i, dico){
			$("#memberList > tbody").append("<tr>");
			$("#memberList > tbody").append("<td>"+dico.idMember+"</td>");
			$("#memberList > tbody").append("<td>"+dico.firstname+"</td>");
			$("#memberList > tbody").append("<td>"+dico.lastname+"</td>");
			$("#memberList > tbody").append("<td>"+dico.login+"</td>");
			$("#memberList > tbody").append("<td></td>");
			$("#memberList > tbody").append("<td>"+dico.email+"</td>");
			$("#memberList > tbody").append("<td><a class='btn' href='member.html?idMember="+dico.idMember+"'><i class='icon-pencil'></i></a>" +
          "<a class='btn btn-danger btn-danger btn-delete' href='"+dico.idMember+"'><i class='icon-trash'></i></a></td>");
			$("#usersList > tbody").append("</tr>");
		});   
	}
	else { //if only one member
		$("#memberList > tbody").append("<tr>");
		$("#memberList > tbody").append("<td>"+items.idMember+"</td>");
		$("#memberList > tbody").append("<td>"+items.firstname+"</td>");
		$("#memberList > tbody").append("<td>"+items.lastname+"</td>");
		$("#memberList > tbody").append("<td>"+items.login+"</td>");
		$("#memberList > tbody").append("<td></td>");
		$("#memberList > tbody").append("<td>"+items.email+"</td>");
		$("#memberList > tbody").append("<td></td>");
		$("#memberList > tbody").append("</tr>");
	}
}

		
/** Put here all calls taht you want to launch at the startup **/		
$(document).ready( function() {
	
    var idMember = $(document).getUrlParam("idMember");		
	
    if ( (idMember !=="") && (idMember !==null)) {
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+idMember,
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success: function(reponse) {
                fillForm($.parseJSON(reponse));
            },
	        error:function (xhr, status, error){
		        alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
	        },
            dataType: 'text',
            converters: 'text json'
        });
	                      
    }
	else {
	    $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/all',
            type:'GET',
		    contentType:'application/json; charset=UTF-8',
            success: function(reponse) {
                displayInTable($.parseJSON(reponse));
            },
		    error:function (xhr, status, error){
			    alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
		    },
		    dataType: 'text',
		    converters: 'text json'
	    });	
    }
    
});
