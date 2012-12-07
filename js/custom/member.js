
/** Members methods **/

//fill the form with data about one member
function fillForm(response) {
    $("#idMember").val(response.idMember);
    $("#firstname").val(response.firstname);
    $("#lastname").val(response.lastname);
    $("#login").val(response.login);
    $("#email").val(response.email);
    $("#internalPhone").val(reponse.internalPhone);
    $("#mobilePhone").val(reponse.externalPhone);
    $("#password").val(response.password);
    return response.idRole.idRole;
}



//display all items
function displayAllItems(items){
    if (items.member1.length>1){ //if more than one members
        $("#memberList > tbody").html("");
        $.each(items.member1, function(i, dico){
            $("#memberList > tbody").append("<tr>"+
                                            "<td>"+(i+1)+"</td>"+
                                            "<td>"+dico.firstname+"</td>"+
                                            "<td>"+dico.lastname+"</td>"+
                                            "<td>"+dico.login+"</td>"+
                                            "<td>"+dico.idRole.title+"</td>"+
                                            "<td>"+dico.email+"</td>"+
                                            "<td>"+dico.internalPhone+"</td>"+
                                            "<td>"+dico.mobilePhone+"</td>"+
                                            "<td><a class='btn' href='member.html?member="+dico.idMember+"'><i class='icon-pencil'></i></a>" +
          "<a class='btn btn-danger btn-danger btn-delete' href='"+dico.idMember+"'><i class='icon-trash'></i></a></td>"+
                                            "</tr>");
        });   
    }
    else { //if only one member
        $("#memberList > tbody").append("<tr>"+
                                            "<td>"+(i+1)+"</td>"+
                                            "<td>"+items.member1.firstname+"</td>"+
                                            "<td>"+items.member1.lastname+"</td>"+
                                            "<td>"+items.member1.login+"</td>"+
                                            "<td>"+items.member1.idRole.title+"</td>"+
                                            "<td>"+items.member1.email+"</td>"+
                                            "<td>"+items.member1.internalPhone+"</td>"+
                                            "<td>"+items.member1.mobilePhone+"</td>"+
                                            "<td><a class='btn' href='member.html?member="+items.member1.idMember+"'><i class='icon-pencil'></i></a>" +
          "<a class='btn btn-danger btn-danger btn-delete' href='"+items.member1.idMember+"'><i class='icon-trash'></i></a></td>"+
                                        "</tr>");
    }
}



//get the list of all roles
function getRoles(selected_role)
{

    $.ajax({
        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.roles+'/all',
        type:'GET',
        contentType:'application/json; charset=UTF-8',
        success: function(reponse) 
        {
            displayRoles($.parseJSON(reponse),selected_role);
        },
        error:function (xhr, status, error){
            bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
        },
        dataType: 'text',
        converters: 'text json'
    });
}



//display roles
function displayRoles(items, selected_role)
{
    $("#idRole").html("");

    if (items.role.length>1){ //if more than one members
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
    else { //if only one role
        chaine += "<option value='"+items.role.idRole+"'>"+items.role.title+"</option>";
    }

    $('#idRole').append(chaine);
}



//add an event on <a> delete button
function bindDeleteEvent(){
    
    //fetch each <a> delete button
    $("a.btn-delete").each( function(){
        
        //get a reference on the current fetched element
        $btn = $(this);

        //add event on click on this button
        $btn.live('click', function(e){
        
            //show a confirm box
            e.preventDefault();
            bootbox.confirm("Are you sure to delete this member ?", function(confirmed) {

                if (confirmed) {             
                    $.ajax({
                        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+$btn.attr("href"),
                        type:"DELETE",
                        success: function(data) {
                            bootbox.alert("Member deleted successfully.");
                            location.reload(); //reload page
                        }
                    });
                }   

            });
            
        }); 

    });
}

        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready( function() {

    //get param idMember in url if exists
    var idMember = $(document).getUrlParam("member");
    
    //load data on list or on form
    if (displayed_page!="memberList.html")
    {
        var selected_role="";
        if ( (idMember !=="") && (idMember !==null)) 
        {
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+idMember,
                type:'GET',
                contentType:'application/json; charset=UTF-8',
                success: function(reponse) {
                    selected_role=fillForm($.parseJSON(reponse));
                    getRoles(selected_role);
                },
                error:function (xhr, status, error){
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                },
                dataType: 'text',
                converters: 'text json'
            });
        }
        else
        {
            getRoles(selected_role);
        }
    }
    else{//member list
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/all',
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success: function(reponse) {
                displayAllItems($.parseJSON(reponse));
                bindDeleteEvent();
            },
            error:function (xhr, status, error){
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType: 'text',
            converters: 'text json'
        }); 
    }


    

    //action on #formUser form
    $('#formUser').submit(function() {
        
        //Get #idMember field value 
        var idMember = $("#idMember").val();

        if (idMember==null || idMember.length==0) {
            //Case 1 : create a new member (idMember is empty)
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/add',
                type:"POST",
                data: JSON.stringify($('#formUser').serializeObject()),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                        bootbox.alert('Member has been added successfully.');
                        window.location.replace('memberList.html'); //redirect to memberList.html
                },
                error:function (xhr, status, error){
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                }
            });
        }
        else { //Case 2 : update an existing member (idMember is not empty)
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members,
                type:"PUT",
                data: JSON.stringify($('#formUser').serializeObject()),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    bootbox.alert("Member has been updated successfully.");
                    window.location.replace('memberList.html'); //redirect to memberList.html
                }
            });
        }

        return false;
    });
    
});





