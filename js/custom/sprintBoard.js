
/** Sprintboard methods **/


//test set of data
var dataTest = {
	"userstory":/*[*/
	{ "title":"Dépot","estimation":"4",
		"taskCollection":[
			{"title":"task 1","estimation":"1"},
			{"title":"task 2","estimation":"2"},
			{"title":"task 3","estimation":"1"},
		]
	}/*,
	{ "title":"Transfère d'argent","estimation":"6",
		"taskCollection":[
			{"title":"task 1","estimation":"1"},
			{"title":"task 2","estimation":"2"},
			{"title":"task 3","estimation":"1"},
			{"title":"task 4","estimation":"1"},
			{"title":"task 5","estimation":"1"},
		]
	}*//*,
	{ "title":"Visualiser ses transactions","estimation":"2",
		"taskCollection":[
			{"title":"task 1","estimation":"1"},
			{"title":"task 2","estimation":"1"},
		]
	}*/
	/*]*/
}

//function utils for get htmlContent about tasks
function getTasksHtmlContentFromTasksCollection(taskCollection, userStoryIndex, backgroundClass){
	
	var htmlContent = "";

	var statusColumns = [];
	statusColumns[0] = config.processStatus.toDo;
	statusColumns[1] = config.processStatus.inProgress;
	statusColumns[2] = config.processStatus.done;

	if (taskCollection.length>1){ //tasks are retrieved by status order from "to do" to "done"
		var newColumnTag = 1;
		var lastCodeStatus = '';
		$.each(taskCollection, function(i, taskDico){

			//create empty column(s) before
			for (var j=1; lastCodeStatus=='' && j<=3  ;j++){

				//break this loop if a task has to be displayed in the current column
				if (j==1 && taskDico.idProcessStatus.codeStatus == config.processStatus.toDo ||
					j==2 && taskDico.idProcessStatus.codeStatus == config.processStatus.inProgress || 
					j==3 && taskDico.idProcessStatus.codeStatus == config.processStatus.done) {
					break;	
				}

				htmlContent += "<div id='column-"+statusColumns[j-1]+"' class='userstory "+backgroundClass+"'>" +
								"<ul id='sortable"+(userStoryIndex+1)+"-"+j+"'>" +
								"</ul></div>";

			}

			//check if we have to begin a new column
			if (lastCodeStatus != taskDico.idProcessStatus.codeStatus){
				if (newColumnTag!=1){ //close last column each time except the first time
					htmlContent += "</ul></div>";
					newColumnTag = 1;
				}
				//keep the current code status
				lastCodeStatus = taskDico.idProcessStatus.codeStatus;
			}



			if (newColumnTag == 1) { //tag says we have to open a new column
				if (taskDico.idProcessStatus.codeStatus == config.processStatus.toDo){
					htmlContent += "<div id='column-"+statusColumns[0]+"' class='userstory "+backgroundClass+"'>" + 
									"<ul id='sortable"+(userStoryIndex+1)+"-1'>";
					newColumnTag = 0;

				} else if (taskDico.idProcessStatus.codeStatus == config.processStatus.inProgress) {
					htmlContent += "<div id='column-"+statusColumns[1]+"' class='userstory "+backgroundClass+"'>" + 
									"<ul id='sortable"+(userStoryIndex+1)+"-2'>";
					newColumnTag = 0;

				} else if (taskDico.idProcessStatus.codeStatus == config.processStatus.done) {
					htmlContent += "<div id='column-"+statusColumns[2]+"' class='userstory "+backgroundClass+"'>" +
									"<ul id='sortable"+(userStoryIndex+1)+"-3'>";
					newColumnTag = 0;
				}
			}

			htmlContent += "<li class='task img-polaroid' id='task-"+taskDico.idTask+"'>"+taskDico.title+"</li>";

		});

		//close last column
		htmlContent += "</ul></div>";

		//create empty column(s) after
		for (var j=1; lastCodeStatus!=config.processStatus.done && j<=3; j++){

			if (lastCodeStatus == config.processStatus.toDo && j>1 ||
				lastCodeStatus == config.processStatus.inProgress && j>2) {
				
				htmlContent += "<div id='column-"+statusColumns[j-1]+"' class='userstory "+backgroundClass+"'>" +
								"<ul id='sortable"+(userStoryIndex+1)+"-"+j+"'>" +
								"</ul></div>";
			}

		}

	}
	else { //juste one task to display
		
		//create all columns
		for (var j=1; j<=3; j++){

			//open column
			htmlContent += "<div id='column-"+statusColumns[j-1]+"' class='userstory "+backgroundClass+"'>" +
							"<ul id='sortable"+(userStoryIndex+1)+"-"+j+"'>";

			//check in which column we have to display it
			if (j==1 && taskCollection.idProcessStatus.codeStatus == config.processStatus.toDo ||
				j==2 && taskCollection.idProcessStatus.codeStatus == config.processStatus.inProgress || 
				j==3 && taskCollection.idProcessStatus.codeStatus == config.processStatus.done) {
				htmlContent += "<li class='task img-polaroid' id='task-"+taskCollection.idTask+"'>"+taskCollection.title+"</li>";	
			}
			
			//close column
			htmlContent += "</ul></div>";	
		}
		
	}

	return htmlContent;
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
			
			var htmlContent = "<div class='userstory-title'>"+storyDico.title+"</div>";

			htmlContent += getTasksHtmlContentFromTasksCollection(storyDico.taskCollection, i, backgroundClass);
						
			$("#sprintboard").append(htmlContent);
			
			//init current sortable list
			$( "#sortable"+(i+1)+"-1, #sortable"+(i+1)+"-2, #sortable"+(i+1)+"-3" ).sortable({
				connectWith: "#sortable"+(i+1)+"-1, #sortable"+(i+1)+"-2, #sortable"+(i+1)+"-3",
				update: function(event, ui) {
					//build a suitable id integer for ajax request
					var toRemove = 'task-';
					var idTask = ui.item.attr("id").replace(toRemove,'');

					toRemove = 'column-';
					$column = ui.item.closest("div");
					var status = $column.attr("id").replace(toRemove,'');

					alert('idTask='+idTask+" ; status="+status);
		 
					//run ajax request
					$.ajax({
						url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+idTask+'/'+status,
						type:"POST",
						success: function(data) {
							console.log('Task status updated');
						}
					});	
				}	
			}).disableSelection();
		});   
	}
	else { //if only one user story

		//reinit div content
		$("#sprintboard").html("<div class='todo'><h3>TODO</h3></div> "+
			"<div class='assigned'><h3>PROCESSING</h3></div>"+
			"<div class='done'><h3>DONE</h3></div>");

		//append content
		var htmlContent = "<div class='userstory-title'>"+items.userstory.title+"</div>";

		htmlContent += getTasksHtmlContentFromTasksCollection(items.userstory.taskCollection, 1 , "odd");
		
		$("#sprintboard").append(htmlContent);
		
		//init sortable list
		/*$( "#sortable1-1, #sortable1-2, #sortable1-3" ).sortable({
		    connectWith: "#sortable1-1, #sortable1-2, #sortable1-3",
			update: function (event, ui) {
			        var start_pos = ui.item.data('start_pos');
			        console.log(start_pos);
			        var end_pos = ui.item.index();
			        console.log(end_pos);
			        //$('#sortable li').removeClass('highlights');
			    },
	        receive: function() {
				console.log(this.id);
				//console.log($("#"+this.id+""));
	        }function(event, ui) {
            var start_pos = ui.item.data('start_pos');
            var index = ui.placeholder.index();
            console.log(start_pos);
            console.log(index);
            if (start_pos < index) {
                $('#'+this.id+' li:nth-child(' + index + ')').addClass('highlights');
            } else {
                $('#'+this.id+' li:eq(' + (index + 1) + ')').addClass('highlights');
            }
        	}
		}).disableSelection();
		*/

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
		var idSprint = $(document).getUrlParam("sprint");		
	
		//load data on list or on form
		if ( (idSprint !=="") && (idSprint !==null)) {
		    $.ajax({
		        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+"/"+config.resources.userStories,
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
