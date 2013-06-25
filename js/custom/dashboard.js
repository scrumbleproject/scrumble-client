
/** dashboard methods **/



//Display the breadCrumb trail
function displayBreadCrumb()
{
        $("#breadcrumb").append('<ul class="breadcrumb">'+
            '<li class="active">Home</li>'+
        '</ul>');
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    displayProjects($.parseJSON(reponse));
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjSecondLevel(reponse)
{
    displayTasks($.parseJSON(reponse));
}



//function called to display projects
function displayProjects(items)
{
    if(items!= null && typeof items != "undefined")
    {
        if(items.project.length>1)
        {
            var i = 0 ;
            $("#projectList > tbody").html("");

            $.each(items.project, function(i, dico){
                if(i>=5)
                    return false;

                $("#projectList > tbody").append('<tr>'+
                                                '<td>'+dico.title+'</td>'+
                                                '<td><a href="projectDashboard.html?project='+dico.idProject+'" class="btn">More&nbsp;»</a></td>'+
                                                '</tr>');
                i++;
            });
        }
        else //if only one member
        {
            $("#projectList > tbody").append('<tr>'+
                                            '<td>'+items.project.title+'</td>'+
                                            '<td><a href="projectDashboard.html?project='+items.project.idProject+'" class="btn">More&nbsp;»</a></td>'+
                                            '</tr>');
        }
        $('#projectDetails').append('<a href="projectList.html" class="btn"> View&nbsp;details&nbsp;»</a>');
    }
    else
    {
        $('#projectDetails').html("");
        $("#projectDetails").append('<span id="msg" class="alert fade in" style="padding-right:14px;">Currently, there is no task in progress.</span>');
    }
}



//function called to display tasks
function displayTasks(items)
{
    if(items!= null && typeof items != "undefined")
    {
        //if more than one task
        if (items.sprinttaskassignation.length>1)
        {
            $("#taskList > tbody").html("");

            $.each(items.sprinttaskassignation, function(i, dico){
                $("#taskList > tbody").append('<tr>'+
                                                '<td>'+dico.task.title+'</td>'+
                                                '<td>'+dico.sprint.idProject.title+'</td>'+
                                                '<td><a href="sprintBoard.html?sprint='+dico.sprint.idSprint+'&project='+dico.sprint.idProject.idProject+'" class="btn">More&nbsp;»</a></td>'+
                                                '</tr>');
                i++;
            });
        }
        else //if only one member
        {
            $("#taskList > tbody").append('<tr>'+
                                            '<td>'+items.sprinttaskassignation.task.title+'</td>'+
                                            '<td>'+items.sprinttaskassignation.sprint.idProject.title+'</td>'+
                                            '<td><a href="sprintBoard.html?sprint='+items.sprinttaskassignation.sprint.idSprint+'&project='+items.sprinttaskassignation.sprint.idProject.idProject+'" class="btn">More&nbsp;»</a></td>'+
                                            '</tr>');
        }
        //$("#taskDetails").append('<a href="sprintBoard.html?sprint='+items.idSprint+'&project='+items.idProject.idProject+'" class="btn">More »</a>');
    }
    else
    {
        $("#taskDetails").html("");
        $("#taskDetails").append('<span id="msg" class="alert fade in" style="padding-right:14px;">Currently, you are not assignated to any task.</span>');
    }
}



/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function() 
{
    //display the breadcrumb trail
    displayBreadCrumb();

    var login = $.getLoginFromCookie();
    $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+login+'/project');

    $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+login+'/tasksforuser', 2);
});