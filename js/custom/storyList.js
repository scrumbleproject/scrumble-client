
/** storyList methods **/



//Display the breadCrumb trail
function displayBreadCrumb(idProject)
{
    var myTab = new Array();

    myTab['dashboard.html'] = 'Home';
    myTab['projectDashboard.html?project='+idProject+''] = 'Project (ID: '+idProject+')';
    myTab[''] = 'User Story Backlog'; 

    $.showBreadCrumb(myTab);
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    displayAllItems($.parseJSON(reponse));
}



//display all items
function displayAllItems(items)
{
    //If there is no user story
    if (items==null) 
    {
        //warning msg to inform user that user story cannot be edited
        $("#msg").addClass("alert fade in");
        $("#msg").html("No user story found.");

    } else if (items.userstory.length>1) //if more than one user story
    { 
        $("#userstories-list").html("");
        $("#userstories-list").prepend("<li class='pin'><img src='../img/more-important-black.png' border=0 /></li>");
        $.each(items.userstory, function(i, dico)
        {
            $("#userstories-list").append("<li class='img-polaroid' id='user-story-"+dico.idUserstory+"'>"+
                    "<a class='edit' href='story.html?userstory="+dico.idUserstory+"&project="+dico.idProject.idProject+"'><img class='icon-eye-open'/></a>"+
                    "<div class='title'>"+ dico.title + "</div>" +
                    "<div class='estimation-label'>Point(s)</div><div class='estimation-value'>"+ $.nvl(dico.estimation, "N/A") + "</div>" +
                "</li>");
        });   
        $("#userstories-list").append("<li class='pin'><img src='../img/less-important-black.png' border=0 /></li>");
    }
    else //if only one user story
    {
        $("#userstories-list").prepend("<li class='pin'><img src='../img/more-important-black.png' border=0 /></li>");
        $("#userstories-list").append("<li class='img-polaroid' id='user-story-"+items.userstory.idUserstory+"'>"+
                "<a class='edit' href='story.html?userstory="+items.userstory.idUserstory+"&project="+items.userstory.idProject.idProject+"'><img class='icon-eye-open'/></a>"+
                "<div class='title'>"+ items.userstory.title + "</div>" +
                "<div class='estimation-label'>Point(s)</div><div class='estimation-value'>"+ $.nvl(items.userstory.estimation, "N/A") + "</div>" +
            "</li>");
        $("#userstories-list").append("<li class='pin'><img src='../img/less-important-black.png' border=0 /></li>");
    }

    //init sortable list
    $( "#userstories-list" ).sortable({
        items: '> li:not(.pin)',
        update:function(event, ui) {
            
            //build a suitable id integer for ajax request
            var toRemove = 'user-story-';
            var idStory = ui.item.attr("id").replace(toRemove,'');
 
            //run ajax request
            var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idStory+'/'+ui.item.index();
            var formdata='';
            $.postObjToDatabase(url, formdata, '', '');
        }   
    });
    $( "#userstories-list" ).disableSelection();
}


        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function()
{
    //get parameters idProject in url if exists
    var idProject = $(document).getUrlParam("project");

    //display the breadcrumb trail
    displayBreadCrumb(idProject);

    $('#newstorybtn').append('<a class="btn btn-primary" href="story.html?project='+idProject+'">New story</a>');

    //load data on list
    if((idProject !=="") && (idProject !==null)) 
    {
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idProject+'/projects');
    }
});
