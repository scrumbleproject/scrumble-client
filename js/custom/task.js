
/** Tasks methods **/

  //add event on delete-button
$("a").live('click',function (e) {

	if ($(this).hasClass("addTask")) 
	{
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
		      '<input type="hidden" name="idTask" value="">'+
		      '<input type="hidden" name="idUserstory" value="'+idUserstory+'">'+
		        '<input class="span3" type="text" placeholder="Title" id="title" name="title">'+
		  		'<input class="span1" type="text" placeholder="Est" id="estimation" name="estimation">'+
		  		'<button type="submit" class="btn btn-primary addTask" ><i class="icon-plus-sign icon-white"></i> Add task</button>'+
		      '</div>'+
		    '</div>'+
		    '</form>');
	}
});



//display all items
function displayAllItems(items, idUserstory)
{
	if(items !== null && items !=="" && items.task.length>1) //if more than one tasks
	{ 
		$("#taskList").html("");
		var nb = 0;
		$.each(items.task, function(i, dico){
			$("#taskList").append("<form id=\"formTask"+(i+1)+"\" class=\"form-horizontal formTask\">"+
			"<label class=\"control-label\" for=\"note\">"+(i+1)+"</label>"+
			"<div class=\"controls\">"+
			"<input type=\"hidden\" name=\"idTask\" value=\""+dico.idTask+"\">"+
			"<input type=\"hidden\" name=\"idUserstory\" value=\""+idUserstory+"\">"+
			"<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"title_"+(i+1)+"\" name=\"title\" value=\""+dico.title+"\">"+
			"<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimation_"+(i+1)+"\" name=\"estimation\" value=\""+dico.estimation+"\">"+
			"<button type=\"submit\" class=\"btn addTask\" ><i class=\"icon-pencil\"></i> Update task</button>"+
			"<button type=\"button\" class=\"btn btn-danger btn-danger btn-delete btn-delete-task\" ><i class=\"icon-trash\"></i> Delete</button>"+
			"</div>"+
			"</form>");
			nb=i;
		});
		$("#taskList").append("<form id=\"formTask"+(nb+2)+"\" class=\"form-horizontal formTask\">"+
		"<label class=\"control-label\" for=\"note\">"+(nb+2)+"</label>"+
		"<div class=\"controls\">"+
		"<input type=\"hidden\" name=\"idTask\" value=\"\">"+
		"<input type=\"hidden\" name=\"idUserstory\" value=\""+idUserstory+"\">"+
		"<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"title_"+(nb+2)+"\" name=\"title\">"+
		"<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimation_"+(nb+2)+"\" name=\"estimation\">"+
		"<button type=\"submit\" class=\"btn btn-primary\" ><i class=\"icon-plus-sign icon-white\"></i> Add task</button>"+
		"</div>"+
		"</form>");
	}
	else
	{ 
		var nbr = 1;
		if (items !== null && items !=="")
		{
			$("#taskList").append("<form id=\"formTask"+nbr+"\" class=\"form-horizontal formTask\">"+
			"<label class=\"control-label\" for=\"note\">"+nbr+"</label>"+
			"<div class=\"controls\">"+
			"<input type=\"hidden\" name=\"idTask\" value=\""+items.task.idTask+"\">"+
			"<input type=\"hidden\" name=\"idUserstory\" value=\""+idUserstory+"\">"+
			"<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"title_"+nbr+"\" name=\"title\" value=\""+items.task.title+"\">"+
			"<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimation_"+nbr+"\" name=\"estimation\" value=\""+items.task.estimation+"\">"+
			"<button type=\"submit\" class=\"btn addTask\" ><i class=\"icon-pencil\"></i> Update task</button>"+
			"<button type=\"button\" class=\"btn btn-warning btn-delete btn-delete-task\" ><i class=\"icon-trash\"></i> Delete</button>"+
			"</div><br/>"+
			"</form>");
			nbr=2;
		}
		$("#taskList").append("<form id=\"formTask"+nbr+"\" class=\"form-horizontal formTask\">"+
		"<label class=\"control-label\" for=\"note\">"+nbr+"</label>"+
		"<div class=\"controls\">"+
		"<input type=\"hidden\" name=\"idTask\" value=\"\">"+
		"<input type=\"hidden\" name=\"idUserstory\" value=\""+idUserstory+"\">"+
		"<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"title_"+nbr+"\" name=\"title\">"+
		"<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimation_"+nbr+"\" name=\"estimation\">"+
		"<button type=\"submit\" class=\"btn btn-primary\" ><i class=\"icon-plus-sign icon-white\"></i> Add task</button>"+
		"</div>"+
		"</form>");	
	}
}


//add an event on <a> delete button

function bindDeleteTaskEvent(){
	
	$("button.btn-delete-task").show();
	
	//fetch each <a> delete button
	$("button.btn-delete-task").live('click', function(e){
				
		$btn = $(this)
		//show a confirm box
		e.preventDefault();
        bootbox.confirm("Are you sure to delete this Task ?", function(confirmed) 
        {
			if (confirmed) 
			{   alert($btn.siblings("input[name=idTask]").val());          
				$.ajax({
					url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+$btn.siblings("input[name=idTask]").val(),
					type:"DELETE",
					success: function(data) {
						var box = bootbox.alert("Task deleted successfully.");
							setTimeout(function() {
							box.modal('hide');
							window.location.reload(); //redirect to storyList.html
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
$(document).ready( function() 
{
	//get param idUserstory in url if exists
    var idUserstory = $(document).getUrlParam("idUserstory");		
	
	if (idUserstory !== null && idUserstory !=="")
	{
		$("#taskVisible").append('<legend>Task</legend><div class="control-group" id="taskList"></div>');

	    $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+idUserstory+'/userstories',
            type:'GET',
		    contentType:'application/json; charset=UTF-8',
            success: function(reponse) {
                displayAllItems($.parseJSON(reponse), idUserstory);
				bindDeleteTaskEvent();
				test();
            },
		    error:function (xhr, status, error){
			    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
		    },
		    dataType: 'text',
		    converters: 'text json'
	    });
	}
});

function test()
{
	//action on #formTask form
	$('.formTask').each(function() 
	{
		$(this).submit(function()
		{
			//{"idUserstory":"2","title":"Créer un nouveau projet","importance":"94","estimation":"","demonstration":"- Cliquer sur \"New project\"\r\n- choisir une méthode ou des modules\r\n- Renseigner les données du formulaire de création\r\n- Valider et revenir à la page d'accueil\r\n- Accéder au projet créé","note":""} 
			var idTask = $("#"+$(this).attr("id")+" input[name=idTask]").val();
			console.log("idtask: "+idTask);
			console.log("idForm: "+$(this).attr("id"));
			console.log(JSON.stringify($("#"+$(this).attr("id")+"").serializeObject()));
			//JSON.stringify($('#formStory').serializeObject())
			if (idTask==null ||idTask.length==0 || idTask=="") 
			{
				//Case 1 : create a new task (idTask is empty)
			    $.ajax({
			        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/add',
			        type:"POST",
			        data: JSON.stringify($("#"+$(this).attr("id")+"").serializeObject()),
			        dataType: "json",
			        contentType: "application/json; charset=utf-8",
			        success: function(data) {
			                bootbox.alert('Task has been added successfully.');
							//window.location.replace('story.html'); //redirect to story.html
			        },
					error:function (xhr, status, error){
						bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
					}
			    });
			}
			else { //Case 2 : update an existing task (idTask is not empty)
				$.ajax({
	                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks,
	                type:"PUT",
	                data: JSON.stringify($("#"+$(this).attr("id")+"").serializeObject()),
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
