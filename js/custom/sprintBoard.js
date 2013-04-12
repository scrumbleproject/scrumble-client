
/** Sprintboard methods **/


//Global var
var processStatus;


//Display the breadCrumb trail
function displayBreadCrumb(idProject)
{
    var myTab = new Array();

    myTab['dashboard.html'] = 'Home';
    myTab['projectDashboard.html?project='+idProject+''] = 'Project (ID: '+idProject+')';
    myTab['sprintList.html?project='+idProject+''] = 'Sprint List';
    myTab[''] = 'Sprintboard'; 

    $.showBreadCrumb(myTab);
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    displayAllItems($.parseJSON(reponse));
}


function displayMembersAssignation(idSprint, idTask, idHtmlElement){
    
    $.ajax({
        url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+idSprint+'/'+idTask+'/members',
        type:'GET',
        contentType:'application/json; charset=UTF-8',
        success: function(response) {
            $("#"+idHtmlElement).html("");
            var items = $.parseJSON(response);
            if (items!=null){
                if (items.member1.length>1) {
                    $.each(items.member1, function(i, taskDico){
                        if (i>0){
                            $("#"+idHtmlElement).append("-");
                        }
                        $("#"+idHtmlElement).append($.trigramm(taskDico.firstname, taskDico.lastname));
                    });
                }
                else {
                    $("#"+idHtmlElement).html($.trigramm(items.member1.firstname, items.member1.lastname));
                }
            }

        },
        error:function (xhr, status, error)
        {
            bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
        },
        dataType:'text',
        converters:'text json'
    });
    
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


                //create empty column in middle if needed
                if (lastCodeStatus == config.processStatus.toDo && taskDico.idProcessStatus.codeStatus == config.processStatus.done){
                    htmlContent += "<div id='column-"+statusColumns[1]+"' class='userstory "+backgroundClass+"'>" +
                                "<ul id='sortable"+(userStoryIndex+1)+"-2'>" +
                                "</ul></div>";  
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

            var idHtmlElement = "task-assignation-"+taskDico.idTask;
            htmlContent += "<li class='task img-polaroid' id='task-"+taskDico.idTask+"'>"+$.truncateText(taskDico.title, 40)+"<div class='task-assignation' id='"+idHtmlElement+"'></div></li>";
            displayMembersAssignation($(document).getUrlParam("sprint"), taskDico.idTask, idHtmlElement);

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
                
                var idHtmlElement = "task-assignation-"+taskCollection.idTask;
                htmlContent += "<li class='task img-polaroid' id='task-"+taskCollection.idTask+"'>"+$.truncateText(taskCollection.title, 40)+"<div class='task-assignation' id='"+idHtmlElement+"'></div></li>";   
                displayMembersAssignation($(document).getUrlParam("sprint"), taskCollection.idTask, idHtmlElement);
            }
            
            //close column
            htmlContent += "</ul></div>";   
        }
    }
    return htmlContent;
}

function onTaskMove(item){
    //build a suitable id integer for ajax request
    var toRemove = 'task-';
    idTask = item.attr("id").replace(toRemove,'');

    toRemove = 'column-';
    $column = item.closest("div");
    status = $column.attr("id").replace(toRemove,'');

    //update task status
    var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+idTask+'/'+status;
    var formdata='';
    $.postObjToDatabaseAndCallback(url, formdata, '', handleMemberAssignation);

    
}

function handleMemberAssignation() {
    //add member assignation
    //get param in url if exists
    idSprint = $(document).getUrlParam("sprint");      
    //load data on list or on form
    if ( (idSprint !=="") && (idSprint !==null)) {
        if (status==config.processStatus.toDo) {
            var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+idSprint+'/'+idTask+'/'+$.getLoginFromCookie()+'/remove';
            var formdata='';
        }
        else {
            var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+idSprint+'/'+idTask+'/'+$.getLoginFromCookie()+'/add';
            var formdata='';
        }
        $.postObjToDatabase(url, formdata, '', '');

        //refresh assignation on screen - TO FIX !!!
        setTimeout(function() {
            displayMembersAssignation(idSprint, idTask, "task-assignation-"+idTask);
        }, 500);
    }
}


