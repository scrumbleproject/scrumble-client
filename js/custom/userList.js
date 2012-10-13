
/** Members methods **/


//display all members in a <table><tbody></tbody></table> element
function afficherListe(items){
	if (items.member1.length>1){ //if more than one members
		$("#usersList > tbody").html("");
		$.each(items.member1, function(i, dico){
			$("#usersList > tbody").append("<tr>");
			$("#usersList > tbody").append("<td>"+dico.idMember+"</td>");
			$("#usersList > tbody").append("<td>"+dico.firstname+"</td>");
			$("#usersList > tbody").append("<td>"+dico.lastname+"</td>");
			$("#usersList > tbody").append("<td>"+dico.login+"</td>");
			$("#usersList > tbody").append("<td></td>");
			$("#usersList > tbody").append("<td>"+dico.email+"</td>");
			$("#usersList > tbody").append("<td><a class='btn' href='user.html'><i class='icon-pencil'></i></a>" +
          "<a class='btn btn-danger btn-danger btn-delete' href='"+dico.idMember+"'><i class='icon-trash'></i></a></td>");
			$("#usersList > tbody").append("</tr>");
		});   
	}
	else { //if only one member
		$("#usersList > tbody").append("<tr>");
		$("#usersList > tbody").append("<td>"+items.idMember+"</td>");
		$("#usersList > tbody").append("<td>"+items.firstname+"</td>");
		$("#usersList > tbody").append("<td>"+items.lastname+"</td>");
		$("#usersList > tbody").append("<td>"+items.login+"</td>");
		$("#usersList > tbody").append("<td></td>");
		$("#usersList > tbody").append("<td>"+items.email+"</td>");
		$("#usersList > tbody").append("<td></td>");
		$("#usersList > tbody").append("</tr>");
	}
}


/** Put all call here that you want to launch at the startup page **/
$(document).ready( function() {
			
	//call ajax request to display all users
	$.ajax({
        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/all',
        type:'GET',
		contentType:'application/json; charset=UTF-8',
        success: function(reponse) {
            afficherListe($.parseJSON(reponse));
        },
		error:function (xhr, status, error){
			alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
		},
		dataType: 'text',
		converters: 'text json'
	});

		

});