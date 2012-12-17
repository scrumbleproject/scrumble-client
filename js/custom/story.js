
/** story methods **/

//fill the form with data about one user story
function fillForm(response)
{
    $("#idUserstory").val(response.idUserstory);
    $("#title").val(response.title);
    $("#demonstration").val(response.demonstration);
    $("#estimation").val(response.estimation);
    $("#importance").val(response.importance);
    $("#note").val(response.note);
}



//add an event on delete <button> 
function bindDeleteUserStoryEvent(idProject){

    $("button.btn-delete-userStory").show();
    
    //fetch each <a> delete button
    $("button.btn-delete-userStory").live('click', function(e){
        
        //show a confirm box
        e.preventDefault();
        bootbox.confirm("Are you sure to delete this user story ?", function(confirmed) {

            if (confirmed) {             
                $.ajax({
                    url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+$("#idUserstory").val(),
                    type:"DELETE",
                    success: function(data) {
                        var box = bootbox.alert("User story deleted successfully.");
                            setTimeout(function() {
                            box.modal('hide');
                            window.location.replace('storyList.html?project='+idProject+''); //redirect to storyList.html
                        }, 3000); 
                    },
                    error:function (xhr, status, error){
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
    //get parameters idUserstory and idProject in url if exists
    var idUserstory = $(document).getUrlParam("userstory");
    var idProject = $(document).getUrlParam("project");
        
    //load data on form
    if((idUserstory !=="") && (idUserstory !==null)) {
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory,
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


    //action on #formStory form
    $('#formStory').submit(function()
    {
        //Get #idUserstory field value  
        var idUserstory = $("#idUserstory").val();

        //Case 1 : create a new story (idUserstory is empty)
        if (idUserstory==null || idUserstory.length==0)
        {
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/add/'+idProject,
                type:"POST",
                data:JSON.stringify($('#formStory').serializeObject()),
                dataType:"json",
                contentType: "application/json; charset=utf-8",
                success:function(data)
                {
                    bootbox.alert('User story has been added successfully.');
                    window.location.replace('storyList.html?project='+idProject+''); //redirect to storyList.html
                },
                error:function (xhr, status, error)
                {
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                }
            });
        }
        else //Case 2 : update an existing story (idUserstory is not empty)
        {
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idProject,
                type:"PUT",
                data:JSON.stringify($('#formStory').serializeObject()),
                dataType:"json",
                contentType: "application/json; charset=utf-8",
                success:function(data)
                {
                    var box = bootbox.alert("User story has been updated successfully.");
                    setTimeout(function()
                    {
                        box.modal('hide');
                        window.location.replace('storyList.html?project='+idProject+''); //redirect to storyList.html
                    }, 3000);
                },
                error:function(xhr, status, error)
                {
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                }
            });
        }

        return false;
    });
});