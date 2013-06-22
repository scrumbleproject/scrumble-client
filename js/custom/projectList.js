
/** projectList methods **/



//Display the breadCrumb trail
function displayBreadCrumb()
{
    var myTab = new Array();

    myTab['dashboard.html'] = 'Home';
    myTab[''] = 'Project List';

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
    //if more than one project
    if(items.project.length>1)
    { 
        $("#projects-list").html("");
        $.each(items.project, function(i, dico)
        {
            $("#projects-list").append("<li class='span3'><div class='thumbnail'><img alt='' src='../img/project.jpg'><div class='caption'><div class='id-project'>ID: " + dico.idProject +"</div><a href='projectDashboard.html?project=" + dico.idProject +"'><h3 class='project-list'>"+ dico.title + "</h3></a>"+
                    "<p>" + dico.description + "</p> </div> </div> </li>" 
                    );
        });   
    }
    else //if only one project
    {
        $("#projects-list").append("<li c class='span3'><div class='thumbnail'><img alt='' src='../img/project.jpg'><div class='caption'><div class='id-project'>ID: " + items.project.idProject +"</div><a href='projectDashboard.html?project=" + items.project.idProject +"'><h3 class='project-list'>"+items.project.title+"</h3></a><p>" + items.project.description +"</p></div> </div></li>");
    }
}

//function call $.getLoginFromCookie (auth.js)
function getLogin()
{
    return $.getLoginFromCookie();
}


/** Put here all calls that you want to launch at the page startup **/      
$(document).ready( function() 
{
    //display the breadcrumb trail
    displayBreadCrumb();
    
    var login=getLogin();

    $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+login+'/project');
});
