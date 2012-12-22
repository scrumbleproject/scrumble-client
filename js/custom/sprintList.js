
/** sprintList functions **/



//Display all sprints
function displayAllItems(items)
{
    $("#sprints").html('');
    var chaine = '';

    //If there are more than one sprint
    if (items.sprint.length>1)
    {
        $.each(items.sprint, function(i, dico)
        {
            chaine += '<div class="accordion-group">'+
                        '<div class="accordion-heading">'+
                        '<div class="sprint-title"><a href="sprint.html?sprint='+dico.idSprint+'&project='+dico.idProject.idProject+'">'+dico.title+'</a></div>'+
                        '</div>'+
                        '<div id="collapseOne" class="accordion-body collapse in">'+
                        '<div class="accordion-inner">'+
                        '<a href="sprintBoard.html?sprint='+dico.idSprint+'&project='+dico.idProject.idProject+'">Lien vers le sprintboard du sprint numéro '+dico.idSprint+'</a>'+
                        '<div id="sprint-infos" class="row-fluid">';

            //Number of stories
            //if (typeof myVar != "undefined")
            //{
                chaine += '<div class="span2">'+
                            '<div class="head-sprint-info">'+
                            '<h3>A FAIRE</h3>'+
                            '</div>'+
                            '<div class="legend-sprint-info">'+
                            '<p>Stories</p>'+
                            '</div>'+
                            '</div>';
            //}

            //Velocity
            if (typeof dico.velocity != "undefined")
            {
                chaine += '<div class="span2">'+
                            '<div class="head-sprint-info">'+
                            '<h3>'+dico.velocity+'</h3>'+
                            '</div>'+
                            '<div class="legend-sprint-info">'+
                            '<p>Velocity</p>'+
                            '</div>'+
                            '</div>';
            }

            //Sprint start
            if (typeof dico.dateStart!= "undefined")
            {
                chaine += '<div class="span2">'+
                            '<div class="head-sprint-info">'+
                            '<h3>'+dico.dateStart.substr(0,10)+
                            '</h3>'+
                            '</div>'+
                            '<div class="legend-sprint-info">'+
                            '<p>Sprint start</p>'+
                            '</div>'+
                            '</div>';
            }

            //Sprint end
            if (typeof dico.dateEnd != "undefined")
            {
                chaine += '<div class="span2">'+
                            '<div class="head-sprint-info">'+
                            '<h3>'+dico.dateEnd.substr(0,10)+
                            '</h3>'+
                            '</div>'+
                            '<div class="legend-sprint-info">'+
                            '<p>Sprint end</p>'+
                            '</div>'+
                            '</div>';
            }

            //Duration
            if (typeof dico.duree != "undefined")
            {
                chaine += '<div class="span2">'+
                            '<div class="head-sprint-info">'+
                            '<h3>'+dico.duree+'</h3>'+
                            '</div>'+
                            '<div class="legend-sprint-info">'+
                            '<p>Duration</p>'+
                            '</div>'+
                            '</div>';
            }

            //Progression
            //if (typeof myVar != "undefined")
            //{
                chaine += '<div class="span2">'+
                            '<div class="head-sprint-info">'+
                            '<h3>A FAIRE</h3>'+
                            '</div>'+
                            '<div class="legend-sprint-info">'+
                            '<p>Progression</p>'+
                            '</div>'+
                            '</div>';
            //}
            chaine += '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>';
        });
    }
    else //If there is only one sprint
    {
        chaine += '<div class="accordion-group">'+
                    '<div class="accordion-heading">'+
                        '<div class="sprint-title"><a href="sprint.html?sprint='+items.sprint.idSprint+'&project='+items.sprint.idProject.idProject+'">'+items.sprint.title+'</a></div>'+
                    '</div>'+
                    '<div id="collapseOne" class="accordion-body collapse in">'+
                    '<div class="accordion-inner">'+
                    '<a href="sprintBoard.html?sprint='+items.sprint.idSprint+'&project='+items.sprint.idProject.idProject+'">Lien vers le sprintboard du sprint numéro '+items.sprint.idSprint+'</a>'+
                    '<div id="sprint-infos" class="row-fluid">';

        //Number of stories
        //if (typeof myVar != "undefined")
        //{
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>A FAIRE</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Stories</p>'+
                        '</div>'+
                        '</div>';
        //}

        //Velocity
        if (typeof items.sprint.velocity != "undefined")
        {
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+items.sprint.velocity+'</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Velocity</p>'+
                        '</div>'+
                        '</div>';
        }

        //Sprint start
        if (typeof items.sprint.dateStart != "undefined")
        {
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+items.sprint.dateStart.substr(0,10)+
                        '</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Sprint start</p>'+
                        '</div>'+
                        '</div>';
        }

        //Sprint end
        if (typeof items.sprint.dateEnd != "undefined")
        {
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+items.sprint.dateEnd.substr(0,10)+
                        '</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Sprint end</p>'+
                        '</div>'+
                        '</div>';
        }

        //Duration
        if (typeof items.sprint.duree != "undefined")
        {
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+items.sprint.duree+'</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Duration</p>'+
                        '</div>'+
                        '</div>';
        }

        //Progression
        //if (typeof myVar != "undefined")
        //{
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>A FAIRE</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Progression</p>'+
                        '</div>'+
                        '</div>';
        //}
    }

    $("#sprints").append(chaine);
}



/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function()
{
    //Get parameter idProject in url if it exists
    var idProject = $(document).getUrlParam("project");
    
    //Get the list of sprints for the project
    if (idProject !=="" && idProject !==null) 
    {
        //Display the button New sprint
        $('#sprintList').append('<div class="row-fluid">'+
                                    '<h2>Sprints</h2>'+
                                    '<a href="sprint.html?project='+idProject+'" class="btn btn-primary new">New sprint</a>'+
                                    '<div class="sprints" id="sprints">'+
                                    '</div>'+
                                '</div>');

        //Get all sprints for the project and display the list
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idProject+'/projects',
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success: function(reponse) {
                displayAllItems($.parseJSON(reponse));
            },
            error:function (xhr, status, error){
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType: 'text',
            converters: 'text json'
        }); 
    }
});