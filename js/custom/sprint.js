
/** sprint functions **/

//Fill the form with data about one sprint
function fillForm(response) 
{
    console.log(response);
    $("#idSprint").val(response.idSprint);
    $("#idProject").val(response.idProject.idProject);
    $("#numSprint").val(response.numSprint);
    $("#title").val(response.title);
    $("#velocity").val(response.velocity);
    $("#dateStart").val(response.dateStart);
    $("#dateEnd").val(response.dateEnd);
    $("#duree").val(response.duree);
}



/** Put here all calls that you want to launch at the page startup **/      
$(document).ready( function() 
{
    //Get parameter idProject in url if it exists
    var idProject = $(document).getUrlParam("project");
    //Get parameter idSprint in url if it exists
    var idSprint = $(document).getUrlParam("sprint");
    
    if(idSprint !=="" && idSprint !==null) 
    {
        $('#btn-delete').show();
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/'+idSprint,
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success: function(reponse) {
                fillForm($.parseJSON(reponse));
            },
            error:function (xhr, status, error){
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType: 'text',
            converters: 'text json'
        });
    }



    //action on #formUser form
    $('#formUser').submit(function() 
    {
        //Get #idMember field value 
        var idMember = $("#idMember").val();
        //Get #idRole field value 
        var idProject = $("#idProject").val();

        if (idMember==null || idMember.length==0) {
            //Case 1 : create a new member (idMember is empty)
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints+'/add',
                type:"POST",
                data: JSON.stringify($('#formSprint').serializeObject()),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                        bootbox.alert('Sprint has been added successfully.');
                        window.location.replace('sprintList.html'); //redirect to sprintList.html
                },
                error:function (xhr, status, error){
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                }
            });
        }
        else { //Case 2 : update an existing member (idMember is not empty)
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.sprints,
                type:"PUT",
                data: JSON.stringify($('#formSprint').serializeObject()),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    bootbox.alert("Sprint has been updated successfully.");
                    window.location.replace('sprintList.html'); //redirect to sprintList.html
                }
            });
        }

        return false;
    });

});