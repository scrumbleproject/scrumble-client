
/** Login methods **/


        
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
                success: function(data) {
                    alert("response="+data);
                    window.location.replace('dashboard.html'); //redirect to memberList.html
                },
                error:function (xhr, status, error){
                    bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
                }
            });
        }

        return false;
    });
    
});





