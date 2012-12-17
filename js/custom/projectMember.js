
/** projectMember methods **/



//display all items
function displayAllItems(items)
{
    //if more than one members
    if (items.member1.length>1)
    {
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
                                            "<td><a class='btn btn-danger btn-danger btn-delete' href='"+dico.idMember+"'><i class='icon-remove'></i></a></td>"+
                                            "</tr>");
        });   
    }
    else //if only one member
    {
        $("#memberList > tbody").append("<tr>"+
                                        "<td>1</td>"+
                                        "<td>"+items.member1.firstname+"</td>"+
                                        "<td>"+items.member1.lastname+"</td>"+
                                        "<td>"+items.member1.login+"</td>"+
                                        "<td>"+items.member1.idRole.title+"</td>"+
                                        "<td>"+items.member1.email+"</td>"+
                                        "<td>"+items.member1.internalPhone+"</td>"+
                                        "<td>"+items.member1.mobilePhone+"</td>"+
                                        "<td><a class='btn btn-danger btn-danger btn-delete' href='"+items.member1.idMember+"'><i class='icon-remove'></i></a></td>"+
                                        "</tr>");
    }
}



//add an event on <a> delete button
function bindDeleteEvent()
{
    //fetch each <a> delete button
    $("a.btn-delete").each( function()
    {
        //add event on click on this button
        $(this).live('click', function(e)
        {
            //get a reference on the current element
            $btn = $(this);

            //show a confirm box
            e.preventDefault();
            
            var idProject = $(document).getUrlParam("project");
            if (idProject != null && idProject > 0) 
            {
                bootbox.confirm("Are you sure to remove this member from the project ?", function(confirmed)
                {
                    if(confirmed)
                    {             
                        $.ajax({
                            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject+'/'+config.resources.projectMembers+'/'+$btn.attr("href"),
                            type:"DELETE",
                            success: function(data) {
                                bootbox.alert("Member removed from the project successfully.");
                                location.reload(); //reload page
                            }
                        });
                    }
                });
            }
        });
    });
}



function bindTypeAheadEvent(){
}



/** Put here all calls that you want to launch at the page startup **/      
$(document).ready( function() {
    
    //get param idMember in url if exists
    var idProject = $(document).getUrlParam("project");

    //enable autocompletion display
    var idMembers = new Array();
    var subjects = new Array();
    $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject+'/'+config.resources.projectMembers+'/no',
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success: function(response) {
                var dico = $.responseMemberToDictionaryString($.parseJSON(response));
                $.each(dico, function(key,value) {
                    idMembers.push(key); 
                    subjects.push(value); 
                });
                $('#input-member').typeahead({
                    source: subjects,
                    updater: function(selectedObj) { 
                        var index = $.inArray(selectedObj, subjects);
                        if (index > -1) {
                            $("#idMember").val(idMembers[index]);
                        } 
                        return selectedObj;                     
                    },                  
                });
                bindTypeAheadEvent();
            },
            error:function (xhr, status, error){
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType: 'text',
            converters: 'text json'
        });

    //load data on list or on form
    if ( (idProject !=="") && (idProject !==null)) {
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject+'/'+config.resources.projectMembers,
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

    //action on #formProjectMember form
    $('#formProjectMember').submit(function(e) {
        
        //preventDefault
        e.preventDefault();
        
        //Get #idProject and #idMember field value  
        var idProject = $(document).getUrlParam("project");
        var idMember = $("#idMember").val();
        
        if (idProject!=null && idProject.length>0 &&
            idMember!=null && idMember.length>0) {
            //Add a new member to the project
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject+'/'+config.resources.projectMembers+'/'+idMember,
                type:"POST",
                success: function(data) {
                    bootbox.alert('Member has been added successfully.');
                    location.reload(); //reload page    
                },
                error:function (xhr, status, error){
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                }
            });
        }
        
        return false;
    });
});