
/** sprintList functions **/



//Display the breadCrumb trail
function displayBreadCrumb(idProject)
{
    var myTab = new Array();

    myTab['dashboard.html'] = 'Home';
    myTab['projectDashboard.html?project='+idProject+''] = 'Project (ID: '+idProject+')';
    myTab[''] = 'Sprint List'; 

    $.showBreadCrumb(myTab);
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    displayAllItems($.parseJSON(reponse));
}



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
            var startStopButtonLbl = "Launch Sprint";
            var startStopButtonColorClass = "btn-success";
            if(dico.idProcessStatus.codeStatus==config.processStatus.inProgress){
                startStopButtonLbl = "End";
                startStopButtonColorClass = "btn-warning";
            }else if(dico.idProcessStatus.codeStatus==config.processStatus.done){
                startStopButtonLbl = "Completed";
                startStopButtonColorClass="disabled";
            }

            chaine += '<div class="accordion-group">'+
                        '<div class="accordion-heading">'+
                        '<div class="sprint-title"><a href="sprint.html?sprint='+dico.idSprint+'&project='+dico.idProject.idProject+'">'+dico.title+'</a></div>'+
                        '</div>'+
                        '<div id="collapseOne" class="accordion-body collapse in">'+
                        '<div class="accordion-inner">'+
                        '<div class="sprint-buttons">'+
                        '<button id="btn-sprint-'+dico.idSprint+'-'+dico.idProcessStatus.codeStatus+'" class="btn btn-large '+startStopButtonColorClass+' start-stop-btn">'+startStopButtonLbl+'</button>'+
                        '</div>'+
                        '<ul>'+
                        '<li><a href="sprintStoryManagement.html?sprint='+dico.idSprint+'&project='+dico.idProject.idProject+'">Gérer les user stories du sprint n°'+dico.idSprint+'</a></li>'+
                        '<li><a href="sprintBoard.html?sprint='+dico.idSprint+'&project='+dico.idProject.idProject+'">Sprintboard du sprint n°'+dico.idSprint+'</a></li>'+
                        '<li><a href="sprintBurndownChart.html?sprint='+dico.idSprint+'&project='+dico.idProject.idProject+'">Burndownchart du sprint n°'+dico.idSprint+'</a></li>'+
                        '</ul>'+
                        '<div id="sprint-infos" class="row-fluid">';

            //Number of stories
            $.ajax({
                url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+dico.idSprint+'/userstorynumber',
                async:false,
                type:'GET',
                contentType:'application/json; charset=UTF-8',
                success: function(reponse) 
                {
                    data = $.parseJSON(reponse);

                    chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+data['UserstoryNumber']+'</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Stories</p>'+
                        '</div>'+
                        '</div>';
                },
                error:function (xhr, status, error)
                {
                    //bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                },
                dataType:'text',
                converters:'text json'
            });

            //Velocity
            if (typeof dico.velocity != "undefined")
            {
                chaine += '<div class="span2">'+
                            '<div class="head-sprint-info">'+
                            '<h3>'+dico.velocity+'</h3>'+
                            '</div>'+
                            '<div class="legend-sprint-info">'+
                            '<p>Velocity Points</p>'+
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
            /*if (typeof dico.duree != "undefined")
            {
                chaine += '<div class="span2">'+
                            '<div class="head-sprint-info">'+
                            '<h3>'+dico.duree+'</h3>'+
                            '</div>'+
                            '<div class="legend-sprint-info">'+
                            '<p>Duration</p>'+
                            '</div>'+
                            '</div>';
            }*/

            //Progression
            $.ajax({
                url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+dico.idSprint+'/progression',
                async:false,
                type:'GET',
                contentType:'application/json; charset=UTF-8',
                success: function(reponse) 
                {
                    data = $.parseJSON(reponse);

                    chaine += '<div class="span2">'+
                            '<div class="head-sprint-info">'+
                            '<h3>'+Math.round((data['Progression']) * 10) / 10+' %</h3>'+
                            '</div>'+
                            '<div class="legend-sprint-info">'+
                            '<p>Progression</p>'+
                            '</div>'+
                            '</div>';
                },
                error:function (xhr, status, error)
                {
                    //bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                },
                dataType:'text',
                converters:'text json'
            });


            chaine += '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>';
        });
    }
    else //If there is only one sprint
    {

        var startStopButtonLbl = "Launch Sprint";
        var startStopButtonColorClass = "btn-success";
        if(items.sprint.idProcessStatus.codeStatus==config.processStatus.inProgress){
            startStopButtonLbl = "End";
            startStopButtonColorClass = "btn-warning";
        }else if(items.sprint.idProcessStatus.codeStatus==config.processStatus.done){
            startStopButtonLbl = "Completed";
            startStopButtonColorClass="disabled";
        }

        chaine += '<div class="accordion-group">'+
                    '<div class="accordion-heading">'+
                    '<div class="sprint-title"><a href="sprint.html?sprint='+items.sprint.idSprint+'&project='+items.sprint.idProject.idProject+'">'+items.sprint.title+'</a></div>'+
                    '</div>'+
                    '<div id="collapseOne" class="accordion-body collapse in">'+
                    '<div class="accordion-inner">'+
                    '<div class="sprint-buttons">'+
                    '<button id="sprint-'+items.sprint.idSprint+'-'+items.sprint.idProcessStatus.codeStatus+'" class="btn btn-large '+startStopButtonColorClass+' start-stop-btn">'+startStopButtonLbl+'</button>'+
                    '</div>'+
                    '<ul>'+
                    '<li><a href="sprintStoryManagement.html?sprint='+items.sprint.idSprint+'&project='+items.sprint.idProject.idProject+'">Gérer les user stories du sprint n°'+items.sprint.idSprint+'</a></li>'+
                    '<li><a href="sprintBoard.html?sprint='+items.sprint.idSprint+'&project='+items.sprint.idProject.idProject+'">Sprintboard du sprint n°'+items.sprint.idSprint+'</a></li>'+
                    '<li><a href="sprintBurndownChart.html?sprint='+items.sprint.idSprint+'&project='+items.sprint.idProject.idProject+'">Burndownchart du sprint n°'+items.sprint.idSprint+'</a></li>'+
                    '</ul>'+
                    '<div id="sprint-infos" class="row-fluid">';


        //Number of stories
        $.ajax({
            url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+items.sprint.idSprint+'/userstorynumber',
            async:false,
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success: function(reponse) 
            {
                data = $.parseJSON(reponse);

                chaine += '<div class="span2">'+
                    '<div class="head-sprint-info">'+
                    '<h3>'+data['UserstoryNumber']+'</h3>'+
                    '</div>'+
                    '<div class="legend-sprint-info">'+
                    '<p>Stories</p>'+
                    '</div>'+
                    '</div>';
            },
            error:function (xhr, status, error)
            {
                //bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType:'text',
            converters:'text json'
        });


        //Velocity
        if (typeof items.sprint.velocity != "undefined")
        {
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+items.sprint.velocity+'</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Velocity Points</p>'+
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
        /*if (typeof items.sprint.duree != "undefined")
        {
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+items.sprint.duree+'</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Duration</p>'+
                        '</div>'+
                        '</div>';
        }*/

        //Progression
        $.ajax({
            url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+items.sprint.idSprint+'/progression',
            async:false,
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success: function(reponse) 
            {
                data = $.parseJSON(reponse);

                chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+Math.round((data['Progression']) * 10) / 10+' %</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Progression</p>'+
                        '</div>'+
                        '</div>';
            },
            error:function (xhr, status, error)
            {
                //bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType:'text',
            converters:'text json'
        });

        chaine += '</div>'+
                '</div>'+
              '</div>'+
            '</div>';
    }

    $("#sprints").append(chaine);

    //enable start-stop-btn action
    $(".start-stop-btn").each(function() {

        $(this).live('click', function(e){
            var params = $(this).attr("id").split('-');
            changeSprintStatus(params[2], params[3]);
        });
    });
}


function changeSprintStatus(idSprint, status){

    console.log("idSprint="+idSprint);
    console.log("status="+status);
    if (status == config.processStatus.toDo || status == config.processStatus.inProgress) {   
        if (status == config.processStatus.toDo) {
            status = config.processStatus.inProgress;
        } else if (status == config.processStatus.inProgress) {
            status = config.processStatus.done;
        }
        var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint+'/'+status;
        var idProject = $(document).getUrlParam("project");
        $.postObjToDatabase(url, '', '', 'sprintList.html?project='+idProject);
    }
}


/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function()
{
    //Get parameter idProject in url if it exists
    var idProject = $(document).getUrlParam("project");

    //display the breadcrumb trail
    displayBreadCrumb(idProject);
    
    //Get the list of sprints for the project
    if (idProject !=="" && idProject !==null) 
    {
        //Display the button New sprint
        $('#sprintList').append('<div class="row-fluid">'+
                                   
                                    '<h2>Sprint List</h2>'+
                                    '<a href="sprint.html?project='+idProject+'" class="btn btn-primary new">New sprint</a>'+
                                    '<div class="sprints" id="sprints">'+
                                    '</div>'+
                                '</div>');

        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idProject+'/projects');
    }
});
