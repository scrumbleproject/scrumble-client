
/** Tasks methods **/

$("a").live('click',function (e) {
	e.preventDefault();

	$(this).replaceWith('<a class="btn addTask" href="'+index+'"><i class="icon-pencil"></i> Update task</a>');


	//Add new form task
	var index = $(this).attr("href");
	index = parseInt(index);
	index = index + 1;
	$('#taskList').append(' <form id=formTask'+index+' class="form-horizontal formTask">'+
	    '<div class="control-group">'+
	      '<label class="control-label" for="'+index+'">'+index+'</label>'+
	      '<div class="controls">'+
	        '<input class="span3" type="text" placeholder="Title" id="titleTask" name="titleTask">'+
	  '<input class="span1" type="text" placeholder="Est" id="estimationTask" name="estimationTask">'+
	  '<button type="submit" class="btn btn-primary addTask" ><i class="icon-plus-sign icon-white"></i> Add task</button>'+
	      '</div>'+
	    '</div>'+
	    '</form>');
});






//display all items
function displayAllItems(items){
	if (items.task.length>1){ //if more than one tasks
		$("#taskList").html("");
		var nb = 0;
		$.each(items.task, function(i, dico){
			$("#taskList").append("<form id=\"formTask"+(i+1)+"\" class=\"form-horizontal formTask\">"+
			"<label class=\"control-label\" for=\"note\">"+(i+1)+"</label>"+
			"<div class=\"controls\">"+
			"<input type=\"hidden\" name=\"idTask\" value=\""+dico.idTask+"\">"+
			"<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"titleTask_"+(i+1)+"\" name=\"titleTask_"+(i+1)+"\" value=\""+dico.title+"\">"+
			"<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimationTask_"+(i+1)+"\" name=\"estimationTask_"+(i+1)+"\" value=\""+dico.estimation+"\">"+
			"<button type=\"submit\" class=\"btn addTask\" ><i class=\"icon-pencil\"></i> Update task</button>"+
			"</div>"+
			"</form>");
			nb=i;
		});
		$("#taskList").append("<form id=\"formTask"+(nb+2)+"\" class=\"form-horizontal formTask\">"+
		"<label class=\"control-label\" for=\"note\">"+(nb+2)+"</label>"+
		"<div class=\"controls\">"+
		"<input type=\"hidden\" name=\"idTask\" value=\"\">"+
		"<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"titleTask_"+(nb+2)+"\" name=\"titleTask_"+(nb+2)+"\">"+
		"<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimationTask_"+(nb+2)+"\" name=\"estimationTask_"+(nb+2)+"\">"+
		"<button type=\"submit\" class=\"btn btn-primary\" ><i class=\"icon-plus-sign icon-white\"></i> Add task</button>"+
		"</div>"+
		"</form>");
	}
	else { //if only one task
		$("#taskList").append("<form id=\"formTask1\" class=\"form-horizontal formTask\">");
		$("#taskList").append("<label class=\"control-label\" for=\"note\">1</label>");
		$("#taskList").append("<div class=\"controls\">");
		$("#taskList").append("<input type=\"hidden\" name=\"idTask\" value=\""+items.task.idTask+"\">");
		$("#taskList").append("<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"titleTask_1\" name=\"titleTask_1\" value=\""+items.task.title+"\">");
		$("#taskList").append("<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimationTask_1\" name=\"estimationTask_1\" value=\""+items.task.estimation+"\">");
		$("#taskList").append("<button type=\"submit\" class=\"btn addTask\" ><i class=\"icon-pencil\"></i> Update task</button>");
		$("#taskList").append("</div><br/>");
		$("#taskList").append("</form>");

		$("#taskList").append("<form id=\"formTask1\" class=\"form-horizontal formTask\">");
		$("#taskList").append("<label class=\"control-label\" for=\"note\">2</label>");
		$("#taskList").append("<div class=\"controls\">");
		$("#taskList").append("<input type=\"hidden\" name=\"idTask\" value=\"\">");
		$("#taskList").append("<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"titleTask_2\" name=\"titleTask_2\">");
		$("#taskList").append("<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimationTask_2\" name=\"estimationTask_2\">");
		$("#taskList").append("<button type=\"submit\" class=\"btn btn-primary\" ><i class=\"icon-plus-sign icon-white\"></i> Add task</button>");
		$("#taskList").append("</div>");
		$("#taskList").append("</form>");
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
            bootbox.confirm("Are you sure to delete this task ?", function(confirmed) {

				if (confirmed) {             
					$.ajax({
						url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+$btn.attr("href"),
						type:"DELETE",
						success: function(data) {
							bootbox.alert("Task deleted successfully.");
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
	
	//get param idUserstory in url if exists
    var idUserstory = $(document).getUrlParam("idUserstory");		
	
	//load data on list or on form
    /*if ( (idUserstory !=="") && (idUserstory !==null)) {
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+idUserstory,
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
	else {*/
	    $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+idUserstory+'/userstories',
            type:'GET',
		    contentType:'application/json; charset=UTF-8',
            success: function(reponse) {
                displayAllItems($.parseJSON(reponse));
				//bindDeleteEvent();
				test();
            },
		    error:function (xhr, status, error){
			    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
		    },
		    dataType: 'text',
		    converters: 'text json'
	    });	
    /*}*/

	//action on #formTask form
	
    
});

function test(){
	//action on #formTask form
	$('.formTask').each(function() {
		alert("formTask");
		$form = $(this);
		$(this).submit(function(){
			//Get #idUserstory field value	
			alert("submit");
			var idTask = $form.children("input[name=idTask]").val();
			alert("idTask = "+idTask);
			if (idTask==null ||idTask.length==0) {
				alert("submit1");
				//Case 1 : create a new task (idTask is empty)
			    $.ajax({
			        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/add',
			        type:"POST",
			        data: JSON.stringify($form.serializeObject()),
			        dataType: "json",
			        contentType: "application/json; charset=utf-8",
			        success: function(data) {
			                bootbox.alert('Task has been added successfully.');
							//window.location.replace('story.html'); //redirect to taskList.html
			        },
					error:function (xhr, status, error){
						bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
					}
			    });
			}
			else { //Case 2 : update an existing task (idTask is not empty)
				alert("submit2");
				$.ajax({
	                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks,
	                type:"PUT",
	                data: JSON.stringify($form.serializeObject()),
	                dataType: "json",
	                contentType: "application/json; charset=utf-8",
	                success: function(data) {
	                    bootbox.alert("Task has been updated successfully.");
						//window.location.replace('story.html'); //redirect to taskList.html
	                }
	            });
			}

		    return false;

		})
		
    });
}
