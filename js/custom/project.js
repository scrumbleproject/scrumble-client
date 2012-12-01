
/** Projects methods **/

//fill the form with data about one project
function fillForm(response) {
  $("#idProject").val(response.idProject);
  $("#title").val(response.title);
  $("#description").val(response.description);
}
	//add event on delete-button
	bindDeleteEvent();

//display all items
function displayAllItems(items){

	if (items.project.length>1){ //if more than one project
		$("#projects-list").html("");
		$.each(items.project, function(i, dico){
		
		
			$("#projects-list").append("<li class='span3'><div class='thumbnail'><img alt='' src='http://placehold.it/300x200'><div class='caption'><a href='dashboardProject.html?project=" + dico.idProject +"'><h3>"+ dico.title + "</h3></a>"+
					"<p>" + dico.description + "</p> </div> </div> </li>" 
					
					);
		});   
	}
	else { //if only one project
		$("#projects-list").append("<li c class='span3'><div class='thumbnail'><img alt='' src='http://placehold.it/300x200'><div class='caption'><a href='dashboardProject.html?project=" + items.project.idProject +"'><h3>"+items.project.title+"</h3></a><p>" + items.project.description +"</p></div> </div></li>");
	}

}


//add an event on <a> delete button
function bindDeleteEvent(){
	
	$("button.btn-delete").show();
	
	//fetch each <a> delete button
	$("button.btn-delete").live('click', function(e){
		
		//show a confirm box
		e.preventDefault();
        bootbox.confirm("Are you sure to delete this user project ?", function(confirmed) {

			if (confirmed) {             
				$.ajax({
					url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+$("#idProject").val(),
					type:"DELETE",
					success: function(data) {
						var box = bootbox.alert("Project deleted successfully.");
							setTimeout(function() {
							box.modal('hide');
							window.location.replace('projectsList.html'); //redirect to storyList.html
						}, 3000); 
					},
					error:function (xhr, status, error){
						bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
					}
				});
			}	

        });

	});
}


		
/** Put here all calls that you want to launch at the page startup **/		
$(document).ready( function() {
	
	//get param idProject in url if exists
    var idProject = $(document).getUrlParam("project");

	//load data on list or on form
    if ( (idProject !=="") && (idProject !==null)) {

        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject,
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success: function(reponse) {
                fillForm($.parseJSON(reponse));
            },
	        error:function (xhr, status, error){
		        bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
	        },
            dataType: 'text',
            converters: 'text json'
        });
	                      
    }
	else {

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
    }


	//action on #formProject form
	$('#formProject').submit(function() {
		
		//Get #idProject field value	
		var idProject = $("#idProject").val();

		if (idProject==null && idProject.length==0) {
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
		else { //Case 2 : update an existing member (idProject is not empty)
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
    
});
