
/** Sprintboard methods **/


//test set of data
var dataTest = {
	"userstory":[
	{ "title":"Dépot","estimation":"4",
		"task":[
			{"title":"task 1","estimation":"1"},
			{"title":"task 2","estimation":"2"},
			{"title":"task 3","estimation":"1"},
		]
	},
	{ "title":"Transfère d'argent","estimation":"6",
		"task":[
			{"title":"task 1","estimation":"1"},
			{"title":"task 2","estimation":"2"},
			{"title":"task 3","estimation":"1"},
			{"title":"task 4","estimation":"1"},
			{"title":"task 5","estimation":"1"},
		]
	},
	{ "title":"Visualiser ses transactions","estimation":"2",
		"task":[
			{"title":"task 1","estimation":"1"},
			{"title":"task 2","estimation":"1"},
		]
	}
	]
}


//display all items
function displayAllItems(items){


	if (items.userstory.length>1){ //if more than one user story
		
		//reinit div content
		$("#sprintboard").html("<div class='todo'><h3>TODO</h3></div> "+
			"<div class='assigned'><h3>PROCESSING</h3></div>"+
			"<div class='done'><h3>DONE</h3></div>");
		
		//append content
		$.each(items.userstory, function(i, storyDico){
		
			var backgroundClass = "odd";
			if (i % 2 == 1) backgroundClass = "even";
			
			var htmlContent = "<div class='userstory "+backgroundClass+"'>" +
				"<span>"+storyDico.title+"</span>"+
				"<ul id='sortable"+(i+1)+"-1'>";
			
			$.each(storyDico.task, function(i, taskDico){
				htmlContent += "<li class='task img-polaroid'>"+taskDico.title+"</li>";
			});
			
			htmlContent += "</ul></div>";
			
			htmlContent += "<div class='userstory "+backgroundClass+"'>" +
				"<ul id='sortable"+(i+1)+"-2'>"+
				"</ul></div>";
			
			htmlContent += "<div class='userstory "+backgroundClass+"'>" +
				"<ul id='sortable"+(i+1)+"-3'>"+
				"</ul></div>";
			
			$("#sprintboard").append(htmlContent);
			
			//init current sortable list
			$( "#sortable"+(i+1)+"-1, #sortable"+(i+1)+"-2, #sortable"+(i+1)+"-3" ).sortable({
				connectWith: "#sortable"+(i+1)+"-1, #sortable"+(i+1)+"-2, #sortable"+(i+1)+"-3"
			}).disableSelection();
		});   
	}
	else { //if only one user story
		
		//reinit div content
		$("#sprintboard").html("<div class='todo'><h3>TODO</h3></div> "+
			"<div class='assigned'><h3>PROCESSING</h3></div>"+
			"<div class='done'><h3>DONE</h3></div>");
		
		//append content
		var htmlContent = "<div class='userstory odd'>" +
			"<span>"+storyDico.title+"</span>"+
			"<ul id='sortable1-1'>";
		
		$.each(storyDico.task, function(i, taskDico){
			htmlContent += "<li class='task img-polaroid'>"+taskDico.title+"</li>";
		});
		
		htmlContent += "</ul></div>";
		
		$("#sprintboard").append(htmlContent);
		
		//init sortable list
		$( "#sortable1-1, #sortable1-2, #sortable1-3" ).sortable({
		    connectWith: "#sortable1-1, #sortable1-2, #sortable1-3"
		}).disableSelection();
	}

	
    


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
			$("li#left-menu-option-sprint").addClass("active");
		} 		
	});
	
	var test = $(document).getUrlParam("test");
	if (test=="1") { //if needing test data only
		displayAllItems(dataTest);
	}
	else {
	
		//get param in url if exists
		var idSprint = $(document).getUrlParam("idSprint");		
	
		//load data on list or on form
		if ( (idSprint !=="") && (idSprint !==null)) {
		    $.ajax({
		        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint,
		        type:'GET',
		        contentType:'application/json; charset=UTF-8',
		        success: function(response) {
		            displayAllItems($.parseJSON(response));
		        },
			    error:function (xhr, status, error){
				    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
			    },
		        dataType: 'text',
		        converters: 'text json'
		    });
			                  
		}
	
	}
	

    
});
