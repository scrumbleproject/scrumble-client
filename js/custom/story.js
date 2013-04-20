
/** story methods **/



//Display the breadCrumb trail
function displayBreadCrumb(idProject,idUserstory)
{
    if(idUserstory=="" || idUserstory==null)
    {
        var myTab = new Array();

        myTab['dashboard.html'] = 'Home';
        myTab['projectDashboard.html?project='+idProject+''] = 'Project (ID: '+idProject+')';
        myTab['storyList.html?project='+idProject+''] = 'User Story Backlog';
        myTab[''] = 'New User Story';

        $.showBreadCrumb(myTab);
    }
    else
    {
        var myTab = new Array();

        myTab['dashboard.html'] = 'Home';
        myTab['projectDashboard.html?project='+idProject+''] = 'Project '+idProject+'';
        myTab['storyList.html?project='+idProject+''] = 'User Story Backlog';
        myTab[''] = 'Update User Story';

        $.showBreadCrumb(myTab);
    }
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    fillForm($.parseJSON(reponse));
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

function enableEdition(){
    console.log("enableEdition");
    //actions button for userstories  
    $("div.user_story .btn").each(function(){
        console.log($(this));
        //$(this).css("display","inline-block");
        $(this).show();
    });

    bindDeleteUserStoryEvent(idProject);
    bindDeleteTaskEvent(idUserstory);
}

function disableEdition(){
    
    console.log("disableEdition");  

    //form for adding task
    $("#taskList form:last-child").hide();
    
    //warning msg to inform user that user story cannot be edited
    $("#msg").addClass("alert fade in");
    //$("#msg").html("<button class='close' data-dismiss='alert' type='button'>×</button>This user story cannot be edited as it is used in a running sprint.");
    $("#msg").html("This user story cannot be edited as it is used in a running sprint.");

    //readonly for all input
    $("div.user_story form input, div.user_story form select, div.user_story form textarea").each(function(){
        $(this).attr('disabled', 'disabled');
    });
}


function handleEditMode(){

    var idUserstory = $(document).getUrlParam("userstory");

    if((idUserstory !=="") && (idUserstory !==null)){

        $.ajax({
            url: 'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.userStories+'/'+idUserstory+"/iseditable",
            type:'GET',
            success: function(reponse) 
            {
                console.log(reponse);  
                if (reponse=="true"){
                    enableEdition();
                } else {
                    disableEdition();
                }
            },
            error:function (xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            }
        });
    }


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

    //display the breadcrumb trail
    displayBreadCrumb(idProject,idUserstory);
    
    //keep in memory last tab visited
    $.showLastVisitedTab();

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