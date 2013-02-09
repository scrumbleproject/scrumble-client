$(function()
{

    var scripts = [
        "../js/lib/jquery.cookie.js",

        "../js/lib/bootstrap-plugins/bootbox.min.js",
        "../js/lib/bootstrap-core/bootstrap-transition.js",
        "../js/lib/bootstrap-core/bootstrap-alert.js",
        "../js/lib/bootstrap-core/bootstrap-modal.js",
        "../js/lib/bootstrap-core/bootstrap-dropdown.js",
        "../js/lib/bootstrap-core/bootstrap-scrollspy.js",
        "../js/lib/bootstrap-core/bootstrap-tab.js",
        "../js/lib/bootstrap-core/bootstrap-tooltip.js",
        "../js/lib/bootstrap-core/bootstrap-popover.js",
        "../js/lib/bootstrap-core/bootstrap-button.js",
        "../js/lib/bootstrap-core/bootstrap-collapse.js",
        "../js/lib/bootstrap-core/bootstrap-carousel.js",
        "../js/lib/bootstrap-core/bootstrap-typeahead.js",
        "../js/lib/jquery.getUrlParam.js",
        "../js/custom/config.js",
        "../js/custom/utils.js",
        "../js/custom/auth.js",
        "../js/custom/page.js",   
        "../js/lib/highchart/highcharts.js",
        "../js/lib/highchart/exporting.js"    
    ];

    for(var i=0; i<scripts.length; i++){
        $.ajax({
            url:scripts[i],
            async:false,
            dataType:"script"
        });
    }

});
