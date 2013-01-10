
/** projectMember methods **/



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjFirstLevel(reponse)
{
    var dico = $.responseMemberToDictionaryString($.parseJSON(reponse));
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
}



//function called by $.getObjFromDatabase function (utils.js)
function successGetObjSecondLevel(reponse)
{
    displayAllItems($.parseJSON(reponse));
    bindDeleteEvent();
}



//display all items
<<<<<<< HEAD
function displayAllItems(items){
	if (items.member1.length>1){ //if more than one members
		$("#memberList > tbody").html("");
		$.each(items.member1, function(i, dico){
			$("#memberList > tbody").append("<tr>");
			$("#memberList > tbody").append("<td>"+(i+1)+"</td>");
			$("#memberList > tbody").append("<td>"+dico.firstname+"</td>");
			$("#memberList > tbody").append("<td>"+dico.lastname+"</td>");
			$("#memberList > tbody").append("<td>"+dico.login+"</td>");
			$("#memberList > tbody").append("<td></td>");
			$("#memberList > tbody").append("<td>"+dico.email+"</td>");
			$("#memberList > tbody").append("<td>"+dico.internalPhone+"</td>");
			$("#memberList > tbody").append("<td>"+dico.mobilePhone+"</td>");
			$("#memberList > tbody").append("<td><a class='btn btn-danger btn-danger btn-delete' href='"+dico.idMember+"'><i class='icon-remove'></i></a></td>");
			$("#usersList > tbody").append("</tr>");
		});   
	}
	else { //if only one member
		$("#memberList > tbody").append("<tr>");
		$("#memberList > tbody").append("<td>1</td>");
		$("#memberList > tbody").append("<td>"+items.member1.firstname+"</td>");
		$("#memberList > tbody").append("<td>"+items.member1.lastname+"</td>");
		$("#memberList > tbody").append("<td>"+items.member1.login+"</td>");
		$("#memberList > tbody").append("<td></td>");
		$("#memberList > tbody").append("<td>"+items.member1.email+"</td>");
		$("#memberList > tbody").append("<td>"+items.member1.internalPhone+"</td>");
		$("#memberList > tbody").append("<td>"+items.member1.mobilePhone+"</td>");
		$("#memberList > tbody").append("<td><a class='btn btn-danger btn-danger btn-delete' href='"+items.member1.idMember+"'><i class='icon-remove'></i></a></td>");
		$("#memberList > tbody").append("</tr>");
	}
=======
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
>>>>>>> d3e9f5b520cf70704a192e4eed21fa46a7706e4d
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
                        var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject+'/'+config.resources.projectMembers+'/'+$btn.attr("href");
                        $.deleteObjFromDatabase(url, 'Member', 'projectMember.html?project='+idProject);
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
    
    //get param idProject in url if exists
    idProject = $(document).getUrlParam("project");

    //enable autocompletion display
    idMembers = new Array();
    subjects = new Array();

    $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject+'/'+config.resources.projectMembers+'/no');

    //load data on list or on form
    if ( (idProject !=="") && (idProject !==null))
    {
        $.getObjFromDatabase('http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject+'/'+config.resources.projectMembers, 2);
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
            var url='http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.projects+'/'+idProject+'/'+config.resources.projectMembers+'/'+idMember;
            var formdata='';
            $.postObjToDatabase(url, formdata, 'Member', 'projectMember.html?project='+idProject);
        }
        
        return false;
    });
});
