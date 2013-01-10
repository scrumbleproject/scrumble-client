
/** projectList methods **/



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
            $("#projects-list").append("<li class='span3'><div class='thumbnail'><img alt='' src='http://placehold.it/300x200'><div class='caption'><a href='projectDashboard.html?project=" + dico.idProject +"'><h3>"+ dico.title + "</h3></a>"+
                    "<p>" + dico.description + "</p> </div> </div> </li>" 
                    );
        });   
    }
    else //if only one project
    {
        $("#projects-list").append("<li c class='span3'><div class='thumbnail'><img alt='' src='http://placehold.it/300x200'><div class='caption'><a href='projectDashboard.html?project=" + items.project.idProject +"'><h3>"+items.project.title+"</h3></a><p>" + items.project.description +"</p></div> </div></li>");
    }
}



/** Put here all calls that you want to launch at the page startup **/      
$(document).ready( function() 
{
    $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/all');
});