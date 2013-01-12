
/** member methods **/



//Display the breadCrumb trail
function displayBreadCrumb(idMember)
{
    if(idMember=="" || idMember==null)
    {
        var myTab = new Array();

        myTab['dashboard.html'] = 'Home';
        myTab['memberList.html'] = 'Member List';
        myTab[''] = 'New Member';

        $.showBreadCrumb(myTab);
    }
    else
    {
        var myTab = new Array();

        myTab['dashboard.html'] = 'Home';
        myTab['memberList.html'] = 'Member List';
        myTab[''] = 'Update Member';

        $.showBreadCrumb(myTab);
    }
}



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
                var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+$("#idMember").val();
                $.deleteObjFromDatabase(url, 'Member', 'memberList.html');
            }
        });
    });
}

        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function()
{
    //get param idMember in url if exists
    var idMember = $(document).getUrlParam("member");

    //display the breadcrumb trail
    displayBreadCrumb(idMember);
    
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
        //Get #Login field value
        var login = $("#login").val();
        //Get #FirstName field value
        var firstname = $("#firstname").val();
        //Get #LastName field value
        var lastname = $("#lastname").val();
        //Get #Password fiel value
        var password = $("#password").val();

        if(idMember==null || idMember.length==0)
        {
            if (login==null || fisrtname == null || lastname == null || password == null)
            {
            }
            else
            {
                //Case 1 : create a new member (idMember is empty)
                var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/add/'+idRole;
                var formdata=JSON.stringify($('#formUser').serializeObject());
                $.postObjToDatabase(url, formdata, 'Member', 'memberList.html');
            }
        }
        else //Case 2 : update an existing member (idMember is not empty)
        {
            if (login==null || fisrtname == null || lastname == null || password == null)
            {
            }
            else
            {
                var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+idRole;
                var formdata=JSON.stringify($('#formUser').serializeObject());
                $.putObjToDatabase(url, formdata, 'Member', 'memberList.html');
            }
        }

        return false;
    });
});