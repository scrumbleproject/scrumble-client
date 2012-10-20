
/** User Stories methods **/

//fill the form with data about one user story
function fillForm(response) {
  
	$("#idUserstory").val(response.idUserstory);
	$("#title").val(response.title);
	$("#demonstration").val(response.demonstration);
	$("#estimation").val(response.estimation);
	$("#importance").val(response.importance);
	$("#note").val(response.note);

	//add event on delete-button
	bindDeleteEvent();
  
}


//display all items
function displayAllItems(items){

	if (items.userstory.length>1){ //if more than one user story
		$("#userstories-list").html("");
		$.each(items.userstory, function(i, dico){
			$("#userstories-list").append("<li class='img-polaroid' id='user-story-"+dico.idUserstory+"'>"+
					"<a class='edit' href='story.html?idUserstory="+dico.idUserstory+"'><img class='icon-pencil'/></a>"+
					"<div class='title'>"+ dico.title + "</div>" +
					"<div class='estimation-label'>Days/Person</div><div class='estimation-value'>"+ $.nvl(dico.estimation, "N/A") + "</div>" +
				"</li>");
		});   
	}
	else { //if only one user story
		$("#userstories-list").append("<li class='img-polaroid'>"+items.userstory.title+"</li>");
	}

	//init sortable list
	$( "#userstories-list" ).sortable({
		update: function(event, ui) {
			
			//build a suitable id integer for ajax request
			var toRemove = 'user-story-';
			var idStory = ui.item.attr("id").replace(toRemove,'');
 
			//run ajax request
			$.ajax({
				url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idStory+'/'+ui.item.index(),
				type:"POST",
				success: function(data) {
					console.log('User story : Order saved');
				}
			});	
		}	
	});
    $( "#userstories-list" ).disableSelection();


}


//add an event on delete <button> 
function bindDeleteEvent(){

	$("button.btn-delete").show();
	
	//fetch each <a> delete button
	$("button.btn-delete").live('click', function(e){
		
		//show a confirm box
		e.preventDefault();
        bootbox.confirm("Are you sure to delete this user story ?", function(confirmed) {

			if (confirmed) {             
				$.ajax({
					url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+$("#idUserstory").val(),
					type:"DELETE",
					success: function(data) {
						var box = bootbox.alert("User story deleted successfully.");
							setTimeout(function() {
							box.modal('hide');
							window.location.replace('storyList.html'); //redirect to storyList.html
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
	
	//load left-menu	
	$('#left-menu').load('leftMenu.html', function(response, status, xhr) {
		if (status == "error") {
			var msg = "Sorry leaf-menu cannot be loaded: ";
			bootbox.alert(msg + xhr.status + " " + xhr.statusText);
		}
		else { //if successful
			//select the related option in left-menu
			$("li#left-menu-option-story").addClass("active");
		} 		
	});
	
	//get param idMember in url if exists
    var idUserstory = $(document).getUrlParam("idUserstory");		
	
	//load data on list or on form
    if ( (idUserstory !=="") && (idUserstory !==null)) {
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory,
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
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/all',
            type:'GET',
		    contentType:'application/json; charset=UTF-8',
            success: function(reponse) {
                displayAllItems($.parseJSON(reponse));
            },
		    error:function (xhr, status, error){
			    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
		    },
		    dataType: 'text',
		    converters: 'text json'
	    });	
    }

	//action on #formStory form
	$('#formStory').submit(function() {
		
		//Get #idUserstory field value	
		var idUserstory = $("#idUserstory").val();

		if (idUserstory==null || idUserstory.length==0) {
			//Case 1 : create a new story (idUserstory is empty)
		    $.ajax({
		        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/add',
		        type:"POST",
		        data: JSON.stringify($('#formStory').serializeObject()),
		        dataType: "json",
		        contentType: "application/json; charset=utf-8",
		        success: function(data) {
		                bootbox.alert('User story has been added successfully.');
						window.location.replace('storyList.html'); //redirect to storyList.html
		        },
				error:function (xhr, status, error){
					bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
				}
		    });
		}
		else { //Case 2 : update an existing story (idUserstory is not empty)
			$.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories,
                type:"PUT",
                data: JSON.stringify($('#formStory').serializeObject()),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(data) {
					var box = bootbox.alert("User story has been updated successfully.");
								setTimeout(function() {
								box.modal('hide');
								window.location.replace('storyList.html'); //redirect to storyList.html
							}, 3000);
                },
				error:function (xhr, status, error){
					bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
				}
            });
		}

	    return false;
    });

    
});
