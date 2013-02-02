
/** storyList methods **/



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    displayAllItems($.parseJSON(reponse));
    storySprint();
}

/*Add story in sprint

     Blue color show the story in the sprint
     White color show the story not in the sprintje

*/
function storySprint()
{
   $('.img-polaroid').click(function () {
        if($(this).css("element.style","white")){
            $(this).css("background-color","#3A87AD");
        }
        else {
            $(this).css("background-color","white");
        }        
   });    
}



//display all items
function displayAllItems(items)
{
    //if more than one user story
    if (items.userstory.length>1)
    { 
        $("#userstories-list").html("");
        $.each(items.userstory, function(i, dico)
        {
            $("#userstories-list").append("<li class='img-polaroid' id='user-story-"+dico.idUserstory+"'>"+
                    
                    "<div class='title'><p>"+ dico.title + "<p></div>" +
                    "<div class='estimation-label'>Days/Person</div><div class='estimation-value'>"+ $.nvl(dico.estimation, "N/A") + "</div>" +
                "</li>");
        });
        
    }
    else //if only one user story
    {
        $("#userstories-list").append("<li class='img-polaroid'>"+items.userstory.title+"</li>");
    }

}


        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function()
{
    //get parameters idProject and idSprint in url if exists
    var idProject = $(document).getUrlParam("project");
    var idSprint = $(document).getUrlParam("sprint");

    //load data on list
    if((idProject !=="") && (idProject !==null))
    {
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+'/userstories/no');
    }
});