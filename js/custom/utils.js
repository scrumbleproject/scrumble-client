

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
$.showLeftMenu = function(idProject, active){
    if(idProject !=="" && idProject !==null)
    {
        $('#left-menu').append('<div class="well sidebar-nav">'+
                                '<ul class="nav nav-list">'+
                                  '<li class="nav-header">Sidebar</li>'+
                                  '<li id="left-menu-option-project"><a href="dashboardProject.html?project='+idProject+'">Project</a></li>'+
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
                                      '<li id="left-menu-option-project"><a href="projectsList.html">Projects</a></li>'+
                                      '<li id="left-menu-option-module"><a href="modules.html">Modules</a></li>'+
                                      '<li id="left-menu-option-member"><a href="memberList.html">Members</a></li>'+
                                    '</ul>'+
                                '</div>');
    }

    $("li#"+active).addClass("active");    
    //load left-menu    
    /*$('#left-menu').load('leftMenu.html', function(response, status, xhr) {
        if (status == "error") {
            var msg = "Sorry leaf-menu cannot be loaded: ";
            bootbox.alert(msg + xhr.status + " " + xhr.statusText);
        }
        else { //if successful
            //select the related option in left-menu
            $("li#left-menu-option-member").addClass("active");
        }       
    });*/
}
