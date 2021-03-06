
/** sprintStoryManagement methods **/

var velocity;

//Display the breadCrumb trail
function displayBreadCrumb(idProject)
{
    var myTab = new Array();

    myTab['dashboard.html'] = 'Home';
    myTab['projectDashboard.html?project='+idProject+''] = 'Project (ID: '+idProject+')';
    myTab['sprintList.html?project='+idProject+''] = 'Sprint List';
    myTab[''] = 'Userstory Assignment'; 

    $.showBreadCrumb(myTab);
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    displayAllNotSelectedUserstories($.parseJSON(reponse));
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjSecondLevel(reponse)
{
    displayAllSelectedUserstories($.parseJSON(reponse));
    handleEditMode();
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
            handleUserstoryAdd(ui.item.attr("id").replace('userstory-',''));
        },
        remove: function(event, ui) {
            if ( $("ul#sortableSelected").children("li").length == 0 ) {
                $("ul#sortableSelected").append('<p class="muted">Feed me to add user stories to the sprint</p>');
            }
            handleUserstoryDelete(ui.item.attr("id").replace('userstory-',''));
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

function enableEdition(){
    console.log("enableEdition");

    //show buttons bar
    $("#story-sprint-manager .buttons-bar .btn").each(function() {
        $(this).show();
    });
    
}

function disableEdition(){
    console.log("disableEdition");  

    //warning msg to inform user that user story cannot be edited
    $("#msg").addClass("alert fade in");
    $("#msg").html("This sprint is either currently running or already done and cannot be edited anymore.");

    //Disable sortable
    $("#sortableNotSelected").sortable('disable');
    $("#sortableSelected").sortable('disable');

    //grey all li
    $("#sortableNotSelected li, #sortableSelected li").each(function() {
        $(this).addClass("inactive");
    });

}

function handleEditMode(){

    var idSprint = $(document).getUrlParam("sprint");

    if((idSprint !=="") && (idSprint !==null)){

        $.ajax({
            url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+"/iseditable",
            type:'GET',
            success: function(reponse) 
            {
                console.log(reponse);  
                if (reponse=="true"){
                    enableEdition();
                } else {
                    disableEdition();
                }
            },
            error:function (xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            }
        });
    }
}


function displayTotalVelocity(total){
    $("#velocity-ratio span.total").html(total);
}
function displayRemainingVelocity(current){
    velocity = current;
    $("#velocity-ratio span.current").html(current);
}

function handleVelocity(response){
    displayVelocity(response, response);
}
function handleUserstoryAdd(idUserstory){
    $.getObjFromDatabaseAndCallback('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory, calculateRemainingVelocityForAddAction);
}
function handleUserstoryDelete(idUserstory){
    $.getObjFromDatabaseAndCallback('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory, calculateRemainingVelocityForDelAction);
}
function calculateRemainingVelocityForAddAction(response){
    if (response!=null){
        item = $.parseJSON(response);
        if (item!=null && item.estimation!=null){
            velocity = parseInt(velocity) - parseInt(item.estimation);
            displayRemainingVelocity(velocity);
            validateVelocityValue();
        }
    }
}
function calculateRemainingVelocityForDelAction(response){
    if (response!=null){
        item = $.parseJSON(response);
        if (item!=null && item.estimation!=null){
            velocity = parseInt(velocity) + parseInt(item.estimation);
            displayRemainingVelocity(velocity);
            validateVelocityValue();
        }

    }
}
function validateVelocityValue(){
    if (velocity<0 && !$("#velocity-ratio").hasClass("red")){
        $("#msg").addClass("alert fade in");
        $("#velocity-ratio").addClass("red");
        $("#msg").html("This velocity is exceeded.<br />Please remove some user stories in order to be able to save changes !");
        //show buttons bar
        $("#submitButton").hide();
    } else if (velocity>=0 && $("#velocity-ratio").hasClass("red")) {
        $("#msg").removeClass("alert fade in");
        $("#velocity-ratio").removeClass("red");
        $("#msg").html("");
        //show buttons bar
        $("#submitButton").show();
    }
}

        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function()
{

    //get parameters idProject and idSprint in url if exists
    var idProject = $(document).getUrlParam("project");
    var idSprint = $(document).getUrlParam("sprint");

    //display the breadcrumb trail
    displayBreadCrumb(idProject);

    $("#submitButton").click( function() {
        var url = 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/save/'+idSprint;
        var formData = "";
        $("#sortableSelected li").each(function(i) {
            var idStory = $(this).attr("id").replace('userstory-','');
            if (i>0) {
                formData += ",";
            }
            formData += idStory;
        });
        if (formData=="") {
            formData = "empty"; 
        } 
        $.postObjToDatabase(url, formData, 'The Sprint', 'sprintList.html?project='+idProject);
    });

    //load data on list
    if((idProject !=="") && (idProject !==null))
    {
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+'/userstories/no');
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+'/userstories', 2);
        
        //velocity
        $.getObjFromDatabaseAndCallback('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+'/velocity', displayTotalVelocity);
        $.getObjFromDatabaseAndCallback('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+'/velocity/remaining', displayRemainingVelocity);
        
        storySprintManagerInit();
    }
});
