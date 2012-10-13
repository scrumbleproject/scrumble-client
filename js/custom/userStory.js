
/** User Stories methods **/

//fill the form with data about one user story
function fillForm(response) {
  
  //$("#id").val(response.id);
  
}


//display all items
function displayAllItems(items){

	var maxNbCols = 4;

	if (items.userstory.length>1){ //if more than one members
		$("#gridster > ul").html("");
		$.each(items.userstory, function(i, dico){
			$("#gridster > ul").append("<li class='img-polaroid'"+
				" data-row='"+(parseInt(i/maxNbCols)+1)+"' data-col='"+(i%maxNbCols+1)+"' data-sizex='1' data-sizey='1'>"+
					"<div class='title'>"+ dico.title + "</div>" +
				"</li>");
		});   
	}
	else { //if only one member
		$("#gridster > ul").append("<li class='img-polaroid' data-row='1' data-col='1' data-sizex='1' data-sizey='1'>"+items.userstory.title+"</li>");
	}

	//init gridster
	$(".gridster ul").gridster({
        widget_margins: [15, 15],
        widget_base_dimensions: [200, 130],
		max_size_x: maxNbCols
    });
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
