		//var renderTable = 
		function afficherListe(items){
			//alert('afficherListe');
			if (items.member1.length>1){
				//afficher le tableau
				$("#usersList > tbody").html("");
				$.each(items.member1, function(i, dico){
					$("#usersList > tbody").append("<tr>");
					$("#usersList > tbody").append("<td>"+dico.idMember+"</td>");
					$("#usersList > tbody").append("<td>"+dico.firstname+"</td>");
					$("#usersList > tbody").append("<td>"+dico.lastname+"</td>");
					$("#usersList > tbody").append("<td>"+dico.login+"</td>");
					$("#usersList > tbody").append("<td></td>");
					$("#usersList > tbody").append("<td>"+dico.email+"</td>");
					$("#usersList > tbody").append("<td><a class='btn' href='user.html'><i class='icon-pencil'></i></a>" +
                  "<a class='btn btn-danger btn-danger' href='user.html'><i class='icon-trash'></i></a></td>");
					$("#usersList > tbody").append("</tr>");
				});   
			}
			else {
				$("#usersList > tbody").append("<tr>");
				$("#usersList > tbody").append("<td>"+items.idMember+"</td>");
				$("#usersList > tbody").append("<td>"+items.firstname+"</td>");
				$("#usersList > tbody").append("<td>"+items.lastname+"</td>");
				$("#usersList > tbody").append("<td>"+items.login+"</td>");
				$("#usersList > tbody").append("<td></td>");
				$("#usersList > tbody").append("<td>"+items.email+"</td>");
				$("#usersList > tbody").append("<td></td>");
				$("#usersList > tbody").append("</tr>");
			}
		}

		$(document).ready( function() {
			
			$.ajax({
                url:'http://192.168.0.11:8080/scrumble-server-web/scrumble/members/all',
                type:'GET',
				        contentType:'application/json; charset=UTF-8',
                success: function(reponse) {
					      //alert('GET');
                    afficherListe($.parseJSON(reponse));
                    
                },
				error:function (xhr, status, error){
					alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
				},
        dataType: 'text',
        converters: 'text json'

            });
		

			
			/*$.getJSON("http://localhost:8080/scrumble-server-web/scrumble/members/all",
				function(reponse) {
					alert('GET');
					//afficherListe(reponse.member1);
				}
			);*/
			/*$.getJSON("http://localhost:8080/scrumble-server-web/scrumble/members/all?callback=?",
				function(reponse) {
					alert('GET');
					//console.log(reponse);
					//afficherListe(reponse.member1);
				}
			);*/
			

			

		});
