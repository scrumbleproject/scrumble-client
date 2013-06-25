
/** task methods **/



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjSecondLevel(reponse)
{
    displayAllItems($.parseJSON(reponse), idUserstory);
    submitFormTask(idUserstory);
    handleEditMode();
}



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
            $("#taskList").append("<form id=\"formTask"+(i+1)+"\" class=\"form-inline formTask\">"+
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
        $("#taskList").append("<form id=\"formTask"+(nb+2)+"\" class=\"form-inline formTask\">"+
        "<label class=\"control-label\" for=\""+(nb+2)+"\">"+(nb+2)+"</label>"+
        "<div class=\"controls\">"+
        "<input type=\"hidden\" name=\"idTask\" value=\"\">"+
        "<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"title_"+(nb+2)+"\" name=\"title\">"+
        "<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimation_"+(nb+2)+"\" name=\"estimation\">"+
        "<input type=\"hidden\" name=\"idUserstory\" value=\""+idUserstory+"\">"+
        "<button class=\"btn btn-primary addTask\" href=\""+(nb+2)+"\"><i class=\"icon-plus-sign icon-white\"></i> Add task</button>"+
        "</div>"+
        "</form>");
    }
    else
    { 
        var nbr = 1;
        if (items !== null && items !=="")
        {
            $("#taskList").append("<form id=\"formTask"+nbr+"\" class=\"form-inline formTask\">"+
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
        } else {
            $("#estimation").attr('disabled', null);
        }
        $("#taskList").append("<form id=\"formTask"+nbr+"\" class=\"form-inline formTask\">"+
        "<label class=\"control-label\" for=\""+nbr+"\">"+nbr+"</label>"+
        "<div class=\"controls\">"+
        "<input type=\"hidden\" name=\"idTask\" value=\"\">"+
        "<input class=\"span3\" type=\"text\" placeholder=\"Title\" id=\"title_"+nbr+"\" name=\"title\">"+
        "<input class=\"span1\" type=\"text\" placeholder=\"Est\" id=\"estimation_"+nbr+"\" name=\"estimation\">"+
        "<input type=\"hidden\" name=\"idUserstory\" value=\""+idUserstory+"\">"+
        "<button class=\"btn btn-primary addTask\"  href=\""+nbr+"\"><i class=\"icon-plus-sign icon-white\"></i> Add task</button>"+
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
                var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory+'/tasks/'+$btn.siblings("input[name=idTask]").val();
                $.deleteObjFromDatabase(url, 'Task', 'story.html?userstory='+idUserstory+'&project='+idProject);
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
            var idProject = $(document).getUrlParam("project"); 
            var idTask = $("#"+$(this).attr("id")+" input[name=idTask]").val();
            
            //Case 1 : create a new task (idTask is empty)
            if (idTask==null ||idTask.length==0 || idTask=="") 
            {
                var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory+'/tasks/add';
                var formdata=JSON.stringify($("#"+$(this).attr("id")+"").serializeObject());
                $.postObjToDatabase(url, formdata, 'Task', 'story.html?userstory='+idUserstory+'&project='+idProject+'#tasks');
            }
            else //Case 2 : update an existing task (idTask is not empty)
            {
                var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory+'/tasks';
                var formdata=JSON.stringify($("#"+$(this).attr("id")+"").serializeObject());
                $.putObjToDatabase(url, formdata, 'Task', 'story.html?userstory='+idUserstory+'&project='+idProject+'#tasks');

            }
            
            return false;
        })
    });
}

        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function() 
{
    //get param idUserstory and idProject in url if exists
    idUserstory = $(document).getUrlParam("userstory");
    idProject = $(document).getUrlParam("project"); 
    
    if (idUserstory !== null && idUserstory !=="")
    {
        $("#taskVisible").append('<legend>Task</legend><div class="control-group" id="taskList"></div>');

        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory+'/tasks/all', 2);
    }

});
