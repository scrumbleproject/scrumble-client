
/** sprint functions **/



//Fill the form with data about one sprint
function fillForm(response) 
{
    $("#idSprint").val(response.idSprint);
    $("#numSprint").val(response.numSprint);
    $("#title").val(response.title);
    $("#velocity").val(response.velocity);
    $("#dateStart").val(response.dateStart);
    $("#dateEnd").val(response.dateEnd);
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
                $.ajax({
                    url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+$("#idSprint").val(),
                    type:"DELETE",
                    success:function(data)
                    {
                        var box = bootbox.alert("Sprint deleted successfully.");
                            setTimeout(function() {
                            box.modal('hide');
                            window.location.replace('sprintList.html?project='+idProject); //redirect to storyList.html
                        }, 3000); 
                    },
                    error:function(xhr, status, error)
                    {
                        bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                    }
                });
            }
        });
    });
}



//Put here all calls that you want to launch at the page startup      
$(document).ready(function()
{
    //Get parameters idProject and idSprint in url if it exists
    var idProject = $(document).getUrlParam("project");
    var idSprint = $(document).getUrlParam("sprint");


    //Get information from the Web Service, display in the form
    if(idSprint!=="" && idSprint!==null) 
    {
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint,
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success:function(reponse)
            {
                fillForm($.parseJSON(reponse));
                bindDeleteUserStoryEvent(idProject);
            },
            error:function(xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType:'text',
            converters:'text json'
        });
    }


    //Action on #formSprint form
    $('#formSprint').submit(function() 
    {
        //Case 1 : create a new sprint (idSprint is empty)
        if (idSprint==null || idSprint.length==0)
        {
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/add/'+idProject,
                type:"POST",
                data:JSON.stringify($('#formSprint').serializeObject()),
                dataType:"json",
                contentType:"application/json; charset=utf-8",
                success:function(data)
                {
                    bootbox.alert('Sprint has been added successfully.');
                    window.location.replace('sprintList.html?project='+idProject); //redirect to sprintList.html
                },
                error:function (xhr, status, error)
                {
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                }
            });
        }
        else //Case 2 : update an existing sprint (idSprint is not empty)
        {
            console.log(JSON.stringify($('#formSprint').serializeObject()));
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idProject,
                type:"PUT",
                data:JSON.stringify($('#formSprint').serializeObject()),
                dataType:"json",
                contentType:"application/json; charset=utf-8",
                success:function(data)
                {
                    var box = bootbox.alert("Sprint has been updated successfully.");
                                setTimeout(function() {
                                box.modal('hide');
                                window.location.replace('sprintList.html?project='+idProject+''); //redirect to storyList.html
                            }, 3000);
                }
            });
        }

        return false;
    });
});