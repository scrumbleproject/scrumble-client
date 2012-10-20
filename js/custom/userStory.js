
/** User Stories methods **/

//fill the form with data about one user story
function fillForm(response) {
  
  //$("#id").val(response.id);
  
}


//display all items
function displayAllItems(items){

	if (items.userstory.length>1){ //if more than one user story
		$("#userstories-list").html("");
		$.each(items.userstory, function(i, dico){
			$("#userstories-list").append("<li class='img-polaroid'>"+
					"<div class='title'>"+ dico.title + "</div>" +
					"<div class='estimation'>"+ $.nvl(dico.estimation, "N/A") + "</div>" +
				"</li>");
		});   
	}
	else { //if only one user story
		$("#userstories-list").append("<li class='img-polaroid'>"+items.userstory.title+"</li>");
	}

	//init sortable list
	$( "#userstories-list" ).sortable();
    $( "#userstories-list" ).disableSelection();
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
            bootbox.confirm("Are you sure to delete this member ?", function(confirmed) {

				if (confirmed) {             
					$.ajax({
						//url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+$btn.attr("href"),
						type:"DELETE",
						success: function(data) {
							bootbox.alert("Member deleted successfully.");
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
			$("li#left-menu-option-story").addClass("active");
		} 		
	});
	

	//load all items
	$.ajax({
        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/all',
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
