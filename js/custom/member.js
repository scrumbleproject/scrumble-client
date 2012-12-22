
/** member methods **/


//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    selected_role=fillForm($.parseJSON(reponse));
    bindDeleteEvent();
    getRoles(selected_role);
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjSecondLevel(reponse)
{
    displayRoles($.parseJSON(reponse),selected_role);
}



//fill the form with data about one member
function fillForm(response)
{
    $("#idMember").val(response.idMember);
    $("#firstname").val(response.firstname);
    $("#lastname").val(response.lastname);
    $("#login").val(response.login);
    $("#email").val(response.email);
    $("#internalPhone").val(response.internalPhone);
    $("#mobilePhone").val(response.mobilePhone);
    $("#password").val(response.password);
    return response.idRole.idRole;
}



//get the list of all roles
function getRoles(selected_role)
{
    $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.roles+'/all', 2);
}



//display roles
function displayRoles(items, selected_role)
{
    $("#idRole").html("");

    //if more than one members
    if (items.role.length>1)
    {
        var chaine="";
        $.each(items.role, function(i, dico){
            if(selected_role!=dico.idRole)
            {
                chaine += "<option value='"+dico.idRole+"'>"+dico.title+"</option>";
            }
            else
            {
                chaine += "<option value='"+dico.idRole+"' selected>"+dico.title+"</option>";
            }
        });
    }
    else //if only one role
    {
        chaine += "<option value='"+items.role.idRole+"'>"+items.role.title+"</option>";
    }

    $('#idRole').append(chaine);
}



//add an event on <a> delete button
function bindDeleteEvent()
{
    $('#btn-delete').show();

    //Fetch each <a> delete button
    $('#btn-delete').live('click', function(e)
    {
        //Show a confirm box
        e.preventDefault();
        bootbox.confirm("Are you sure to delete this member ?", function(confirmed) 
        {
            if (confirmed)
            {
                $.ajax({
                    url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+$("#idMember").val(),
                    type:"DELETE",
                    success:function(data)
                    {
                        var box = bootbox.alert("Member deleted successfully.");
                        setTimeout(function()
                        {
                            box.modal('hide');
                            window.location.replace('memberList.html'); //redirect to memberList.html
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

        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function()
{
    //get param idMember in url if exists
    var idMember = $(document).getUrlParam("member");
    
    //load data on a form
    selected_role="";
    if( (idMember !=="") && (idMember !==null)) 
    {
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+idMember);
    }
    else
    {
        getRoles(selected_role);
    }

    //action on #formUser form
    $('#formUser').submit(function() 
    {
        //Get #idMember field value 
        var idMember = $("#idMember").val();
        //Get #idRole field value 
        var idRole = $("#idRole").val();

        if(idMember==null || idMember.length==0)
        {
            //Case 1 : create a new member (idMember is empty)
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/add/'+idRole,
                type:"POST",
                data: JSON.stringify($('#formUser').serializeObject()),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success:function(data)
                {
                    bootbox.alert('Member has been added successfully.');
                    window.location.replace('memberList.html'); //redirect to memberList.html
                },
                error:function(xhr, status, error)
                {
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                }
            });
        }
        else //Case 2 : update an existing member (idMember is not empty)
        {
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+idRole,
                type:"PUT",
                data: JSON.stringify($('#formUser').serializeObject()),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success:function(data)
                {
                    bootbox.alert("Member has been updated successfully.");
                    window.location.replace('memberList.html'); //redirect to memberList.html
                }
            });
        }

        return false;
    });
});