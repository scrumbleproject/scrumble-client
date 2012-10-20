
/** Projects methods **/

//fill the form with data about one project
function fillForm(response) {
  $("#idProject").val(response.idProject);
  $("#title").val(response.title);
  $("#description").val(response.description);
}


//display all items
function displayAllItems(items){

	if (items.project.length>1){ //if more than one project
		$("#projects-list").html("");
		$.each(items.project, function(i, dico){
		
		
			$("#projects-list").append("<li class='span3'><div class='thumbnail'><img alt='' src='http://placehold.it/300x200'><div class='caption'><a href='settings.html?idProject=" + dico.idProject +"'><h3>"+ dico.title + "</h3></a>"+
					"<p>" + dico.description + "</p> </div> </div> </li>" 
					
					);
		});   
	}
	else { //if only one project
		$("#projects-list").append("<li c class='span3'><div class='thumbnail'><img alt='' src='http://placehold.it/300x200'><div class='caption'><a href='settings.html?idProject=" + items.project.idProject +"'><h3>"+items.project.title+"</h3></a><p>" + items.project.description +"</p></div> </div></li>");
	}

}


//add an event on <a> delete button
function bindDeleteEvent(){
	
	//fetch each <a> delete button
	$("a.btn-delete").each( function(){
		
		//get a reference on the current fetched element
		$btn = $(this);

		//add event on click on this button
		$btn.live('click', function(e){
		
			//show a confirm box
			e.preventDefault();
            bootbox.confirm("Are you sure to delete this project ?", function(confirmed) {

				if (confirmed) {             
					$.ajax({
						//url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+$btn.attr("href"),
						type:"DELETE",
						success: function(data) {
							bootbox.alert("Project deleted successfully.");
							location.reload(); //reload page
						}
					});
				}	

            });
			
		});	

	});
}

		
/** Put here all calls that you want to launch at the page startup **/		
$(document).ready( function() {
	
	//load left-menu	
	$('#left-menu').load('leftMenu.html', function(response, status, xhr) {
		if (status == "error") {
			var msg = "Sorry leaf-menu cannot be loaded: ";
			bootbox.alert(msg + xhr.status + " " + xhr.statusText);
		}
		else { //if successful
			//select the related option in left-menu
			$("li#left-menu-option-project").addClass("active");
		} 		
	});
	

	//get param idMember in url if exists
    var idProject = $(document).getUrlParam("idProject");		

	//load all items
	$.ajax({
        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/all',
        type:'GET',
	    contentType:'application/json; charset=UTF-8',
        success: function(reponse) {
            displayAllItems($.parseJSON(reponse));
			bindDeleteEvent();
        },
	    error:function (xhr, status, error){
		    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
	    },
	    dataType: 'text',
	    converters: 'text json'
    });	
    
});


	//action on #formUser form
	$('#formProject').submit(function() {
		
		//Get #idMember field value	
		var idProject = $("#idProject").val();

		if (idProject==null || idProject.length==0) {
			//Case 1 : create a project (idProject is empty)
		    $.ajax({
		        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/add',
		        type:"POST",
		        data: JSON.stringify($('#formProject').serializeObject()),
		        dataType: "json",
		        contentType: "application/json; charset=utf-8",
		        success: function(data) {
		                bootbox.alert('Project has been added successfully.');
						window.location.replace('projectsList.html'); //redirect to memberList.html
		        },
				error:function (xhr, status, error){
					bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
				}
		    });
		}
		else { //Case 2 : update an existing member (idMember is not empty)
			$.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects,
                type:"PUT",
                data: JSON.stringify($('#formProject').serializeObject()),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    bootbox.alert("Project has been updated successfully.");
					window.location.replace('projectsList.html'); //redirect to projectList.html
                }
            });
		}

	    return false;
    });
