$(function() {
	
	$('#nav-bar').load('navBar.html');
	//$('#left-menu').load('leftMenu.html');


	$.showLeftMenu($(document).getUrlParam("project"), leftMenu[window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1,window.location.pathname.length)]);
	

});
