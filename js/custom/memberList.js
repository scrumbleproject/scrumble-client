
/** memberList methods **/



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
                                            "<td><a class='btn' href='member.html?member="+dico.idMember+"'><i class='icon-pencil'></i></a>" +
          "<a class='btn btn-danger btn-danger btn-delete' href='"+dico.idMember+"'><i class='icon-trash'></i></a></td>"+
                                            "</tr>");
        });   
    }
    else //if only one member
    {
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



//add an event on <a> delete button
function bindDeleteEvent()
{
    //fetch each <a> delete button
    $("a.btn-delete").each( function()
    {
        //get a reference on the current fetched element
        $btn = $(this);

        //add event on click on this button
        $btn.live('click', function(e)
        {
            //show a confirm box
            e.preventDefault();
            bootbox.confirm("Are you sure to delete this member ?", function(confirmed)
            {
                if (confirmed) 
                {             
                    $.ajax({
                        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+$btn.attr("href"),
                        type:"DELETE",
                        success:function(data)
                        {
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
$(document).ready(function()
{
    $.ajax({
        url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/all',
        type:'GET',
        contentType:'application/json; charset=UTF-8',
        success:function(reponse)
        {
            displayAllItems($.parseJSON(reponse));
            bindDeleteEvent();
        },
        error:function (xhr, status, error)
        {
            bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
        },
        dataType:'text',
        converters:'text json'
    });
});