function askForProcessStatusFromSprint(idSprint){

    $.ajax({
        url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+"/status",
        type:'GET',
        contentType:'application/json; charset=UTF-8',
        success: function(reponse) 
        {
            processStatus = $.parseJSON(reponse);  
        },
        error:function (xhr, status, error)
        {
            bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
        },
        dataType:'text',
        converters:'text json'
    });

}

function handleEditMode(i){

    var idSprint = $(document).getUrlParam("sprint");

    if ( (idSprint !=="") && (idSprint !==null)) {

        if(processStatus.codeStatus==config.processStatus.inProgress){ //edit mode
                    
            //init current sortable list
            $( "#sortable"+(i+1)+"-1, #sortable"+(i+1)+"-2, #sortable"+(i+1)+"-3" ).sortable({
                connectWith: "#sortable"+(i+1)+"-1, #sortable"+(i+1)+"-2, #sortable"+(i+1)+"-3",
                receive: function(event, ui) {
                    onTaskMove(ui.item);
                }
            }).disableSelection();
        } else {//read mode
            $( "#sortable"+(i+1)+"-1, #sortable"+(i+1)+"-2, #sortable"+(i+1)+"-3").disableSelection();
            $( "#sortable"+(i+1)+"-1 li, #sortable"+(i+1)+"-2 li, #sortable"+(i+1)+"-3 li").addClass("task-inactive");
        }      
    }


}


//display all items
function displayAllItems(items){

    //get param in url if exists
    var idProject = $(document).getUrlParam("project");    

    if (items.userstory.length>1){ //if more than one user story

        //reinit div content
        $("#sprintboard").html("<div class='todo'><h3>TODO</h3></div> "+
            "<div class='assigned'><h3>PROCESSING</h3></div>"+
            "<div class='done'><h3>DONE</h3></div>");
        //append content
        $.each(items.userstory, function(i, storyDico){

            var backgroundClass = "odd";
            if (i % 2 == 1) backgroundClass = "even";

            var htmlContent = "<div class='userstory-title'><a href='"+"story.html?userstory="+storyDico.idUserstory+"&project="+idProject+"'>"+storyDico.title+" <i class='icon-eye-open icon-white'></i></a></div>";

            htmlContent += getTasksHtmlContentFromTasksCollection(storyDico.taskCollection, i, backgroundClass);

            $("#sprintboard").append(htmlContent);
            
            //init current sortable list
            handleEditMode(i);

        });
    }
    else { //if only one user story

        //reinit div content
        $("#sprintboard").html("<div class='todo'><h3>TODO</h3></div> "+
            "<div class='assigned'><h3>PROCESSING</h3></div>"+
            "<div class='done'><h3>DONE</h3></div>");

        //append content
        var htmlContent = "<div class='userstory-title'><a href='"+"story.html?userstory="+items.userstory.idUserstory+"&project="+idProject+"'>"+items.userstory.title+" <i class='icon-eye-open icon-white'></i></a></div>";

        htmlContent += getTasksHtmlContentFromTasksCollection(items.userstory.taskCollection, 0 , "odd");
        
        $("#sprintboard").append(htmlContent);

        //init current sortable list
        handleEditMode(0);

    }
}




        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function() {
    
    //get param in url if exists
    var idSprint = $(document).getUrlParam("sprint");
    var idProject = $(document).getUrlParam("project");

    //display the breadcrumb trail
    displayBreadCrumb(idProject);

    //load data on list or on form
    if ( (idSprint !=="") && (idSprint !==null)) {
        askForProcessStatusFromSprint(idSprint);
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+"/"+config.resources.userStories);
    }
});