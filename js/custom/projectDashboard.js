
/** projectDashboard methods **/



//Display the breadCrumb trail
function displayBreadCrumb(idProject)
{
    var myTab = new Array();

    myTab['dashboard.html'] = 'Home';
    myTab['projectDashboard.html?project='+idProject+''] = 'Project (ID: '+idProject+')';
    myTab[''] = 'Project Dashboard'; 

    $.showBreadCrumb(myTab);
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    displayMembers($.parseJSON(reponse));
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjSecondLevel(reponse)
{
    displaySprint($.parseJSON(reponse));
}



//Display all sprints
function displaySprint(items)
{
    $("#sprints").html('');
    var chaine = '';

    if(items!= null && typeof items != "undefined")
    {
        var startStopButtonLbl = "Launch Sprint";
        var startStopButtonColorClass = "btn-success";
        if(items.idProcessStatus.codeStatus==config.processStatus.inProgress){
            startStopButtonLbl = "End";
            startStopButtonColorClass = "btn-warning";
        }else if(items.idProcessStatus.codeStatus==config.processStatus.done){
            startStopButtonLbl = "Completed";
            startStopButtonColorClass="disabled";
        }

        chaine += '<div class="accordion-group">'+
                    '<div class="accordion-heading">'+
                    '<div class="sprint-title"><a href="sprint.html?sprint='+items.idSprint+'&project='+items.idProject.idProject+'">'+items.title+'</a></div>'+
                    '</div>'+
                    '<div id="collapseOne" class="accordion-body collapse in">'+
                    '<div class="accordion-inner">'+
                    '<div class="sprint-buttons">'+
                    '<button id="sprint-'+items.idSprint+'-'+items.idProcessStatus.codeStatus+'" class="btn btn-large '+startStopButtonColorClass+' start-stop-btn">'+startStopButtonLbl+'</button>'+
                    '</div>'+
                    '<ul>'+
                    '<li><a href="sprintStoryManagement.html?sprint='+items.idSprint+'&project='+items.idProject.idProject+'" title="Add/Remove User Stories"><img src="../img/glyphicons_114_list.png" border=0 /></a></li>'+
                    '<li><a href="sprintBoard.html?sprint='+items.idSprint+'&project='+items.idProject.idProject+'" title="Sprint Backlog"><img src="../img/glyphicons_119_table.png" border=0 /></a></li>'+
                    '<li><a href="sprintBurndownChart.html?sprint='+items.idSprint+'&project='+items.idProject.idProject+'" title="Burndown Chart"><img src="../img/glyphicons_040_stats.png" border=0 /></a></li>'+
                    '</ul>'+
                    '<div id="sprint-infos" class="row-fluid">';


        //Number of stories
        $.ajax({
            url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+items.idSprint+'/userstorynumber',
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
        if (typeof items.velocity != "undefined")
        {
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+items.velocity+'</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Velocity Points</p>'+
                        '</div>'+
                        '</div>';
        }

        //Sprint start
        if (typeof items.dateStart != "undefined")
        {
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+items.dateStart.substr(0,10)+
                        '</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Sprint start</p>'+
                        '</div>'+
                        '</div>';
        }

        //Sprint end
        if (typeof items.dateEnd != "undefined")
        {
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+items.dateEnd.substr(0,10)+
                        '</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Sprint end</p>'+
                        '</div>'+
                        '</div>';
        }

        //Duration
        /*if (typeof items.duree != "undefined")
        {
            chaine += '<div class="span2">'+
                        '<div class="head-sprint-info">'+
                        '<h3>'+items.duree+'</h3>'+
                        '</div>'+
                        '<div class="legend-sprint-info">'+
                        '<p>Duration</p>'+
                        '</div>'+
                        '</div>';
        }*/

        //Progression
        $.ajax({
            url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+items.idSprint+'/progression',
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


        $("#sprints").append(chaine);

        //enable start-stop-btn action
        $(".start-stop-btn").each(function() {

            $(this).live('click', function(e){
                var params = $(this).attr("id").split('-');
                changeSprintStatus(params[2], params[3]);
            });
        });


        //Get running tasks
        $.ajax({
            url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.tasks+'/'+items.idSprint+'/runningtasks',
            async:false,
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success: function(reponse) 
            {
                data = $.parseJSON(reponse);
                console.log(data);
                if(data!= null && typeof data != "undefined")
                {
                    //if more than one task
                    if (data.sprinttaskassignation.length>1)
                    {
                        $("#runningtasks-tab > tbody").html("");

                        $.each(data.sprinttaskassignation, function(i, dico){
                            $("#runningtasks-tab > tbody").append("<tr>"+
                                                            //"<td>"+(i+1)+"</td>"+
                                                            "<td>"+dico.task.title+"</td>"+
                                                            "<td>"+dico.member1.firstname+" "+dico.member1.lastname+"</td>"+
                                                            //"<td>"+dico.lastname+"</td>"+
                                                            //"<td>"+dico.idRole.title+"</td>"+
                                                            //"<td>"+dico.email+"</td>"+
                                                            //"<td>"+dico.internalPhone+"</td>"+
                                                            //"<td>"+dico.mobilePhone+"</td>"+
                                                            //"<td><a class='btn btn-danger btn-danger btn-delete' href='"+dico.idMember+"'><i class='icon-remove'></i></a></td>"+
                                                            "</tr>");
                            i++;
                        });
                    }
                    else //if only one member
                    {
                        $("#runningtasks-tab > tbody").append("<tr>"+
                                                        //"<td>1</td>"+
                                                        "<td>"+data.sprinttaskassignation.task.title+"</td>"+
                                                        "<td>"+data.sprinttaskassignation.member1.firstname+" "+data.sprinttaskassignation.member1.lastname+"</td>"+
                                                        //"<td>"+items.member1.lastname+"</td>"+
                                                        //"<td>"+items.member1.idRole.title+"</td>"+
                                                        //"<td>"+items.member1.email+"</td>"+
                                                        //"<td>"+items.member1.internalPhone+"</td>"+
                                                        //"<td>"+items.member1.mobilePhone+"</td>"+
                                                        //"<td><a class='btn btn-danger btn-danger btn-delete' href='"+items.member1.idMember+"'><i class='icon-remove'></i></a></td>"+
                                                        "</tr>");
                    }
                    //sprintBoard.html?sprint='+items.idSprint+'&project='+items.idProject.idProject+'
                    $("#runningtasks").append('<a href="sprintBoard.html?sprint='+items.idSprint+'&project='+items.idProject.idProject+'" class="btn">More »</a>');
                }
                else
                {
                    $("#runningtasks").html("");
                    $("#runningtasks").append('<span id="msg" class="alert fade in" style="padding-right:14px;">Currently, there is no task in progress.</span>');
                }
            },
            error:function (xhr, status, error)
            {
                //bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType:'text',
            converters:'text json'
        });

    }
    else
    {
        $("#sprints").append('<span id="msg" class="alert fade in" style="padding-right:14px;">Currently, there is no running sprint.</span>');
        $("#runningtasks").html("");
        $("#runningtasks").append('<span id="msg" class="alert fade in" style="padding-right:14px;">Currently, there is no task in progress.</span>');
    }
}



//display Members
function displayMembers(items)
{
    //if more than one members
    if (items.member1.length>1)
    {
        var i = 0 ;
        $("#memberList > tbody").html("");
        $.each(items.member1, function(i, dico){
            if(i>=4)
                return false;

            $("#memberList > tbody").append("<tr>"+
                                            //"<td>"+(i+1)+"</td>"+
                                            "<td>"+dico.login+"</td>"+
                                            "<td>"+dico.firstname+"</td>"+
                                            "<td>"+dico.lastname+"</td>"+
                                            //"<td>"+dico.idRole.title+"</td>"+
                                            //"<td>"+dico.email+"</td>"+
                                            //"<td>"+dico.internalPhone+"</td>"+
                                            //"<td>"+dico.mobilePhone+"</td>"+
                                            //"<td><a class='btn btn-danger btn-danger btn-delete' href='"+dico.idMember+"'><i class='icon-remove'></i></a></td>"+
                                            "</tr>");
            i++;
        });
    }
    else //if only one member
    {
        $("#memberList > tbody").append("<tr>"+
                                        //"<td>1</td>"+
                                        "<td>"+items.member1.login+"</td>"+
                                        "<td>"+items.member1.firstname+"</td>"+
                                        "<td>"+items.member1.lastname+"</td>"+
                                        //"<td>"+items.member1.idRole.title+"</td>"+
                                        //"<td>"+items.member1.email+"</td>"+
                                        //"<td>"+items.member1.internalPhone+"</td>"+
                                        //"<td>"+items.member1.mobilePhone+"</td>"+
                                        //"<td><a class='btn btn-danger btn-danger btn-delete' href='"+items.member1.idMember+"'><i class='icon-remove'></i></a></td>"+
                                        "</tr>");
    }
}



/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function() 
{
    //get param idProject in url if exists
    var idProject = $(document).getUrlParam("project");

    //display the breadcrumb trail
    displayBreadCrumb(idProject);


    if (idProject !=="" && idProject !==null) 
    {
        //Get the running sprint for the project
        $('#runningsprint').append('<div class="sprints" id="sprints">'+
                                    '</div>'+
                                '</div>');
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idProject+'/runningsprint', 2);


        //Display the member list
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject+'/'+config.resources.projectMembers);
        $('#memberdetails').html("");
        $('#memberdetails').append('<a href="projectMember.html?project='+idProject+'" class="btn">More »</a>');
    }


    


    //load data on form
    if((idProject !=="") && (idProject !==null))
    {
        $('#projectDashboard').append('<a href="project.html?project='+idProject+'">Informations générales du projet</a><br/>'+
                                        '<a href="sprintList.html?project='+idProject+'">Gestion des sprints</a><br/>'+
                                        '<a href="storyList.html?project='+idProject+'">Gestion des userstories</a><br/>'+
                                        '<a href="projectMember.html?project='+idProject+'">Gestion des membres rattachés au projet</a><br/>');                               
    }
});