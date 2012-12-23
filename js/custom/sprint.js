
/** sprint functions **/



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    fillForm($.parseJSON(reponse));
    bindDeleteUserStoryEvent(idProject);
}



//Fill the form with data about one sprint
function fillForm(response) 
{
    $("#idSprint").val(response.idSprint);
    $("#numSprint").val(response.numSprint);
    $("#title").val(response.title);
    $("#velocity").val(response.velocity);
    if(typeof response.dateStart!= "undefined")
        $("#dateStart").val(response.dateStart.substr(0,10));
    if(typeof response.dateEnd!= "undefined")
        $("#dateEnd").val(response.dateEnd.substr(0,10));
    $("#duree").val(response.duree);
}



//Add an event on delete <button> 
function bindDeleteUserStoryEvent(idProject)
{
    $('#btn-delete').show();

    //Fetch each <a> delete button
    $('#btn-delete').live('click', function(e)
    {
        //Show a confirm box
        e.preventDefault();
        bootbox.confirm("Are you sure to delete this sprint ?", function(confirmed) 
        {
            if (confirmed)
            {
                var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+$("#idSprint").val();
                $.deleteObjFromDatabase(url, 'Sprint', 'sprintList.html?project='+idProject);
            }
        });
    });
}



//Put here all calls that you want to launch at the page startup      
$(document).ready(function()
{
    //Get parameters idProject and idSprint in url if it exists
    idProject = $(document).getUrlParam("project");
    idSprint = $(document).getUrlParam("sprint");

    //Get information from the Web Service, display in the form
    if(idSprint!=="" && idSprint!==null) 
    {
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint);
    }
    
    //Action on #formSprint form
    $('#formSprint').submit(function() 
    {
        objectform = $('#formSprint').serializeObject();
        if(objectform.dateEnd!='')
            objectform.dateEnd += 'T00:00:00+01:00';
        if(objectform.dateStart!='')
            objectform.dateStart += 'T00:00:00+01:00';

        //Case 1 : create a new sprint (idSprint is empty)
        if (idSprint==null || idSprint.length==0)
        {
            var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/add/'+idProject;
            var formdata=JSON.stringify(objectform);
            $.postObjToDatabase(url, formdata, 'Sprint', 'sprintList.html?project='+idProject);
        }
        else //Case 2 : update an existing sprint (idSprint is not empty)
        {
            objectform = $('#formSprint').serializeObject();
            if(objectform.dateEnd!='')
                objectform.dateEnd += 'T00:00:00+01:00';
            if(objectform.dateStart!='')
                objectform.dateStart += 'T00:00:00+01:00';

            var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idProject;
            var formdata=JSON.stringify(objectform);
            $.putObjToDatabase(url, formdata, 'Sprint', 'sprintList.html?project='+idProject);
        }

        return false;
    });
});