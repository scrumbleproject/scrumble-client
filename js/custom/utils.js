

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
 * Get trigramm of a firstname and lastname
 */
$.trigramm = function(firstname, lastname){
    return firstname.substr(0,1)+lastname.substr(0,1)+lastname.substr(lastname.length-1,1);
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
                                  '<li id="left-menu-option-story"><a href="storyList.html?project='+idProject+'">Stories</a></li>'+
                                  '<li id="left-menu-option-sprint"><a href="sprintList.html?project='+idProject+'">Sprints</a></li>'+
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
                                      '<li id="left-menu-option-member"><a href="memberList.html">Members</a></li>'+
                                    '</ul>'+
                                '</div>');
    }

    $("li#"+active).addClass("active");
}

/**
 * Ajax function to get data from the database
 */
$.getObjFromDatabase = function(url_ws, level)
{
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

/**
 * Ajax function to get data from the database
 */
$.getObjFromDatabaseAndCallback = function(url_ws, callback)
{

    $.ajax({
        url: url_ws,
        type:'GET',
        contentType:'application/json; charset=UTF-8',
        success: function(reponse) 
        {
            callback(reponse);
        },
        error:function (xhr, status, error)
        {
            bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
        },
        dataType:'text',
        converters:'text json'
    });
}

/**
 * Ajax function to send new data to the database
 */
$.postObjToDatabase = function(url_ws, form, message, redirect)
{
    if(form!='') 
    {
         $.ajax({
            url:url_ws,
            type:"POST",
            data:form,
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            success:function(data)
            {
                if(message!='')
                    bootbox.alert(message+' has been added successfully.');
                if(redirect!='')
                    window.location.replace(redirect);
                    //window.location.href = redirect;

            },
            error:function(xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            }
        });
    }
    else
    {
        $.ajax({
            url:url_ws,
            type:"POST",
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            success:function(data)
            {
                if(message!='')
                    bootbox.alert(message+' has been added successfully.');
                if(redirect!='')
                    window.location.replace(redirect);
                    //window.location.href = redirect;
                    
            },
            error:function(xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            }
        });
    }
}

/**
 * Ajax function to send new data to the database
 */
$.postObjToDatabaseAndCallback = function(url_ws, form, message, callback)
{
    if(form!='') 
    {
         $.ajax({
            url:url_ws,
            type:"POST",
            data:form,
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            success:function(data)
            {
                //if(message!='')
                    //bootbox.alert(message+' has been added successfully.');
                if(callback!=null)
                    callback();
            },
            error:function(xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            }
        });
    }
    else
    {
        $.ajax({
            url:url_ws,
            type:"POST",
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            success:function(data)
            {
                //if(message!='')
                    //bootbox.alert(message+' has been added successfully.');
                if(callback!=null)
                    callback();
            },
            error:function(xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            }
        });
    }
}

/**
 * Ajax function to update data in the database
 */
$.putObjToDatabase = function(url_ws, form, message, redirect)
{
    if(form!='') 
    {
         $.ajax({
            url:url_ws,
            type:"PUT",
            data:form,
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            success:function(data)
            {
                if(message!='')
                {
                    var box = bootbox.alert(message+" has been updated successfully.");
                    if(redirect!='')
                    {
                        setTimeout(function()
                        {
                            box.modal('hide');
                            window.location.replace(redirect);
                        }, 3000);
                    }
                }
                else
                {
                    if(redirect!='')
                        window.location.replace(redirect);
                }
            },
            error:function(xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            }
        });
    }
    else
    {
        $.ajax({
            url:url_ws,
            type:"PUT",
            dataType:"json",
            contentType: "application/json; charset=utf-8",
            success:function(data)
            {
                if(message!='')
                {
                    var box = bootbox.alert(message+" has been updated successfully.");
                    if(redirect!='')
                    {
                        setTimeout(function()
                        {
                            box.modal('hide');
                            window.location.replace(redirect);
                        }, 3000);
                    }
                }
                else
                {
                    if(redirect!='')
                        window.location.replace(redirect);
                }
            },
            error:function(xhr, status, error)
            {
                bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
            }
        });
    }
}

/**
 * Ajax function to update data in the database
 */
$.deleteObjFromDatabase = function(url_ws, message, redirect)
{
    $.ajax({
        url:url_ws,
        type:"DELETE",
        dataType:"json",
        contentType: "application/json; charset=utf-8",
        success:function(data)
        {
            if(message!='')
            {
                var box = bootbox.alert(message+" deleted successfully.");
                if(redirect!='')
                {
                    setTimeout(function()
                    {
                        box.modal('hide');
                        window.location.replace(redirect);
                    }, 3000);
                }
            }
            else
            {
                if(redirect!='')
                    window.location.replace(redirect);
            }
        },
        error:function(xhr, status, error)
        {
            bootbox.alert('Erreur : '+xhr.responseText+' ('+status+' - '+error+')');
        }
    });
}

/**
 * Ajax function to display the breadcrumb trail
 */
$.showBreadCrumb = function(myTab)
{
    var chaine = '<ul class="breadcrumb">';
    for(var valeur in myTab)
    {
        if(valeur!=="")
        {
            chaine += '<li>'+
                            '<a href="'+valeur+'">'+myTab[valeur]+'</a> <span class="divider">/</span>'+
                        '</li>';
        }
        else
        {
            chaine += '<li class="active">'+myTab[valeur]+'</li>';
        }
    }
    chaine += '</ul>';
    $("#breadcrumb").append(chaine);
}

$.goBack = function()
{
    //Fetch the back url
    var url=document.referrer;
    //Show a confirm box
    e.preventDefault();
    bootbox.confirm("Are you sure to cancel ?",function(confirmed){
        if (url == 'http://scrumble-project.com/*')
        {
            window.location.href=window.history.back();
        }
        else
        {
            window.location.href='http://scrumble-project.com/scrumble-client/html/login.html'
        }
    });
}

$.showLastVisitedTab = function() { 
  $('a[data-toggle="tab"]').on('shown', function (e) {
    localStorage.setItem('lastTab', $(e.target).attr('id'));
  });

  //go to the latest tab, if it exists:
  var lastTab = localStorage.getItem('lastTab');
  if (lastTab) {
      $('#'+lastTab).tab('show');
  }
}


/**
 * Function to convert dates
 */
function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  return Date.UTC(parts[0], parts[1]-1, parts[2]);
}