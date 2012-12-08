/** Authentication and cookie handle methods **/



/**
 * Use this function to create a cookie with authorization parameters
 */
$.createCookie = function(login, token){

    //create json dictionary
    var authObject = {
                        "login" : login,
                        "token" : token
                    };

    $.cookie(config.cookieName,         //cookie name
        JSON.stringify(authObject),     //value
        { //options
           expires : 1,                 //expires in 1 days
           // path    : '/',           //The value of the path attribute of the cookie 
           //                          //(default: path of page that created the cookie).
           // domain  : 'localhost',   //The value of the domain attribute of the cookie
           //                          //(default: domain of page that created the cookie).
           // secure  : false          //If set to true the secure attribute of the cookie
           //                          //will be set and the cookie transmission will
           //                          //require a secure protocol (defaults to false).
        }
    );
}


/**
 * Use this function to set header before sending a request
 */
$.setHeaderAuthorization = function(xhr){
    
    if ($.cookie(config.cookieName)!=null){ //if cookie is already created

        var authObject = $.getCookieAsObject();

        xhr.setRequestHeader("Authorization", authObject.login+":"+authObject.token);

    }
    
}

/**
 * Get cookie as object
 */
$.getCookieAsObject = function(){

    return $.parseJSON($.cookie(config.cookieName));
}

/**
 * Use this function to get login from cookie
 */
$.getLoginFromCookie = function(){

    var authObject = $.getCookieAsObject();
    return authObject.login;
}



