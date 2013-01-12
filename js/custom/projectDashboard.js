
/** projectDashboard methods **/



//Display the breadCrumb trail
function displayBreadCrumb(idProject)
{
        $("#breadcrumb").append('<ul class="breadcrumb">'+
            '<li>'+
                '<a href="projectList.html">Project List</a> <span class="divider">/</span>'+
            '</li>'+
            '<li class="active">Project Dashboard</li>'+
        '</ul>');
}



/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function() 
{
    //get param idProject in url if exists
    var idProject = $(document).getUrlParam("project");

    //display the breadcrumb trail
    displayBreadCrumb(idProject);

    //load data on form
    if((idProject !=="") && (idProject !==null))
    {
        $('#projectDashboard').append('<a href="project.html?project='+idProject+'">Informations générales du projet</a><br/>'+
                                        '<a href="sprintList.html?project='+idProject+'">Gestion des sprints</a><br/>'+
                                        '<a href="storyList.html?project='+idProject+'">Gestion des userstories</a><br/>'+
                                        '<a href="projectMember.html?project='+idProject+'">Gestion des membres rattachés au projet</a><br/>');                               
    }
});