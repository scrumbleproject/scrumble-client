
/** story methods **/



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    fillForm($.parseJSON(reponse));
    bindDeleteUserStoryEvent(idProject);
}



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
                var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+$("#idUserstory").val();
                $.deleteObjFromDatabase(url, 'User story', 'storyList.html?project='+idProject);
            }   

        });

    });
}

function cancelButton(){
    $("button.btn-cancel-userStory").live('click',function(e){
        $.goBack();
    });
}

/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function()
{
    //get parameters idUserstory and idProject in url if exists
    idUserstory = $(document).getUrlParam("userstory");
    idProject = $(document).getUrlParam("project");
        
    //load data on form
    if((idUserstory !=="") && (idUserstory !==null))
    {
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory);
    }


    //action on #formStory form
    $('#formStory').submit(function()
    {
        //Get #idUserstory field value  
        var idUserstory = $("#idUserstory").val();

        //Case 1 : create a new story (idUserstory is empty)
        if (idUserstory==null || idUserstory.length==0)
        {
            var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/add/'+idProject;
            var formdata=JSON.stringify($('#formStory').serializeObject());
            $.postObjToDatabase(url, formdata, 'User story', 'storyList.html?project='+idProject);
        }
        else //Case 2 : update an existing story (idUserstory is not empty)
        {
            var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idProject;
            var formdata=JSON.stringify($('#formStory').serializeObject());
            $.putObjToDatabase(url, formdata, 'User story', 'storyList.html?project='+idProject);
        }

        return false;
    });
});