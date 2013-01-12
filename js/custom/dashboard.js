
/** dashboard methods **/



//Display the breadCrumb trail
function displayBreadCrumb()
{
        $("#breadcrumb").append('<ul class="breadcrumb">'+
            '<li class="active">Home</li>'+
        '</ul>');
}



/** Put here all calls that you want to launch at the page startup **/      
$(document).ready(function() 
{
    //display the breadcrumb trail
    displayBreadCrumb();
});