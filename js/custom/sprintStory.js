
/** User Stories methods **/

//fill the form with data about one user story
function fillForm(response) {
  
	$("#idUserstory").val(response.idUserstory);
	$("#idSprint").val(response.idSprint);
	$("#title").val(response.title);
	$("#demonstration").val(response.demonstration);
	$("#estimation").val(response.estimation);
	$("#importance").val(response.importance);
	$("#note").val(response.note);
}


//display all items
function displayAllItems(items){

	if (items.userstory.length>1){ //if more than one user story
		$("#userstories-list").html("");
		$.each(items.userstory, function(i, dico){
			$("#userstories-list").append("<li class='img-polaroid' id='user-story-"+dico.idUserstory+"'>"+
					"<a class='edit' href='story.html?userstory="+dico.idUserstory+"&project="+dico.idProject.idProject+"'><img class='icon-pencil'/></a>"+
					"<div class='title'>"+ dico.title + "</div>" +
					"<div class='estimation-label'>Days/Person</div><div class='estimation-value'>"+ $.nvl(dico.estimation, "N/A") + "</div>" +
				"</li>");
		});   
	}
	else { //if only one user story
		$("#userstories-list").append("<li class='img-polaroid'>"+items.userstory.title+"</li>");
	}


}



	
