
/** task methods **/



//add event on delete-button
$("a").live('click',function (e)
{
    if ($(this).hasClass("addTask")) 
    {
        e.preventDefault();

        $(this).replaceWith("<button type=\"submit\" class=\"btn\" ><i class=\"icon-pencil\"></i></button><button type=\"button\" class=\"btn btn-danger btn-danger btn-delete btn-delete-task\" ><i class=\"icon-trash\"></i></button>");

        //Add new form task
        var index = $(this).attr("href");
        index = parseInt(index);
        index = index + 1;
        console.log(index);

        $("#formTask"+(index-1)+"").submit();
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
            "<label class=\"control-label\" for=\""+(i+1)+"\">"+(i+1)+"</label>"+
            "<div class=\"controls\">"+
            "<input type=\"hidden\" name=\"idTask\" value=\""+dico.idTask+"\">"+
            "<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"title_"+(i+1)+"\" name=\"title\" value=\""+dico.title+"\">"+
            "<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimation_"+(i+1)+"\" name=\"estimation\" value=\""+dico.estimation+"\">"+
            "<input type=\"hidden\" name=\"idUserstory\" value=\""+idUserstory+"\">"+
            "<button type=\"submit\" class=\"btn\" ><i class=\"icon-pencil\"></i></button>"+
            "<button type=\"button\" class=\"btn btn-danger btn-danger btn-delete btn-delete-task\" ><i class=\"icon-trash\"></i></button>"+
            "</div>"+
            "</form>");
            nb=i;
        });
        $("#taskList").append("<form id=\"formTask"+(nb+2)+"\" class=\"form-horizontal formTask\">"+
        "<label class=\"control-label\" for=\""+(nb+2)+"\">"+(nb+2)+"</label>"+
        "<div class=\"controls\">"+
        "<input type=\"hidden\" name=\"idTask\" value=\"\">"+
        "<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"title_"+(nb+2)+"\" name=\"title\">"+
        "<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimation_"+(nb+2)+"\" name=\"estimation\">"+
        "<input type=\"hidden\" name=\"idUserstory\" value=\""+idUserstory+"\">"+
        "<a class=\"btn btn-primary addTask\" href=\""+(nb+2)+"\"><i class=\"icon-plus-sign icon-white\"></i> Add task</a>"+
        "</div>"+
        "</form>");
    }
    else
    { 
        var nbr = 1;
        if (items !== null && items !=="")
        {
            $("#taskList").append("<form id=\"formTask"+nbr+"\" class=\"form-horizontal formTask\">"+
            "<label class=\"control-label\" for=\""+nbr+"\">"+nbr+"</label>"+
            "<div class=\"controls\">"+
            "<input type=\"hidden\" name=\"idTask\" value=\""+items.task.idTask+"\">"+
            "<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"title_"+nbr+"\" name=\"title\" value=\""+items.task.title+"\">"+
            "<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimation_"+nbr+"\" name=\"estimation\" value=\""+items.task.estimation+"\">"+
            "<input type=\"hidden\" name=\"idUserstory\" value=\""+idUserstory+"\">"+
            "<button type=\"submit\" class=\"btn\" ><i class=\"icon-pencil\"></i></button>"+
            "<button type=\"button\" class=\"btn btn-danger btn-danger btn-delete btn-delete-task\" ><i class=\"icon-trash\"></i></button>"+
            "</div><br/>"+
            "</form>");
            nbr=2;
        }
        $("#taskList").append("<form id=\"formTask"+nbr+"\" class=\"form-horizontal formTask\">"+
        "<label class=\"control-label\" for=\""+nbr+"\">"+nbr+"</label>"+
        "<div class=\"controls\">"+
        "<input type=\"hidden\" name=\"idTask\" value=\"\">"+
        "<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"title_"+nbr+"\" name=\"title\">"+
        "<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimation_"+nbr+"\" name=\"estimation\">"+
        "<input type=\"hidden\" name=\"idUserstory\" value=\""+idUserstory+"\">"+
        "<a class=\"btn btn-primary addTask\"  href=\""+nbr+"\"><i class=\"icon-plus-sign icon-white\"></i> Add task</a>"+
        "</div>"+
        "</form>"); 
    }
}



//add an event on <a> delete button
function bindDeleteTaskEvent(idUserstory)
{
    $("button.btn-delete-task").show();
    
    //fetch each <a> delete button
    $("button.btn-delete-task").live('click', function(e)
    {
        $btn = $(this)
        //show a confirm box
        e.preventDefault();
        bootbox.confirm("Are you sure to delete this Task ?", function(confirmed) 
        {
            if (confirmed) 
            {            
                $.ajax({
                    url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory+'/tasks/'+$btn.siblings("input[name=idTask]").val(),
                    type:"DELETE",
                    success:function(data)
                    {
                        var box = bootbox.alert("Task deleted successfully.");
                        setTimeout(function()
                        {
                            box.modal('hide');
                            window.location.reload(); //redirect to storyList.html
                        }, 3000); 
                    },
                    error:function (xhr, status, error)
                    {
                        bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                    }
                });
            }   
        });
    });
}



//submit the task form and add or update a task
function submitFormTask(idUserstory)
{
    //action on #formTask form
    $('.formTask').each(function() 
    {
        $(this).submit(function()
        {
            var idTask = $("#"+$(this).attr("id")+" input[name=idTask]").val();
            
            //Case 1 : create a new task (idTask is empty)
            if (idTask==null ||idTask.length==0 || idTask=="") 
            {
                $.ajax({
                    url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory+'/tasks/add',
                    type:"POST",
                    data:JSON.stringify($("#"+$(this).attr("id")+"").serializeObject()),
                    dataType:"json",
                    contentType:"application/json; charset=utf-8",
                    success:function(data)
                    {
                        bootbox.alert('Task has been added successfully.');
                    },
                    error:function(xhr, status, error)
                    {
                        bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                    }
                });
            }
            else //Case 2 : update an existing task (idTask is not empty)
            {
                $.ajax({
                    url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory+'/tasks',
                    type:"PUT",
                    data: JSON.stringify($("#"+$(this).attr("id")+"").serializeObject()),
                    dataType:"json",
                    contentType:"application/json; charset=utf-8",
                    success:function(data)
                    {
                        bootbox.alert("Task has been updated successfully.");
                    }
                });
            }
            return false;
        })
    });
}


        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready( function() 
{
    //get param idUserstory in url if exists
    var idUserstory = $(document).getUrlParam("userstory");     
    
    if (idUserstory !== null && idUserstory !=="")
    {
        $("#taskVisible").append('<legend>Task</legend><div class="control-group" id="taskList"></div>');

        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory+'/tasks/all',
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success:function(reponse)
            {
                displayAllItems($.parseJSON(reponse), idUserstory);
                bindDeleteTaskEvent(idUserstory);
                submitFormTask(idUserstory);
            },
            error:function(xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType:'text',
            converters:'text json'
        });
    }
});