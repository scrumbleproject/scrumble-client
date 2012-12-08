
/** Login methods **/

function handleAuthenticationResponse(login, token){

    if (typeof(token)!='undefined' && token.length>6){
        alert("login="+login+"\ntoken="+token);
        $.createCookie(login, token);
    }
}

        
/** Put here all calls that you want to launch at the page startup **/      
$(document).ready( function() {


    //action on #formUser form
    $('#loginForm').submit(function() {
        //alert('submit');
        //Get #idMember field value 
        var login = $("#inputUsername").val();
        //Get #idRole field value 
        var pwd = $("#inputPassword").val();

        if (login==null || login.length==0) {
            //alert user that login is not specified
        } else if(pwd==null || pwd.length==0){
            //alert user that password is not specified
        }
        else {
            //Case 1 : create a new member (idMember is empty)
            $.ajax({
                url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.authentication+'/'+login+'/'+pwd,
                type:"POST",
                dataType:"text",
                success: function(response) {
                    if ($.trim(response) != ''){
                        handleAuthenticationResponse(login, $.trim(response));
                        window.location.replace('dashboard.html'); //redirect to memberList.html
                    }
                    else {
                        bootbox.alert('Authentication failed ! please retry !'); 
                    }
                },
                error:function (xhr, status, error){
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                }
            });
        }

        return false;
    });
    
});





