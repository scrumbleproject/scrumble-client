$(function() {
	
	$('#nav-bar').load('navBar.html');
	//$('#left-menu').load('leftMenu.html');

	displayed_page = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);

	$.showLeftMenu($(document).getUrlParam("project"), leftMenu[displayed_page]);
	

});
