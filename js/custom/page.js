function isDisplayable(response)
{
    if($(document).getUrlParam("project") !=="" && $(document).getUrlParam("project") !==null)
    {
        $.ajax(
        {
            url:'http://'+config.hostname+':'+config.port+'/'+config.rootPath+'/'+config.resources.members+'/'+response+'/'+$(document).getUrlParam("project")+'/isdisplayable',
            async:false,
            type:'GET',
            contentType:'application/json; charset=UTF-8',
            success:function(rep)
            {
                item = $.parseJSON(rep);
                if(!item)
                {
                    window.location.replace("dashboard.html");
                }
            },
            error:function(xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            },
            dataType:'text',
            converters:'text json'
        });
    }
}

$(function() 
{
    $('#nav-bar').load('navBar.html');

    displayed_page = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
    $.showLeftMenu($(document).getUrlParam("project"), leftMenu[displayed_page]);
});