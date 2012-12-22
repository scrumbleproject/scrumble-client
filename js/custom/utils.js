

/** Utils function for JSON **/

/**
 * Convert all fields of a form to a JSON-like dictonnary 
 */ 
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
        
    return o;
};


/**
 * Use this function to replace null value by a String to display instead of "undefined"
 */
$.nvl = function(value, replacement){
	if (value == null) return replacement;
	return value;
}

/**
 * Use this fonction to convert simple ajax response into list of element (string)
 */
$.responseMemberToArrayString = function(items){
	var results = new Array();
	$.each(items.member1, function(i, dico){
		results.push(dico.firstname+" "+dico.lastname);
	});
	return results;
}

/**
 * Use this fonction to convert simple ajax response into dictonnary of element (string)
 */
$.responseMemberToDictionaryString = function(items){
	var results = {};
	$.each(items.member1, function(i, dico){
		results[dico.idMember] = dico.firstname+" "+dico.lastname;
	});
	return results;
}

/**
 * Use this fonction to truncate text at a specified string length
 */
$.truncateText = function(text, length){
    if (text.length<=length) {
        return text;
    }
    else {
        return $.trim(text).substring(0, length)  + "...";
    }
}

/**
 * Use this fonction to show left menu dynamically
 */
$.showLeftMenu = function(idProject, active, type){
    if(idProject !=="" && idProject !==null)
    {
        $('#left-menu').append('<div class="well sidebar-nav">'+
                                '<ul class="nav nav-list">'+
                                  '<li class="nav-header">Sidebar</li>'+
                                  '<li id="left-menu-option-project"><a href="projectDashboard.html?project='+idProject+'">Project</a></li>'+
                                  '<li id="left-menu-option-sprint"><a href="sprintList.html?project='+idProject+'">Sprint</a></li>'+
                                  '<li id="left-menu-option-story"><a href="storyList.html?project='+idProject+'">Story</a></li>'+
                                  '<li id="left-menu-option-member"><a href="projectMember.html?project='+idProject+'">Members</a></li>'+
                                '</ul>'+
                            '</div>');
    }
    else
    {
         $('#left-menu').append('<div class="well sidebar-nav">'+
                                    '<ul class="nav nav-list">'+
                                      '<li class="nav-header">Sidebar</li>'+
                                      '<li id="left-menu-option-dashboard"><a href="dashboard.html">Dashboard</a></li>'+
                                      '<li id="left-menu-option-project"><a href="projectList.html">Projects</a></li>'+
                                      '<li id="left-menu-option-module"><a href="modules.html">Modules</a></li>'+
                                      '<li id="left-menu-option-member"><a href="memberList.html">Members</a></li>'+
                                    '</ul>'+
                                '</div>');
    }

    $("li#"+active).addClass("active");
}

/**
 * Use this fonction to truncate text at a specified string length
 */
$.getObjFromDatabase = function(url_ws, level){
    if(!level) 
        level = 1;

    $.ajax({
        url: url_ws,
        type:'GET',
        contentType:'application/json; charset=UTF-8',
        success: function(reponse) 
        {
            if(level==1)
                successGetObjFirstLevel(reponse);
            else
                successGetObjSecondLevel(reponse);
        },
        error:function (xhr, status, error)
        {
            bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
        },
        dataType:'text',
        converters:'text json'
    });
}