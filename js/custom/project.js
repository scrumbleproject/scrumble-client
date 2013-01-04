
/** project methods **/


//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    fillForm($.parseJSON(reponse));
    bindDeleteEvent();
}



//fill the form with data about one project
function fillForm(response)
{
    $("#idProject").val(response.idProject);
    $("#title").val(response.title);
    $("#description").val(response.description);
}



//add an event on <a> delete button
function bindDeleteEvent()
{
    $("button.btn-delete").show();
    
    //fetch each <a> delete button
    $("button.btn-delete").live('click', function(e)
    {
        //show a confirm box
        e.preventDefault();
        bootbox.confirm("Are you sure to delete this project ?", function(confirmed)
        {
            if(confirmed)
            {
                var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+$("#idProject").val();
                $.deleteObjFromDatabase(url, 'Project', 'projectList.html');
            }
        });
    });
}


<<<<<<< HEAD
		
/** Put here all calls that you want to launch at the page startup **/		
$(document).ready( function() {

  
	
	//get param idProject in url if exists
=======
        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function() 
{
    //get param idProject in url if exists
>>>>>>> d3e9f5b520cf70704a192e4eed21fa46a7706e4d
    var idProject = $(document).getUrlParam("project");

    //load data on form
    if((idProject !=="") && (idProject !==null))
    {
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject);
    }


    //action on #formProject form
    $('#formProject').submit(function()
    {
        //Get #idProject field value    
        var idProject = $("#idProject").val();

        if(idProject==null && idProject.length==0)
        {
            //Case 1 : create a project (idProject is empty)
            var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/add';
            var formdata=JSON.stringify($('#formProject').serializeObject());
            $.postObjToDatabase(url, formdata, 'Project', 'projectList.html');
        }
        else //Case 2 : update an existing member (idProject is not empty)
        {
            var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects;
            var formdata=JSON.stringify($('#formProject').serializeObject());
            $.putObjToDatabase(url, formdata, 'Project', 'projectList.html');
        }

        return false;
    });
});
