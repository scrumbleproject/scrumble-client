$(document).ready(function() {
    $.getJSON('http://localhost/users.json',function(data){
        $.each(data, function (entryIndex, entry){
            html+=entry;
        });
        alert("JSON Data: " + json.nom);
    });
    
});