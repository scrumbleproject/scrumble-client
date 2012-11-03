
/** Project Members methods **/



//display all items
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
		$("#memberList > tbody").append("<td><a class='btn btn-danger btn-danger btn-delete' href='"+items.member1.idMember+"'><i class='icon-remove'></i></a></td>");
		$("#memberList > tbody").append("</tr>");
	}
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
			
			var idProject = $(document).getUrlParam("idProject");
			
			if (idProject != null && idProject > 0) {
		        bootbox.confirm("Are you sure to remove this member from the project ?", function(confirmed) {

					if (confirmed) {             
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
	
	//load left-menu	
	$('#left-menu').load('leftMenu.html', function(response, status, xhr) {
		if (status == "error") {
			var msg = "Sorry leaf-menu cannot be loaded: ";
			bootbox.alert(msg + xhr.status + " " + xhr.statusText);
		}
		else { //if successful
			//select the related option in left-menu
			$("li#left-menu-option-member").addClass("active");
		} 		
	});
	
	//get param idMember in url if exists
    var idProject = $(document).getUrlParam("idProject");
	
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
		var idProject = $(document).getUrlParam("idProject");
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
