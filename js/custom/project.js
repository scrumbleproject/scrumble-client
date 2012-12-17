
/** project methods **/


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
                $.ajax({
                    url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+$("#idProject").val(),
                    type:"DELETE",
                    success: function(data) {
                        var box = bootbox.alert("Project deleted successfully.");
                        setTimeout(function()
                        {
                            box.modal('hide');
                            window.location.replace('projectList.html'); //redirect to projectList.html
                        }, 3000); 
                    },
                    error:function (xhr, status, error)
                    {
                        bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                    }
                });
            }
        });
    });
}


        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function() 
{
    //get param idProject in url if exists
    var idProject = $(document).getUrlParam("project");

    //load data on form
    if((idProject !=="") && (idProject !==null))
    {
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject,
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success: function(reponse) {
                fillForm($.parseJSON(reponse));
                bindDeleteEvent();
            },
            error:function (xhr, status, error){
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType:'text',
            converters:'text json'
        });
    }


    //action on #formProject form
    $('#formProject').submit(function()
    {
        //Get #idProject field value    
        var idProject = $("#idProject").val();

        if(idProject==null && idProject.length==0)
        {
            //Case 1 : create a project (idProject is empty)
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/add',
                type:"POST",
                data: JSON.stringify($('#formProject').serializeObject()),
                dataType:"json",
                contentType: "application/json; charset=utf-8",
                success:function(data)
                {
                    bootbox.alert('Project has been added successfully.');
                    window.location.replace('projectList.html'); //redirect to memberList.html
                },
                error:function(xhr, status, error)
                {
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                }
            });
        }
        else //Case 2 : update an existing member (idProject is not empty)
        {
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects,
                type:"PUT",
                data: JSON.stringify($('#formProject').serializeObject()),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success:function(data)
                {
                    bootbox.alert("Project has been updated successfully.");
                    window.location.replace('projectList.html'); //redirect to projectList.html
                }
            });
        }

        return false;
    });
});