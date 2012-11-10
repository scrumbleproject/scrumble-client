
/** Members methods **/

//fill the form with data about one member
function fillForm(response) {
  $("#idMember").val(response.idMember);
  $("#idRole").val(response.idRole);
  $("#firstname").val(response.firstname);
  $("#lastname").val(response.lastname);
  $("#login").val(response.login);
  $("#email").val(response.email);
  $("#password").val(response.password);
}


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
			$("#memberList > tbody").append("<td>"+dico.role+"</td>");
			$("#memberList > tbody").append("<td>"+dico.email+"</td>");
			$("#memberList > tbody").append("<td><a class='btn' href='member.html?idMember="+dico.idMember+"'><i class='icon-pencil'></i></a>" +
          "<a class='btn btn-danger btn-danger btn-delete' href='"+dico.idMember+"'><i class='icon-trash'></i></a></td>");
			$("#memberList > tbody").append("</tr>");
		});   
	}
	else { //if only one member
		$("#memberList > tbody").append("<tr>");
		$("#memberList > tbody").append("<td>"+(i+1)+"</td>");
		$("#memberList > tbody").append("<td>"+items.member1.firstname+"</td>");
		$("#memberList > tbody").append("<td>"+items.member1.lastname+"</td>");
		$("#memberList > tbody").append("<td>"+items.member1.login+"</td>");
		$("#memberList > tbody").append("<td>"+items.member1.role+"</td>");
		$("#memberList > tbody").append("<td>"+items.member1.email+"</td>");
		$("#memberList > tbody").append("<td><a class='btn' href='member.html?idMember="+items.member1.idMember+"'><i class='icon-pencil'></i></a>" +
          "<a class='btn btn-danger btn-danger btn-delete' href='"+items.member1.idMember+"'><i class='icon-trash'></i></a></td>");
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
    var idMember = $(document).getUrlParam("idMember");		
	
	//load data on list or on form
    if ( (idMember !=="") && (idMember !==null)) {
        $.ajax({
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+idMember,
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
	else {
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
