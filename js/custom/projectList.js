
/** projectList methods **/



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
    $.ajax({
        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/all',
        type:'GET',
        contentType:'application/json; charset=UTF-8',
        success:function(reponse)
        {
            displayAllItems($.parseJSON(reponse));
        },
        error:function(xhr, status, error)
        {
            bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
        },
        dataType:'text',
        converters:'text json'
    }); 
});
