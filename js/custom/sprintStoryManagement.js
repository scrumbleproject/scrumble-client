
/** sprintStoryManagement methods **/



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    displayAllNotSelectedUserstories($.parseJSON(reponse));
}

//function called by $.getObjFromDatabase function (utils.js)
function successGetObjSecondLevel(reponse)
{
    displayAllSelectedUserstories($.parseJSON(reponse));
}

/*Add story in sprint

     Blue color show the story in the sprint
     White color show the story not in the sprintje

*/
function storySprintManagerInit()
{
    $( "#sortableNotSelected" ).sortable({
        connectWith: "#sortableSelected"
    }).disableSelection();
    $( "#sortableSelected" ).sortable({
        connectWith: "#sortableNotSelected",
        receive: function(event, ui) {
            if ( $("ul#sortableSelected").children("li").length > 0 ) {
                $("ul#sortableSelected").find('p').remove();
            }
        },
        remove: function(event, ui) {
            if ( $("ul#sortableSelected").children("li").length == 0 ) {
                $("ul#sortableSelected").append('<p class="muted">Feed me to add user stories to the sprint</p>');
            }
        }
    }).disableSelection();
}



//display all not selected userstories
function displayAllNotSelectedUserstories(items)
{
    $("#sortableNotSelected").html("");
    //if more than one user story
    if (items.userstory.length>1)
    { 
        $.each(items.userstory, function(i, dico)
        {
            $("#sortableNotSelected").append('<li class="ui-state-default" id="userstory-'+dico.idUserstory+'">'+dico.title+'</li>');
        });
        
    }
    else //if only one user story
    {
        $("#sortableNotSelected").append('<li class="ui-state-default" id="userstory-'+items.userstory.idUserstory+'">'+items.userstory.title+'</li>');
    }

}

//display all selected userstories
function displayAllSelectedUserstories(items)
{
    $("#sortableSelected").html("");

    if (!items){
        $("#sortableSelected").append('<p class="muted">Feed me to add user stories to the sprint</p>');
    }
    else if (items.userstory.length>1) //if more than one user story
    { 
        $.each(items.userstory, function(i, dico)
        {
            $("#sortableSelected").append('<li class="ui-state-default" id="userstory-'+dico.idUserstory+'">'+dico.title+'</li>');
        });
        
    }
    else //if only one user story
    {
        $("#sortableSelected").append('<li class="ui-state-default" id="userstory-'+items.userstory.idUserstory+'">'+items.userstory.title+"</li>");
    }

}



        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function()
{

    //get parameters idProject and idSprint in url if exists
    var idProject = $(document).getUrlParam("project");
    var idSprint = $(document).getUrlParam("sprint");

    $("#submitButton").click( function() {
        var url = 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/save/'+idSprint;
        var arraySelectedId = new Array();
        $("#sortableSelected li").each(function() {
            var idStory = $(this).attr("id").replace('userstory-','');
            arraySelectedId.push(idStory);
        });
        
        var formData = { 'userstories[]' : arraySelectedId };
        
        $.postObjToDatabase(url, formData, 'The Sprint', 'sprintList.html');
    });

    //load data on list
    if((idProject !=="") && (idProject !==null))
    {
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+'/userstories/no');
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+'/userstories', 2);
        storySprintManagerInit();
    }
});
