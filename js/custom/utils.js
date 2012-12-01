

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


